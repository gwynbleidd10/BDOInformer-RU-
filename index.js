const Discord = require('discord.js');
var request = require('request');
var cheerio = require('cheerio');

const client = new Discord.Client();

////////////////////////////////////////
////////////////Settings////////////////
////////////////////////////////////////

const token = process.env.BOT_TOKEN; //BOT TOKEN
const develop = '442299997048799253';
const main = develop;//'438294563719872513'; //id канала для бота
const prefix = '!'; //prefix бота

const newPeople = true; //Приветствие новых пользователей
const newPChannel = '343145719915479042'; //id канала для приветствия новых пользователей
const newPMessage = `Приветствуем в ги НАВЬ, `; //Приветственное сообщения для новых пользователей

const bossInform = true; //Информирование о боссах
const bossChannel = '438294563719872513'; //id канала для информирования о боссах

const timeInform = true; //Информаирование о наступлении дня/ночи
const timeChannel = '438294563719872513'; //id канала для информирования о наступлении дня/ночи

////////////////////////////////////////
//////////////////Main//////////////////
////////////////////////////////////////

client.login(token);

//Отладочная информация и первый запуск
client.on('ready', () => {
    console.log('BDOInformer запущен!');
    client.user.setActivity("Проверка");
    //getTech();
    //console.log('getTech выполнен');
    checkRasp();
    console.log('checkRasp выполнен');
    checkBoss();
    console.log('checkBoss выполнен');
});

//Приветствие новых пользователей
client.on('guildMemberAdd', member => {   
    if (newPeople){
        client.channels.get(newPChannel).send(newPMessage + `${member}`);
    }    
});

//Основные команды
client.on('message', message => {
    console.log(message.content);
    switch(message.content){
        case prefix + 'h': message.reply("Список команд: \n!h - помощь\n!day - день или ночь. оставшееся время\n!boss - следующий босс"); break;
        case prefix + 'day': message.reply(nowDay()); break;
        case prefix + 'boss': message.reply(whoNext()); break;   
        case prefix + 'test': message.reply('test'); break;    
    }
});

////////////////////////////////////////
////////////////Day/Night///////////////
////////////////////////////////////////

if (timeInform){
    setInterval(checkRasp, 60000);
};

var raspTime = [
    ['2','40'],
    ['6','40'],
    ['10','40'],
    ['14','40'],
    ['18','40'],
    ['22','40']
];
var techTime = ['8','12','0', '0'];
var isDay = true;
var isTech = false;
var newTech = false;
var endofTech = ['0','0'];
var endOfNight = 0;
var endOfDay = ['0','0'];
var time = new Array;
var techStr;

//Получение даты/времени
function getTime(){
    const days = [
        ['Mon','1'],
        ['Tue','2'],
        ['Wed','3'],
        ['Thu','4'],
        ['Fri','5'],
        ['Sat','6'],
        ['Sun','7']
    ];    
    var tmpTime = new Date().toLocaleDateString('ru', {timeZone: 'Europe/Moscow', day: 'numeric', hour: 'numeric', minute: 'numeric'}).split(' ');
    time[0] = tmpTime[0]; //День  месяца   
    tmpTime = tmpTime[1].split(':');
    time[1] = new Date().toLocaleDateString('ru', {timeZone: 'Europe/Moscow', weekday: 'short'}); //День недели
    for(var i = 0; i < days.length; i++){
        if (time[1] == days[i][0]){
            time[1] = days[i][1];
            break;
        }
    }
    time[1] = parseInt(time[1]);
    time[2] = parseInt(tmpTime[0]);  //Часы
    time[3] = parseInt(tmpTime[1]);  //Минуты
};

function getTech(){
    request('https://forum.gamenet.ru/forumdisplay.php?f=437', function(err, resp, html) {
        if (!err){            
            const $ = cheerio.load(html);
            techStr = $('li .threadinfo').attr('title').trim(); 
            console.log(`Данные о техработах получены: ${techStr}. День: ${techTime[3]}. Начало: ${techTime[0]}. Конец: ${techTime[1]} ч. ${techTime[2]} м.`);   
            techTime[3] = techStr.substr(9,2);        
            if (time[3] == techTime[3]){
                techTime[0] = techStr.substr(22, 1);
                techTime[1] = techStr.substr(30, 2);
                techTime[2] = techStr.substr(34, 2); 
            }
        }
        else{
            console.log("Ошибка получения данных о техработах.")
        }
    });
}

function checkRasp(){
    getTime();
    if (isTech){        
        //Проверка Техработ
        if (time[2] == techTime[1]){
            isTech = false;
            //newTech = true;
        }
        //Конец Техработ
        //endofTech[1] = techTime[1] - time[1] - 1;
        //endofTech[0] = 59 - time[2];        
    }
    else{
        for(var i = 0; i < 6; i++){   
            console.log(i);
            
            //Проверка техработ
            if ((time[2] == (techTime[0] - 1)) && (time[3] == 30)){
                client.channels.get(timeChannel).send("```ВНИМАНИЕ! 30 минут до начала тех. работ!```");
            }  
            if ((time[2] == techTime[0]) && (time[3] == 0)){
                client.channels.get(timeChannel).send("```Тех. работы!```");
                isTech = true;
                //endofTech[1] = techTime[1] - time[1] - 1;
                //endofTech[0] = 59 - time[2];
                break;
            }            
            
            //Время суток
            if ((time[2] == raspTime[i][0]) && (time[3] == (raspTime[i][1] - 30))){
                client.channels.get(timeChannel).send("```ВНИМАНИЕ! 30 минут до наступления ночи, всем подготовиться...```");
                break;
            }    
            if ((time[2] == raspTime[i][0]) && (time[3] == raspTime[i][1])){
                client.channels.get(timeChannel).send("```Наступила ночь, у вас есть 40 минут повышенного опыта. Приятного фарма!```");
                endOfNight = 40;
                isDay = false;
                break;
            }
            if ((time[2] == (raspTime[i][0] + 1)) && (time[3] == (raspTime[i][1] - 20))){
                client.channels.get(timeChannel).send("```И снова день, до следующей ночи 3 часа 20 минут. Расходимся!```");            
                endOfDay[1] = 3;
                endOfDay[0] = 20;
                isDay = true;
                break;
            }
            console.log("Ночь?");
            //Ночь?
            if (((time[2] == raspTime[i][0]) && ((time[3] > raspTime[i][1]) && (time[3] < 60))) || ((time[2] == (raspTime[i][0] + 1)) && ((time[3] >= 0) && ((time[3] < raspTime[i][1] - 20))))){
                isDay = false;
                if (time[3] > 40){
                    endOfNight = 80 - time[3];
                }
                else{
                    endOfNight = 20 - time[3];
                }     
                break;
            }            
            console.log("День?");
            //День?
            if (i < 5){
                if (time[2] < raspTime[i][0]){                   
                    isDay = true;
                    endOfDay[1] = raspTime[i][0] - time[2];
                    if (time[3] >= 40){
                        endOfDay[0] = 100 - time[3];
                        endOfDay[1] -= 1;
                    }
                    else{
                        endOfDay[0] = 40 - time[3];   
                    }    
                    break;
                }
                else if ((time[2] == raspTime[i][0]) && (time[3] < raspTime[i][1])){
                    isDay = true;
                    endOfDay[0] = raspTime[i][1] - time[3];
                    endOfDay[1] = 0;
                    break;
                }
            }
            else{
                if ((time[2] == (raspTime[i][0] + 1)) && (time[3] >= 20)){
                    isDay = true;
                    endOfDay[1] = 25 - time[2];
                    endOfDay[0] = (60 - time[3]) + 40;
                }
            }
            console.log(`Время: ${time}. День: ${isDay}. Техработы: ${isTech} ${techTime} | ${endofTech}. Конец дня: ${endOfDay}. Конец Ночи: ${endOfNight}`);
        }
    }    
    status();
}

function nowDay(){
    if (isTech){
        getTech();
        return `Внимание, идут Техработы, осталось ${endofTech[1]} ч. ${endofTech[0]} мин.`;
    }
    else if (isDay){
        return `Сейчас день. До наступления ночи осталось ${endOfDay[1]} ч. ${endOfDay[0]} мин.`;
    }
    else{
        return `Сейчас ночь. До наступления утра осталось ${endOfNight} мин.`;
    }
}

function status(){
    if (isTech){
        client.user.setActivity(`Техработы. ${endofTech[1]} ч. ${endofTech[0]} мин.`);
    }
    else if (isDay){
        client.user.setActivity(`День. ${endOfDay[1]} ч. ${endOfDay[0]} мин.`);
    }
    else{
        client.user.setActivity(`Ночь. ${endOfNight} мин.`);
    } 
}

////////////////////////////////////////
/////////////////Bosses/////////////////
////////////////////////////////////////

if (bossInform){
    setInterval(checkBoss, 60000);
};

var boss = [
    ['00:30','07:00','11:00','15:00','18:00','23:00'],
    ['Нубэр/Каранда','Нубэр','Кзарка','Кзарка/Нубэр','Кзарка/Кутум','Каранда/Нубэр'],
    ['Офин','Кутум','Кзарка','Кзарка/Кутум','Кзарка/Нубэр','Каранда/Кутум'],
    ['Нубэр','Каранда','Нубэр','Кзарка/Кутум','Кзарка/Нубэр','Каранда/Кзарка'],
    ['','Кзарка','Кутум','Кзарка/Нубэр','Каранда/Кутум','Кутум/Нубэр'],
    ['','','Каранда','Кзарка/Кутум','Каранда/Нубэр','Кзарка/Кутум'],
    ['Нубэр','','Каранда/Нубэр','Квинт/Мурака','Офин','Каранда/Кутум'],
    ['Нубэр','Каранда','Каранда/Кутум','Велл','Офин','Кзарка/Кутум']
];

function checkBoss(){ 
    getTime();   
    for(var i = 0; i < 6; i++){        
        var tmpSep = boss[0][i].split(':');
        tmpSep[0] = parseInt(tmpSep[0]);
        tmpSep[1] = parseInt(tmpSep[1]);
        //console.log(`i = ${i}, sep = ${tmpSep[0]}:${tmpSep[1]}, time = ${time[2]}:${time[3]}`);
        if ((((time[2] + 1) == tmpSep[0]) && ((time[3] - 30) == tmpSep[1])) || ((time[2] == tmpSep[0]) && ((time[3] + 30) == tmpSep[1]))){
            if (boss[time[1]][i] != ''){
                client.channels.get(bossChannel).send(`\`\`\`asciidoc\r\nВнимание! Через 30 минут появится\r\n= ${boss[time[1]][i]} =\r\n\`\`\``);
                break;
            }
        } 
        if ((time[2] == tmpSep[0]) && (time[3] == tmpSep[1])){
            if (boss[time[1]][i] != ''){
                client.channels.get(bossChannel).send(`\`\`\`asciidoc\r\nПоявился\r\n= ${boss[time[1]][i]} =\r\nу вас есть 15 минут что бы убить босса!\r\n\`\`\``);
            }
            break;            
        }
        if ((time[2] == tmpSep[0]) && (time[3] == (tmpSep[1] + 15))){   
            if (time[1] < 7){
                if (i < 5) {
                    if (boss[time[1]][i] != ''){
                        client.channels.get(bossChannel).send(`\`\`\`asciidoc\r\nБыл убит\r\n= ${boss[time[1]][i]} =\r\nследующий босс\r\n= ${boss[time[1]][i + 1]} =\r\nв\r\n= ${boss[0][i + 1]} =\r\n\`\`\``);
                        break;
                    }
                }
                else{
                    if (boss[time[1] + 1][0] != ''){
                        client.channels.get(bossChannel).send(`\`\`\`asciidoc\r\nБыл убит\r\n= ${boss[time[1]][i]} =\r\nследующий босс\r\n= ${boss[time[1] + 1][0]} =\r\nв\r\n= ${boss[0][0]} =\r\n\`\`\``);
                        break;
                    }
                    else{
                        client.channels.get(bossChannel).send(`\`\`\`asciidoc\r\nБыл убит\r\n= ${boss[time[1]][i]} =\r\nследующий босс\r\n= ${boss[time[1] + 1][1]} =\r\nв\r\n= ${boss[0][1]} =\r\n\`\`\``);
                        break;
                    }
                }
            }
            else{
                if (i < 5) {
                    if (boss[time[1]][i] != ''){
                        client.channels.get(bossChannel).send(`\`\`\`asciidoc\r\nБыл убит\r\n= ${boss[time[1]][i]} =\r\nследующий босс\r\n= ${boss[time[1]][i + 1]} =\r\nв\r\n= ${boss[0][i + 1]} =\r\n\`\`\``);
                        break;
                    }
                }
                else{
                    if (boss[1][0] != ''){
                        client.channels.get(bossChannel).send(`\`\`\`asciidoc\r\nБыл убит\r\n= ${boss[time[1]][i]} =\r\nследующий босс\r\n= ${boss[1][0]} =\r\nв\r\n= ${boss[0][0]} =\r\n\`\`\``);
                        break;
                    }
                    else{
                        client.channels.get(bossChannel).send(`\`\`\`asciidoc\r\nБыл убит\r\n= ${boss[time[1]][i]} =\r\nследующий босс\r\n= ${boss[1][1]} =\r\nв\r\n= ${boss[0][1]} =\r\n\`\`\``);
                        break;
                    }
                }
            }
            break;
        }  
    }      
}  

function whoNext(){
    var nDay = true;
    for(var i = 0; i < 6; i++){        
        var tmpSep = boss[0][i].split(':');
        tmpSep[0] = parseInt(tmpSep[0]);
        tmpSep[1] = parseInt(tmpSep[1]);
        if (((time[2] == tmpSep[0]) && (time[3] < tmpSep[1])) || (time[2] < tmpSep[0])){       
            if (boss[time[1]][i] != ''){
                return `\`\`\`asciidoc\r\nСледующий босс\r\n= ${boss[time[1]][i]} =\r\nв\r\n= ${boss[0][i]} =\r\n\`\`\``;
            }
            else if (boss[time[1]][i + 1] != ''){
                return `\`\`\`asciidoc\r\nСледующий босс\r\n= ${boss[time[1]][i + 1]} =\r\nв\r\n= ${boss[0][i + 1]} =\r\n\`\`\``;
            }
            else {
                continue;
            }
            nDay = false;          
            break;
        }
    }
    if (nDay){
        if (time[1] < 7){
            if (boss[time[1] + 1][0] != ''){
                return `\`\`\`asciidoc\r\nСледующий босс\r\n= ${boss[time[1] + 1][0]} =\r\nв\r\n= ${boss[0][0]} =\r\n\`\`\``;
            }
            else{
                return `\`\`\`asciidoc\r\nСледующий босс\r\n= ${boss[time[1] + 1][1]} =\r\nв\r\n= ${boss[0][1]} =\r\n\`\`\``;
            }             
        }
        else{
            if (boss[1][0] != ''){
                return `\`\`\`asciidoc\r\nСледующий босс\r\n= ${boss[1][0]} =\r\nв\r\n= ${boss[0][0]} =\r\n\`\`\``;
            }
            else{
                return `\`\`\`asciidoc\r\nСледующий босс\r\n= ${boss[1][1]} =\r\nв\r\n= ${boss[0][1]} =\r\n\`\`\``;
            }
        }        
    }
}
