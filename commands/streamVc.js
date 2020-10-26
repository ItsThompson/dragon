let output = function(msg, postgresClient, guildId, databaseError){

    postgresClient.query(`SELECT "streamVc", "verifiedRole" FROM configs WHERE "guildId" = '${guildId}'`,)
        .then(async (results) => {
            let target = results.rows[0]["streamVc"]
            let verified = results.rows[0]["verifiedRole"]

            if(msg.member.voice.channel){
                let bool;
        
                for(var i = 0;  i < msg.member.roles.member._roles.length; i++){
                    if(msg.member.roles.member._roles[i] == verified || msg.member.permissions.has("ADMINISTRATOR")){
                        msg.member.voice.setChannel(target);
                        bool = true;
                    }
                }
                if(bool){
                    msg.member.voice.setChannel(target);
                    msg.reply('Moved you into 🎥Streaming');
                }
                else{
                    msg.reply('Sorry! You do not have permission!');
                }
            }
            else{
                msg.reply('Sorry! Please join a voice channel before using this command.')
            }
        })
        .catch((error) => {
            console.error(error);
            msg.reply(databaseError)
        });
}
module.exports = output;