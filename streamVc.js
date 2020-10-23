let output = function(target, msg, verified){

    if(msg.member.voice.channel){
        let bool;

        for(var i = 0;  i < msg.member.roles.member._roles.length; i++){
            if(msg.member.roles.member._roles[i] == verified){
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
}
module.exports = output;