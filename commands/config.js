let output = function(msg, Discord, client, postgresClient){
    const filter = (m) => {
        return m.content === m.content;
    };
    if (msg.member.permissions.has("ADMINISTRATOR") || msg.member == msg.guild.owner) {
        msg.channel
            .send(
                "**(1/3)** For the `drag! stream` command, please write down the stream voice channel id to be moved into."
            )
            .then(() => {
                msg.channel
                    .awaitMessages(filter, {
                        max: 1,
                        time: 30000,
                        errors: ["time"]
                    })
                    .then((collected) => {
                        streamVoice = collected.first().content;
    
                        try {
                            client.channels.cache.get(streamVoice).name;
                        } catch (error) {
                            if(streamVoice != 'n/a'){
                                msg.reply('Stream voice channel id is invalid');
                                return;
                            }
                        }
    
                        msg.channel
                            .send("**(2/3)** For the `drag! stream` command, please write down the verified role id.")
                            .then(() => {
                                msg.channel
                                    .awaitMessages(filter, {
                                        max: 1,
                                        time: 30000,
                                        errors: ["time"]
                                    })
                                    .then((collected) => {
                                        verifiedRole = collected.first().content;
    
                                        try {
                                            msg.guild.roles.cache.get(verifiedRole).name;
                                        } catch (error) {
                                            if(verifiedRole != 'n/a'){
                                                msg.reply('Stream voice channel id is invalid');
                                                return;
                                            }                
                                        }
    
                                        console.log('verified role id');
    
                                        msg.channel
                                            .send(
                                                "**(3/3)** For the `drag! register` command, please write down the output channel."
                                            )
                                            .then(() => {
                                                msg.channel
                                                    .awaitMessages(filter, {
                                                        max: 1,
                                                        time: 30000,
                                                        errors: ["time"]
                                                    })
                                                    .then((collected) => {
                                                        registerOutputChannel = collected.first().content;
    
                                                        try {
                                                            client.channels.cache.get(registerOutputChannel).name;
                                                        } catch (error) {
                                                            if(registerOutputChannel != 'n/a'){
                                                                msg.reply('Stream voice channel id is invalid');
                                                                return;
                                                            }                                
                                                        }
    
                                                        console.log('output');
    
                                                        let embed = new Discord.MessageEmbed()
                                                            .setTitle('Summary')
                                                            .setURL('https://www.youtube.com/watch?v=d1YBv2mWll0')
                                                            .setColor('#29c566')
                                                            .addFields(
                                                                { name: 'Stream Voice Channel', value: client.channels.cache.get(streamVoice).name },
                                                                { name: 'Verified Role', value: msg.guild.roles.cache.get(verifiedRole).name },
                                                                { name: 'Register Output Channel', value: client.channels.cache.get(registerOutputChannel).name }
                                                            )
                                                            .setTimestamp()
                                                            .setFooter('@OiThompson on twitter.')
                                                        msg.channel.send(embed)
                                                        postgresClient.query(`DELETE FROM configs WHERE "guildId" = ${msg.guild.id}`)
                                                            .then(() => {
                                                                msg.reply('Previous config detected, removing old config.')
                                                            })
                                                            .catch(error => console.error(error));
                                                        postgresClient.query(`INSERT INTO configs("guildId", "streamVc", "verifiedRole", "registerOutputChannel") VALUES ('${msg.guild.id}','${streamVoice}','${verifiedRole}','${registerOutputChannel}')`,)
                                                            .catch(error => console.error(error));
                                                    })
                                                    .catch((collected) => {
                                                        msg.channel.send("Time expired")
                                                    })
                                            })
                                            
                                    }).catch((collected) => {
                                        msg.channel.send("Time expired")
                                    })
                            })
                    }).catch((collected) => {
                        msg.channel.send("Time expired")
                    })
            })
    } else {
        msg.reply(
            "Sorry! You will need to have ADMINISTRATOR permissions in order to configure the bot."
        );
    }
}

module.exports = output;