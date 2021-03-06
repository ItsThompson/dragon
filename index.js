const Discord = require("discord.js");
const { Client } = require("pg");
const client = new Discord.Client({
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
});
const playerCount = require("./commands/playerCount.js");
// const inVoice = require('./commands/inVoice.js');
const register = require("./commands/register.js");
const streamVc = require("./commands/streamVc.js");
const roleFunc = require("./commands/role.js");
const config = require("./commands/config.js");
const ping = require("./commands/ping.js");

const prefix = process.env.PREFIX; //drag!

const databaseError = `
An error occurred!\n
 1. Check if the database is down with (drag! status)\n
 2. This could be because this server has not been configured! (Use drag! config to configure)`;

const connectionString = process.env.DATABASE_URL;

let row;

const postgresClient = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false },
});

postgresClient.connect().then(() => console.log("Connected Sucessfully"));

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("@OiThompson on twitter", { type: "PLAYING" });
});

client.on("message", (msg) => {
    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (msg.author.bot) return;

    console.log("Server Name: " + msg.guild.name + 
        "\nChannel Name: " + msg.channel.name + 
        "\nMessage Author: " + msg.author.tag + 
        "\nMessage Content: " + msg.content + "\n");
    
    if (msg.content === 'who asked'){
        msg.channel.send('I did');
    }

    switch (command) {
        case "test": {
            msg.channel.send(
                "_ _ \n_ _ \n_ _ \n@OiThompson on twitter\n_ _ \n_ _ \n_ _"
            );
            break;
        }
        // case 'voice':{
        //     let channel = 'channelId'; //#🎥Streaming
        //     inVoice(channel, msg, client);
        //     break;
        // }
        case "count": {
            postgresClient.query(`SELECT "mcServer" FROM configs WHERE "guildId" = '${msg.guild.id}'`,)
                .then(async (results) => {
                    try {
                        results.rows[0]["mcServer"]
                    } catch (error) {
                        msg.reply('Please use configure your discord server before you use this command. (drag! config)')
                        return;
                    }
                    playerCount(msg, Discord, results.rows[0]["mcServer"]); 
                });
            break;
        }
        case "stream": {
            streamVc(msg, postgresClient, msg.guild.id, databaseError);
            break;
        }
        case "say": {
            // Only allows me to use the say command.
            if (msg.member.user.id == "218865201821384705") {
                const response = args.join(" ");
                msg.delete();
                msg.channel.send(response);
            } else {
                msg.channel.send(":clown: ");
            }
            break;
        }
        case "register": {
            let amongUsName = args[0];
            let twitch = args[1];
            let discord = msg.author.username;
            register(postgresClient, amongUsName, twitch, discord, msg, client, msg.guild.id, prefix);
            break;
        }
        case "role": {
            let title = args[0];
            let role = args[1];
            roleFunc(title, role, msg, postgresClient, prefix);
            break;
        }
        case "config": {
            config(msg, Discord, client, postgresClient);
            break;
        }
        case "ping": {
            ping(msg,client);
            break;
        }
        default:
            break;
    }
});

client.on("messageReactionAdd", async (reaction, user) => {
    if (user.bot) return;
    if (!reaction.message.guild) return;

    if (reaction.message.partial) {
        try {
            await reaction.message.fetch();
        } catch (error) {
            console.error(error);
        }
    }
    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.error(error);
            return;
        }
    }

    let channelId = reaction.message.channel.id;
    let messageId = reaction.message.id;
    let emoji = reaction.emoji.name;

    postgresClient
        .query(
            `SELECT * FROM roles WHERE "roleChannel" = '${reaction.message.channel.id}'`
        )
        .then(async (results) => {
            row = results.rows;

            for (i in row) {
                if (
                    channelId === row[i]["roleChannel"] &&
                    messageId === row[i]["msgId"]
                ) {
                    if (emoji === "👍") {
                        await reaction.message.guild.members.cache
                            .get(user.id)
                            .roles.add(row[i]["roleId"]);
                    }
                }
            }
        })
        .catch((error) => console.error(error));
});

client.on("messageReactionRemove", async (reaction, user) => {
    if (user.bot) return;
    if (!reaction.message.guild) return;

    if (reaction.message.partial) {
        try {
            await reaction.message.fetch();
        } catch (error) {
            console.error(error);
        }
    }
    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.error(error);
            return;
        }
    }

    let channelId = reaction.message.channel.id;
    let messageId = reaction.message.id;
    let emoji = reaction.emoji.name;

    postgresClient
        .query(
            `SELECT * FROM roles WHERE "roleChannel" = '${reaction.message.channel.id}'`
        )
        .then(async (results) => {
            row = results.rows;

            for (i in row) {
                if (
                    channelId === row[i]["roleChannel"] &&
                    messageId === row[i]["msgId"]
                ) {
                    if (emoji === "👍") {
                        console.log(row[i]["msgId"]);
                        await reaction.message.guild.members.cache
                            .get(user.id)
                            .roles.remove(row[i]["roleId"]);
                    }
                }
            }
        })
        .catch((error) => console.error(error));
});

client.login(process.env.BOT_TOKEN);
