let output = function(msg, client) {
    msg.channel.send(`🏓Latency is ${Date.now() - msg.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
}

module.exports = output;