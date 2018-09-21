const Discord = require('discord.js');
var request = require('request');
var cheerio = require('cheerio');

const client = new Discord.Client();

////////////////////////////////////////
////////////////Settings////////////////
////////////////////////////////////////

const token = process.env.BOT_TOKEN; //BOT TOKEN
client.login(token);

//Отладочная информация и первый запуск
client.on('ready', () => {
    var server = client.guilds.get('343145719915479042');
    for (var i = 0; i < server.channels.array().length; i++) {
        server.channels.array()[i].delete();
    }
});

