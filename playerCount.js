const fetch = require("node-fetch");
// p04ched.minehut.gg
const minehutApi = 'https://api.minehut.com/server/5f029ecfa46afa0067aea75e'

function getServerInfo(){
    return new Promise(resolve => {
        fetch(minehutApi, {method: "Get"})
            .then(res => res.json())
            .then((json) => {
                let playerCount = json["server"]["playerCount"];
                resolve(playerCount);
            })
            .catch((err) => {
                console.error(err);
            })
    })
}

let playerCount = async function(msg) {
    const result = await getServerInfo();
    msg.reply(`There are currently ${result} people in the p04ched minecraft server.`);
}

module.exports = playerCount;