const Omegle = require('omegle-node');
const Disc = require('discord.js')
const OClient = new Omegle();

module.exports = {
    name: "connect",
    run: async (client, message, args) => {
	    // code not here because all u need is:
	    OClient.connect();
    }
}
