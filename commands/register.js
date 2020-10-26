let output = function(postgresClient, amongUsName, twitch, discord, msg, client, guildId, prefix){
    postgresClient.query(`SELECT "registerOutputChannel" FROM configs WHERE "guildId" = '${guildId}'`,)
        .then(async (results) => {
            if(amongUsName == undefined || twitch == undefined){
                msg.reply('Usage: ' + prefix + ' register <amongUsName> <twitch>')
            }
            else{
                client.channels.cache.get(results.rows[0]["registerOutputChannel"]).send(`AmongUs: ${amongUsName}\nTwitch: ${twitch}\nDiscord: ${discord}`);
            }
        })
}

module.exports = output;