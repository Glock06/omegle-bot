const {MessageEmbed} = require('discord.js')
const Omegle = require('omegle-node');
const om = new Omegle();
const Discord = require('discord.js')


module.exports = {
    name: "connect",
    description: "connect to omegle server",
    run: async (client, message, args) => {

        let topic = args[0];
        const filter = m => m.author.id === message.author.id
        const collector = new Discord.MessageCollector(message.channel, filter)
        
        if(topic) {
            om.connect(topic);
            om.on('recaptchaRequired',function(challenge){
                
                console.log(challenge);
                
            });
            const sembed = new MessageEmbed()
            .setTitle(`Connected`)
            .setTimestamp()
            .setColor('RANDOM')
            .setDescription(`You have connected to the server, type anything after to send them something, or type exit to leave.`)
             
            om.on('omerror',function(err){
                console.log('error: ' + err);
                message.channel.send('Error: ' + err);
            });

            om.on('gotID',function(id){
                console.log('connected to the server as: ' + id);
                message.channel.send('connecting to the server as: ' + id);
                setTimeout(function(){
                    if(!om.connected()){
                        om.stopLookingForCommonLikes();
                        console.log('Connecting to a random stranger instead...');
                        message.channel.send('No user found. Connecting to a random stranger instead...');
                    }
                }, 20000)
            });

            om.on('waiting', function(){
                console.log('waiting for a stranger.');
            });

            om.on('connected',function(){
                console.log('connected');
                message.channel.send(sembed);
                collector.on('collect', m => {
                    console.log(m.content);

                    if(m.content === "exit"){
                        om.disconnect();
                        return;
                    }

                    om.send(m.content)
                    message.channel.send("You sent stranger: " + m.content)
    
                })
                om.startTyping();
                setTimeout(function(){
                    om.stopTyping();
                },3000);
            });

            om.on('connectionDied', function(){
                console.log('connection died')
            })

            om.on('strangerDisconnected', () => {
                message.channel.send(`Stranger disconnected...`)
                om.disconnect();
            });

            om.on('typing',function(){
                message.channel.send('Stranger is typing...');
            });
            
            om.on('stoppedTyping',function(){
                message.channel.send('Stranger stopped typing.');
            });

            om.on('gotMessage',function(msg){
                message.channel.send('Stranger said: ' + msg);
                om.startTyping();
            });

            return;
        }

        om.connect();
        om.on("recaptchaRequired", function(challenge) {
            console.log(`Captcha Required: ${challenge}`)
        })
        const nembed = new MessageEmbed()
        .setTitle('Connected')
        .setTimestamp()
        .setColor('RANDOM')
        .setDescription('You have connected to a random server, type anything after to send them something, or type exit to leave.')

        om.on('omerror', function(err){
            console.log('error: ' + err)
        });

        om.on('omegleError', function(error){
            return;
        })

        om.on('gotID',function(id){
            console.log('connected to the server as: ' + id);
            message.channel.send('connecting to the server as: ' + id);
            
        });

        om.on('waiting', function(){
            console.log('waiting for a stranger.');
        });

        om.on('connected', function(){
            console.log('connected');
            om.startTyping();
            message.channel.send(nembed);
            collector.on('collect', m => {
                console.log(m.content);
                om.send(m.content)
                message.channel.send("You sent stranger: " + m.content)

            }).catch(e => console.log(e))
            setTimeout(function(){
                om.stopTyping();
            },3000);
        });

        om.on('connectionDied', function(){
            console.log('connection died')
        })

        om.on('strangerDisconnected', () => {
            message.channel.send(`Stranger disconnected...`)
        });

        om.on('typing',function(){
            message.channel.send('Stranger is typing...');
        });
        
        om.on('stoppedTyping',function(){
            message.channel.send('Stranger stopped typing.');
        });

        om.on('gotMessage',function(msg){
            message.channel.send('Stranger said: ' + msg);
            om.startTyping();
        });

            

        

    }
}
