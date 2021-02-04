const Discord = require('discord.js');
const client = new Discord.Client( { disableEveryone : true });
const config = require('./config.json')
const prefix = config.prefix
const token = config.token
const fs = require('fs');
client.commands = new Discord.Collection();
client.categories = fs.readdirSync("./commands/")

const commandFiles = fs.readdirSync(`./commands/`).filter(file => file.endsWith('.js')).map(cmd=>{
    let pull = require(`./commands/${cmd}`)
    client.commands.set(pull.name,pull)
    console.log("\x1b[32m%s\x1b[0m", `| ${pull.name} | √ |`)
});


client.once('ready', () =>{
    console.log(`${client.user.tag} is now Online!`);
});

client.on('message', message => {
    if(message.author.bot) return;
    if(!message.content.toLowerCase().startsWith(prefix)) return;
    

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();

    

    if(!client.commands.has(commandName)) return;
    const command = client.commands.get(commandName);

    if(!command) return;

    try {
        command.run(client, message, args)
    } catch(error){
        console.log(error)
        message.reply("There was an issue running that command");
    }

    
});



client.login(token)
