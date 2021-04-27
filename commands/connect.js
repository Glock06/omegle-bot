const Omegle = require('omegle-node');
const Disc = require('discord.js')
const OClient = new Omegle();

module.exports = {
    name: "connect",
    run: async (client, message, args) => {
    let Params = args.join(" ").split(" ");
    let CachedMessages = [];

    let ConEmbed = new Disc.MessageEmbed();
    ConEmbed.setTitle("Connection Established");
    ConEmbed.setDescription(`Connection To Omegle Established.`);
    ConEmbed.setColor("GREEN");

    let UFoundEmbed = new Disc.MessageEmbed();
    UFoundEmbed.setTitle("User Found");
    UFoundEmbed.setDescription(`Now Speaking To Stranger.`);
    UFoundEmbed.setColor("GREEN");

    let FSesEmbed = new Disc.MessageEmbed();
    FSesEmbed.setTitle("Finding New Session");
    FSesEmbed.setDescription(`Attempting To Find Another Session.`);
    FSesEmbed.setColor("ORANGE");

    let UDiscEmbed = new Disc.MessageEmbed();
    UDiscEmbed.setTitle("Stranger Disconnected");
    UDiscEmbed.setColor("RED");
    UDiscEmbed.setTimestamp()

    let MDiscEmbed = new Disc.MessageEmbed();
    MDiscEmbed.setTitle("Disconnected");
    MDiscEmbed.setDescription(`Do You Wish To Find Another Session?`);
    MDiscEmbed.setColor("RED");
    MDiscEmbed.setFooter("Send Yes To Find Another Session Or No To Cancel")

    let CEmbed = new Disc.MessageEmbed();
    CEmbed.setTitle("Talking To Stranger");

    let SMSG = await message.channel.send("Connecting...");
    Params[0] != null ? OClient.connect(Params[0]) : OClient.connect();
    const MCollect = new Disc.MessageCollector(message.channel, (m => m.author.id === message.author.id));

    
    OClient.on('gotID', async function(id) {
        SMSG.edit(ConEmbed);
        console.log(id)
    });

    OClient.on('omerror', function(err) {
        console.error(err);
    });

    OClient.on('strangerDisconnected', () => {
        OClient.disconnect();
        SMSG.delete();
        MCollect.stop();
        message.channel.send(UDiscEmbed)
        message.guild.channels.cache.find(r => r.name === "cached-messages-for-omegle").send(`${message.author.tag} Omegle Chat:\n` + `\`\`\`` +  CachedMessages.join("\n") + `\`\`\``);
        CachedMessages = [];
        delete require.cache[require.resolve(`./connect.js`)];

		try {
			const newCommand = require(`./connect.js`);
			message.client.commands.set(newCommand.name, newCommand);
		} catch (error) {
			console.error(error);
		}
    });

    OClient.on('gotMessage', function(msg) {
        let date = new Date();
        CachedMessages.push(`Stranger Said: ${msg} | ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
        if (CachedMessages.length > 20) CachedMessages.shift()
        CEmbed.setDescription(`\`\`\`${CachedMessages.join("\n")}\`\`\``);
        SMSG.edit(CEmbed);
        OClient.startTyping();
    });

    OClient.on('connected', async function() {
        SMSG.edit(UFoundEmbed);
        MCollect.on('collect', m => {
            if (m.content.toLowerCase() === "disconnect" && OClient.connected) {
                SMSG.delete();
                message.guild.channels.cache.find(r => r.name === "cached-messages-for-omegle").send(`${message.author.tag} Omegle Chat:\n` + `\`\`\`` +  CachedMessages.join("\n") + `\`\`\``);
                OClient.disconnect();
                MCollect.stop();
                CachedMessages = [];
                delete require.cache[require.resolve(`./connect.js`)];

                try {
                    const newCommand = require(`./connect.js`);
                    message.client.commands.set(newCommand.name, newCommand);
                } catch (error) {
                    console.error(error);
                }
                return;
            }

            let date = new Date();
            OClient.send(m.content)
            CachedMessages.push(`You Said: ${m.content} | ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
            if (CachedMessages.length > 20) CachedMessages.shift()
            CEmbed.setDescription(`\`\`\`${CachedMessages.join("\n")}\`\`\``);
            SMSG.edit(CEmbed);

            return;
        })
    });
    }
}
