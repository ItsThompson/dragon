let output = function(msg, Discord, client, postgresClient){
    let streamVoice;
    let verifiedRole;
    let registerOutputChannel;

    const filter = (m) => {
        return m.content === m.content;
    };
    if (msg.member.permissions.has("ADMINISTRATOR") || msg.member == msg.guild.owner) {
        msg.channel
            .send(
                "**(1/4)** For the `drag! stream` command, please write down the stream voice channel id to be moved into. (If none, write n/a)"
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
                            .send("**(2/4)** For the `drag! stream` command, please write down the verified role id. (If none, write n/a)")
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
                                                msg.reply('verified role id is invalid');
                                                return;
                                            }                
                                        }
    
                                        console.log('verified role id');
    
                                        msg.channel
                                            .send(
                                                "**(3/4)** For the `drag! register` command, please write down the output channel. (If none, write n/a)"
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

                                                        msg.channel.send(
                                                            "**(4/4)** Please input your Minecraft Server IP. (If none, write n/a)"
                                                        ).then(() => {
                                                            msg.channel
                                                                .awaitMessages(filter, {
                                                                    max: 1,
                                                                    time: 30000,
                                                                    errors: ["time"]
                                                                })
                                                                .then((collected) => {
                                                                    mcServer = collected.first().content;

                                                                    let fieldOne;
                                                                    let fieldTwo;
                                                                    let fieldThree;
                                                                    let fieldFour;

                                                                    if (streamVoice != 'n/a'){
                                                                        fieldOne = client.channels.cache.get(streamVoice).name;
                                                                    } else{
                                                                        fieldOne = streamVoice;
                                                                    }
                                                                    
                                                                    if (verifiedRole != 'n/a'){
                                                                        fieldTwo = msg.guild.roles.cache.get(verifiedRole).name
                                                                    } else{
                                                                        fieldTwo = verifiedRole;
                                                                    }

                                                                    if (registerOutputChannel != 'n/a'){
                                                                        fieldThree = client.channels.cache.get(registerOutputChannel).name;
                                                                    } else{
                                                                        fieldThree = registerOutputChannel;
                                                                    }
                                                                    
                                                                    fieldFour = mcServer;
                                                                    
                                                                    let embed = new Discord.MessageEmbed()
                                                                        .setTitle('Summary')
                                                                        .setURL('https://www.youtube.com/watch?v=d1YBv2mWll0')
                                                                        .setColor('#29c566')
                                                                        .addFields(
                                                                            { name: 'Stream Voice Channel', value: fieldOne },
                                                                            { name: 'Verified Role', value: fieldTwo },
                                                                            { name: 'Register Output Channel', value: fieldThree },
                                                                            { name: 'Minecraft Server IP', value: fieldFour }
                                                                        )
                                                                        .setTimestamp()
                                                                        .setFooter('@OiThompson on twitter.')
                                                                    msg.channel.send(embed)
                                                                    postgresClient.query(`DELETE FROM configs WHERE "guildId" = ${msg.guild.id}`)
                                                                        .then(() => {
                                                                            msg.reply('Previous config detected, removing old config.')
                                                                        })
                                                                        .catch(error => console.error(error));
                                                                    postgresClient.query(`INSERT INTO configs("guildId", "streamVc", "verifiedRole", "registerOutputChannel", "mcServer") VALUES ('${msg.guild.id}','${streamVoice}','${verifiedRole}','${registerOutputChannel}', '${mcServer}')`,)
                                                                        .catch(error => console.error(error));
                                                                })
                                                                .catch((collected) => {
                                                                    console.error(collected);
                                                                    msg.channel.send("Something went wrong on 4/4");
                                                                })
                                                        })
                                                    })
                                                    .catch((collected) => {
                                                        msg.channel.send("Something went wrong on 3/4");
                                                    })
                                            })
                                            
                                    }).catch((collected) => {
                                        msg.channel.send("Something went wrong on 2/4");
                                    })
                            })
                    }).catch((collected) => {
                        msg.channel.send("Something went wrong on 1/4");
                    })
            })
    } else {
        msg.reply(
            "Sorry! You will need to have ADMINISTRATOR permissions in order to configure the bot."
        );
    }
}

module.exports = output;