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

var raspTime = [
    ['2','40'],
    ['3','20'],
    ['6','40'],
    ['7','20'],
    ['10','40'],
    ['11','20'],
    ['14','40'],
    ['15','20'],
    ['18','40'],
    ['19','20'],
    ['22','40'],
    ['23','20']
];
var isDay = true;
var endOfNight = 0;
var endOfDay = ['0','0'];
var time = new Array;

checkRasp();
setInterval(checkRasp, 60000);

function checkRasp(){
    getTime();    
    for(var i = 0; i < 12;){
        if (i < 10){
            if (time[1] > raspTime[i + 2][0]){
                endOfDay[1] = 0;
            }
            else{
                endOfDay[1] = raspTime[i + 2][0] - time[1];
            }
        }        
        if ((time[1] == raspTime[i][0]) && (time[2] == (raspTime[i][1] - 30))){
            client.channels.get(main).send("@everyone, ВНИМАНИЕ! 30 минут до наступления ночи, всем подготовиться...");
        }    
        if ((time[1] == raspTime[i][0]) && (time[2] == raspTime[i][1])){
            client.channels.get(main).send("@everyone, Наступила ночь, у вас есть 40 минут повышенного опыта. Приятного фарма!");
            isDay = false;
        }
        if ((time[1] == raspTime[i + 1][0]) && (time[2] == raspTime[i + 1][1])){
            client.channels.get(main).send("@everyone, И снова день, до следующей ночи 3 часа 20 минут. Расходимся!");
            endOfDay[1] = raspTime[i + 2][0] - raspTime[i + 1][0];
            isDay = true;
        }           
        i += 2;
    }
    dayNightTime();
}

function dayNightTime(){
    if (!isDay){        
        if (time[2] > 20){
            endOfNight = 80 - time[2];
        }
        else{
            endOfNight = 20 - time[2];
        }
        client.user.setGame(`Ночь. ${endOfDay[1]} ч. ${endOfDay[0]} мин.`);
    }    
    else{
        if ((40 - time[2]) < 0){
            endOfDay[0] = 100 - time[2];
            endOfDay[1] -= 1;
        }
        else{
            endOfDay[0] = 40 - time[2];
        }
        client.user.setGame(`День. ${endOfNight} мин.`);
    }
}

function nowDay(){
    if (isDay){
        return `Сейчас день. До наступления ночи осталось ${endOfDay[1]} ч. ${endOfDay[0]} мин.`;
    }
    else{
        return `Сейчас ночь. До наступления утра осталось ${endOfNight} мин.`;
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
    client.user.setGame("Hello!");
});

client.on('guildMemberAdd', member => {    
    client.channels.get(general).send(`Приветствуем в ги НАВЬ, ${member}`);
});

client.on('message', message => {
    console.log(message.content);
    switch(message.content){
        case prefix + 'h': message.reply("Список команд: \n!h - помощь\n!day - День или ночь? Оставшееся время."); break;
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