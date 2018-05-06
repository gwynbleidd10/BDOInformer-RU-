const Discord = require('discord.js');
const client = new Discord.Client();

const prefix = '!';

client.on('ready', () => {
    console.log('I am ready!');
  });

client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.find('name', '⚽главная');
    if (!channel) return;
    channel.send(`Приветствуем в ги НАВЬ, ${member}`);
  });

client.on('message', message => {
    console.log(message.content);
    switch(message.content){
        case prefix + 'h': message.reply("Список команд: \n!h - помощь\n"); break;
        case prefix + 'rofl': 
        /*var count = Math.floor(Math.random() * (client.users.array().length - 0)) + 0;
        var stat;
        if (Math.floor((Math.random() * (2 - 0)) + 0) == true){
            stat = 'бомж!';
        }
        else stat = 'не бомж!';client.users.array()[count] + stat*/
        message.reply(':P'); break;
    }
});

client.login(process.env.BOT_TOKEN);
