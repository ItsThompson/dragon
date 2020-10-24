const Discord = require('discord.js');


let output = function(title, role, msg, postgresClient){
    let embed = new Discord.MessageEmbed()
        .setTitle(title)
        .setDescription(`React for ${role} role`)
        .setColor('GREEN')

    msg.channel.send(embed).then(function(msg){
        msg.react('👍');
        postgresClient.query(`INSERT INTO roles("roleChannel", "roleId", "msgId") VALUES ('${msg.channel.id}','${role.substring(3).slice(0, -1)}','${msg.id}')`,)
            .catch(error => console.error(error));
    }).catch(function(error){
        console.error(error);
    });
}

module.exports = output;