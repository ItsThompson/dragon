const Discord = require('discord.js');
const client = new Discord.Client({partials: ["MESSAGE", "CHANNEL", "REACTION"]});
const playerCount = require('./playerCount.js');
// We dont need this.
// const inVoice = require('./inVoice.js');
const register = require('./register.js');
const streamVc = require('./streamVc.js');

const prefix = process.env.PREFIX //drag! 

let roleChannel = [];
let roleId = [];
let msgId = [];

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('https://twitter.com/OiThompson', {type: "PLAYING"});
});

client.on('message', msg => {
    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if(msg.author.bot) return;

    console.log(msg.content)

    switch(command){
        case 'test':{
            msg.channel.send('_ _ \n _ _ \n _ _ \nOiThompson on twitter\n_ _ \n _ _ \n _ _').catch(console.error);
            break;
        }
        // case 'voice':{
        //     let channel = '703809525794471937'; //#🎥Streaming
        //     inVoice(channel, msg, client);
        //     break;
        // }
        case 'count':{
            playerCount(msg);
            break;
        }
        case 'stream': {
            let target = '703809525794471937'; //#🎥Streaming
            let verified = '769141366205710367'; //Veried role
            streamVc(target, msg, verified);
            break;
        }
        case 'say':{
            if(msg.member.user.id == '218865201821384705'){
                const response = args.join(' ');
                msg.channel.send(response);
            }
            else{
                msg.channel.send(':clown: ')
            }
            break;
        }
        case 'register':{
            let amongUsName = args[0];
            let twitch = args[1];
            let discord = msg.author.username;
            let channel = '768793935358722049'; // #clearing
            register(channel, amongUsName, twitch, discord, msg, client);
            break;
        }
        case 'role':{
            let title = args[0];
            let role = args[1];
            roleChannel.push(msg.channel.id);
            roleId.push(args[1].substring(3).slice(0, -1));
            let embed = new Discord.MessageEmbed()
                .setTitle(title)
                .setDescription(`React for ${role} role`)
                .setColor('GREEN')

            msg.channel.send(embed).then(function(msg){
                msg.react('👍');
                msgId.push(msg.id);
            }).catch(function(error){
                console.error(error);
            });
            break;
        }
        default:
            break;
    }
});

client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return;
    if (!reaction.message.guild) return;

    if (reaction.message.partial){
        try {
            await reaction.message.fetch();
        } catch(error){
            console.error(error)
        }
    }
    if (reaction.partial){
        try{
            await reaction.fetch()
        } catch(error){
            console.error(error);
            return;
        }
    }

    for(let i = 0; i < roleChannel.length; i++){
        if (reaction.message.channel.id === roleChannel[i] && reaction.message.id == msgId[i]){
            if(reaction.emoji.name === '👍'){
                await reaction.message.guild.members.cache.get(user.id).roles.add(roleId[i]);
            }
        }
    }
})

client.on('messageReactionRemove', async (reaction, user) => {
    if (user.bot) return;
    if (!reaction.message.guild) return;

    if (reaction.message.partial){
        try {
            await reaction.message.fetch();
        } catch(error){
            console.error(error)
        }
    }
    if (reaction.partial){
        try{
            await reaction.fetch()
        } catch(error){
            console.error(error);
            return;
        }
    }

    for(let i = 0; i < roleChannel.length; i++){
        if (reaction.message.channel.id === roleChannel[i] && reaction.message.id == msgId[i]){
            if(reaction.emoji.name === '👍'){
                await reaction.message.guild.members.cache.get(user.id).roles.remove(roleId[i]);
            }
        }
    }
})

// we need to change this to an environment variable.
client.login(process.env.BOT_TOKEN);
