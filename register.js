let output = function(channel, amongUsName, twitch, discord, msg, client){
    if(amongUsName == undefined || twitch == undefined){
        msg.reply('Usage: ' + prefix + 'register <amongUsName> <twitch>')
    }
    else{
        client.channels.cache.get(channel).send(`AmongUs: ${amongUsName}\nTwitch: ${twitch}\nDiscord: ${discord}`);
    }
}

module.exports = output;