const fetch = require("node-fetch");
// 139.99.125.160:25590
let api = '';

function getServerInfo(){
    return new Promise(resolve => {
        fetch(api, {method: "Get"})
            .then(res => res.json())
            .then((json) => {
                try {
                    json["motd"]
                } catch (error) {
                    msg.reply('Please use configure your discord server before you use this command. (drag! config)')
                    return;
                }
                let playerCount = json["players"]["online"];
                if(playerCount > 0){
                    // returns an array
                    let playerList = [];
                    playerList = json["players"]["list"];
                    console.log(Object.values(playerList)[0])
                    // console.log(playerCount + playerList)
                    let returnValue = {
                        playerCount: playerCount,
                        playerList: playerList,
                    };
                    resolve(returnValue);
                }else{
                    let returnValue = {
                        playerCount: playerCount,
                        playerList: [],
                    };
                    resolve(returnValue);
                }
                
            })
            .catch((err) => {
                console.error(err);
            })
    })
}

let output = async function(msg, Discord, mcServer) {
    api = `https://api.mcsrvstat.us/2/${mcServer}`
    const result = await getServerInfo()
    
    if(result.playerCount == 0){
        msg.reply(`There are currently ${result.playerCount} people in the p04ched minecraft server. (Please note that the api updates every 5 minutes)`);
    }else{
        msg.reply(`There are currently ${result.playerCount} people in the p04ched minecraft server. (Please note that the api updates every 5 minutes)`);
        let embed = new Discord.MessageEmbed()
            .setTitle('Player List')
            .setURL('https://www.youtube.com/watch?v=d1YBv2mWll0')
            .setColor('#29c566')
            .addFields(
                {name:'Players', value: result.playerList}
            )
        msg.channel.send(embed)
    }
}

module.exports = output;