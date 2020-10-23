const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.js');
const playerCount = require('./playerCount.js');
// We dont need this
// const inVoice = require('./inVoice.js');
const register = require('./register.js');
const streamVc = require('./streamVc.js');

const prefix = 'drag! '

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

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
        default:
            break;
    }
});

// we need to change this to an environment variable.
client.login(config.discordToken);
