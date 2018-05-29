const Discord = require('discord.js');
const client = new Discord.Client();

var ttoken = process.env.BOT_TOKEN;
//'NDQyMjUxMzI5OTg1ODM5MTA0.Dc8RJw.a32WaDN4-wV3SXootMlk71XZtv8';
var general = '343145719915479042';
var develop = '442299997048799253';
var main = '438294563719872513';
const prefix = '!';

////////////////////////////////////////
/////////////////isDay?/////////////////
////////////////////////////////////////

var raspTime = ['2:40','3:20','6:40','7:20','10:40','11:20','14:40','15:20','18:40','19:20','22:40','23:20'];
var isDay = true;
var endOfNight = 0;
var time = new Array;

setInterval(checkResp, 60000);

function checkResp(){
    getTime();
    for(var i = 0; i < 12;){
        var tmpTime;
        tmpTime = `${time[1]}:${time[2] + 30}`;
        if (tmpTime == raspTime[i]){
            client.channels.get(main).send("@everyone, ВНИМАНИЕ! 30 минут до наступления ночи, всем подготовиться...");
        }
        tmpTime = `${time[1]}:${time[2]}`;        
        if (tmpTime == raspTime[i]){
            client.channels.get(main).send("@everyone, Наступила ночь, у вас есть 40 минут повышенного опыта. Приятного фарма!");
            isDay = false;
        }
        tmpTime = `${time[1]}:${time[2]}`;
        if (tmpTime == raspTime[i + 1]){
            client.channels.get(main).send("@everyone, И снова день, до следующей ночи 3 часа 20 минут. Расходимся!");
            isDay = true;
        }           
        i += 2;
    }
    nightTime();
}

function nightTime(){
    if (!isDay){        
        if (time[2] > 20){
            endOfNight = 80 - time[2];
        }
        else{
            endOfNight = 20 - time[2];
        }
    }    
}

function nowDay(){
    if (isDay){
        return 'Сейчас день.';
    }
    else{
        return `Сейчас ночь. Осталось ${endOfNight} мин.`;
    }
}

function getTime(){
    time[0] = new Date().getDay();
    time[1] = new Date().getUTCHours() + 3;
    time[2] = new Date().getMinutes(); 
};

////////////////////////////////////////
/////////////////Bosses/////////////////
////////////////////////////////////////

var boss = [
    ['Каранда','Древень','Кзарка','Нубэр','Кутум'],
    ['Каранда','Древень','Кзарка','Нубэр','Кутум'],
    ['Каранда','Древень','Кзарка','Нубэр','Кутум'],
    ['Каранда','Древень','Кзарка','Нубэр','Кутум'],
    ['Каранда','Древень','Кзарка','Нубэр','Кутум'],
    ['Каранда','Древень','Кзарка','Нубэр','Кутум'],
    ['Каранда','Древень','Кзарка','Нубэр','Кутум']
    //['Каранда','Древень','Кзарка','Нубэр','Кутум','Трусливый бхег','Грязь','Красный нос']
];
var raspBoss = [];

////////////////////////////////////////
//////////////////Main//////////////////
////////////////////////////////////////

client.login(ttoken);

client.on('ready', () => {
    console.log('BDOInformer started!');
});

client.on('guildMemberAdd', member => {    
    client.channels.get(general).send(`Приветствуем в ги НАВЬ, ${member}`);
});

client.on('message', message => {
    console.log(message.content);
    switch(message.content){
        case prefix + 'h': message.reply("Список команд: \n!h - помощь\n"); break;
        case prefix + 'day': message.reply(nowDay()); break;        
    }
});

/*var count = Math.floor(Math.random() * (client.users.array().length - 0)) + 0;
        var stat;
        if (Math.floor((Math.random() * (2 - 0)) + 0) == true){
            stat = 'бомж!';
        }
        else stat = 'не бомж!';client.users.array()[count] + stat*\/
        message.reply(':P'); break;*/