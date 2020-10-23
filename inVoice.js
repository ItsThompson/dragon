let output = function(channel, msg, client){
    // let inServerVC;
    // let vcServer;
    let streamingVC;
    let vcStreaming;
    // client.channels.fetch("768800069821661184")
    //     .then(channel => {
    //         inServerVC = channel.members.size
    //         vcServer = channel.name
    //     })
    //     .catch(console.error)
    
    client.channels.fetch(channel)
        .then(channel => {
            streamingVC = channel.members.size
            vcStreaming = channel.name
        //     if(inServerVC == 0){
        //         msg.reply(`There are ${streamingVC} in the voice chat **${vcStreaming}** right now.`)
        //     }
        //     else{
        //         msg.reply(`There are ${inServerVC} in the voice chat **${vcServer}** right now.`)
        //     }
            msg.reply(`There are ${streamingVC} in the voice chat **${vcStreaming}** right now.`)
        })
        .catch(console.error)
}

module.exports = output;