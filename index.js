const Discord = require('discord.js');
var request = require('request');
var cheerio = require('cheerio');

const client = new Discord.Client();

var ttoken = process.env.BOT_TOKEN;
//'NDQyMjUxMzI5OTg1ODM5MTA0.Dc8RJw.a32WaDN4-wV3SXootMlk71XZtv8';
var general = '343145719915479042';
var develop = '442299997048799253';
var main = '438294563719872513';
const prefix = '!';

////////////////////////////////////////
//////////////////Main//////////////////
////////////////////////////////////////

client.login(ttoken);

client.on('ready', () => {
    console.log('BDOInformer started!');
    client.user.setActivity("Запускается...");    
    getTech();
    console.log('getTech выполнен');
    checkRasp();
    console.log('checkRasp выполнен');
    checkBoss();
    console.log('checkBoss выполнен');
});

client.on('guildMemberAdd', member => {    
    client.channels.get(general).send(`Приветствуем в ги НАВЬ, ${member}`);
});

client.on('message', message => {
    console.log(message.content);
    switch(message.content){
        case prefix + 'h': message.reply("Список команд: \n!h - помощь\n!day - день или ночь. оставшееся время\n!boss - следующий босс"); break;
        case prefix + 'day': message.reply(nowDay()); break;
        case prefix + 'boss': message.reply(whoNext()); break;      
    }
});

/*var count = Math.floor(Math.random() * (client.users.array().length - 0)) + 0;
        var stat;
        if (Math.floor((Math.random() * (2 - 0)) + 0) == true){
            stat = 'бомж!';
        }
        else stat = 'не бомж!';client.users.array()[count] + stat*\/
        message.reply(':P'); break;*/

////////////////////////////////////////
/////////////////isDay?/////////////////
////////////////////////////////////////

setInterval(checkRasp, 60000);

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
var techTime = ['8','12','0', '0'];
var isDay = true;
var isTech = false;
var newTech = false;
var endofTech = ['0','0'];
var endOfNight = 0;
var endOfDay = ['0','0'];
var time = new Array;
var techStr;

function getTime(){
    time[0] = new Date().getDay();  //День
    time[1] = new Date().getUTCHours() + 3; //Часы
    time[2] = new Date().getMinutes();  //Минуты
    time[3] = new Date().getUTCDate();  //Число
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
    for(var i = 0; i < 12;){  
        if (isTech){
            /*
            //Проверка Техработ
            if ((time[3] == techTime[3]) && ((time[2] - 5) <= techTime[2]) ){
                isTech = false;
                newTech = true;
                break;
            }
            //Конец Техработ
            endofTech[1] = techTime[1] - time[1] - 1;
            endofTech[0] = 59 - time[2];
            */
        }
        else{
            /*
            //Проверка техработ
            if ((time[3] == techTime[3]) && (time[1] >= techTime[0])){
                isTech = true;
                endofTech[1] = techTime[1] - time[1] - 1;
                endofTech[0] = 59 - time[2];
                break;
            }
            */
            //Время суток
            if ((time[1] == raspTime[i][0]) && (time[2] == (raspTime[i][1] - 30))){
                client.channels.get(main).send("@everyone ```ВНИМАНИЕ! 30 минут до наступления ночи, всем подготовиться...```");
                break;
            }    
            if ((time[1] == raspTime[i][0]) && (time[2] == raspTime[i][1])){
                client.channels.get(main).send("@everyone ```Наступила ночь, у вас есть 40 минут повышенного опыта. Приятного фарма!```");
                isDay = false;
                break;
            }
            if ((time[1] == raspTime[i + 1][0]) && (time[2] == raspTime[i + 1][1])){
                client.channels.get(main).send("@everyone ```И снова день, до следующей ночи 3 часа 20 минут. Расходимся!```");            
                endOfDay[1] = 3;
                isDay = true;
                break;
            }
            //Конец дня
            if ((time[1] < 22) && (i < 10)){
                if (time[1] > raspTime[i + 2][0]){
                    i += 2;
                }
                else{
                    endOfDay[1] = raspTime[i + 2][0] - time[1];
                    break;
                }
            }        
            else if (time[1] >= 22){
                if ((raspTime[0][0] - time[1]) < 0){
                    endOfDay[1] = 26 - time[1];
                    break;
                }
                else{
                    endOfDay[1] = raspTime[0][0] - time[1];
                    break;
                }
            }   
        }
    }
    console.log(`Время: ${time}. День: ${isDay}. Техработы: ${isTech} ${techTime} ${endofTech}`);
    dayNightTime();
    status();
}

function dayNightTime(){
    if (!isDay){        
        if (time[2] > 20){
            endOfNight = 80 - time[2];
        }
        else{
            endOfNight = 20 - time[2];
        }        
    }    
    else{
        if ((40 - time[2]) < 0){
            endOfDay[0] = 100 - time[2];
            endOfDay[1] -= 1;
        }
        else{
            endOfDay[0] = 40 - time[2];
        }        
    }    
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
    else{
        if (isDay){
            client.user.setActivity(`День. ${endOfDay[1]} ч. ${endOfDay[0]} мин.`);
        }
        else{
            client.user.setActivity(`Ночь. ${endOfNight} мин.`);
        }
    } 
}

////////////////////////////////////////
/////////////////Bosses/////////////////
////////////////////////////////////////

setInterval(checkBoss, 60000);

var boss = [
    ['0:30','11:00','15:00','18:00','23:00'],
    ['Нубэр/Каранда','Кзарка','Кзарка/Нубэр','Кзарка/Кутум','Каранда/Нубэр'],
    ['Офин','Кзарка','Кзарка/Кутум','Кзарка/Нубэр','Каранда/Кутум'],
    ['Нубэр','Нубэр','Кзарка/Кутум','Кзарка/Нубэр','Каранда/Кзарка'],
    ['','Кутум','Кзарка/Нубэр','Каранда/Кутум','Кутум/Нубэр'],
    ['','Каранда','Кзарка/Кутум','Каранда/Нубэр','Кзарка/Кутум'],
    ['Нубэр','Каранда/Нубэр','Квинт/Мурака','Офин','Каранда/Кутум'],
    ['Нубэр','Каранда/Кутум','Велл','Офин','Кзарка/Кутум']
];

function checkBoss(){    
    for(var i = 0; i < 5; i++){
        var tmpSep = boss[0][i].split(':');
        //Проверка боссов
        if ((time[2] + 30) > 59){
            if (`${time[1] + 1}:${time[2] - 30}` == boss[0][i]){
                client.channels.get(main).send(`@everyone \`\`\`asciidoc\r\nВнимание! Приближается большой и страшный босс\r\n= ${boss[time[0]][i]} =\r\nу вас есть 30 минут что бы добежать до места его респа! Удачи!\r\n\`\`\``);
                break;
            }         
        }
        else{
            if (`${time[1]}:${time[2] + 30}` == boss[0][i]){
                client.channels.get(main).send(`@everyone \`\`\`asciidoc\r\nВнимание! Приближается большой и страшный босс\r\n= ${boss[time[0]][i]} =\r\nу вас есть 30 минут что бы добежать до места его респа! Удачи!\r\n\`\`\``);
                break;
            }
        }    
        if (`${time[1]}:${time[2]}` == boss[0][i]){
            client.channels.get(main).send(`@everyone \`\`\`asciidoc\r\nПоявился большой и страшный босс\r\n= ${boss[time[0]][i]} =\r\nу вас есть 15 минут что бы убить босса!\r\n\`\`\``);
            break;
        }
        if (`${time[1]}:${time[2]}` == (tmpSep[1] + 15)){   
            if (time[0] < 7){
                if (i < 4){
                    client.channels.get(main).send(`@everyone \`\`\`asciidoc\r\nБыл убит большой и страшный босс\r\n= ${boss[time[0]][i]} =\r\nследующий босс в \r\n= ${boss[time[0]][i + 1]} =\r\nне пропустите!\r\n\`\`\``);
                }
                else{
                    client.channels.get(main).send(`@everyone \`\`\`asciidoc\r\nБыл убит большой и страшный босс\r\n= ${boss[time[0]][i]} =\r\nследующий босс в \r\n= ${boss[time[0]][i + 1]} =\r\nне пропустите!\r\n\`\`\``);
                }
            }
            else{
                if (i < 4){
                    client.channels.get(main).send(`@everyone \`\`\`asciidoc\r\nБыл убит большой и страшный босс\r\n= ${boss[time[0]][i]} =\r\nследующий босс в \r\n= ${boss[time[0]][i + 1]} =\r\nне пропустите!\r\n\`\`\``);
                }
                else{
                    client.channels.get(main).send(`@everyone \`\`\`asciidoc\r\nБыл убит большой и страшный босс\r\n= ${boss[time[0]][i]} =\r\nследующий босс в \r\n= ${boss[time[0]][i + 1]} =\r\nне пропустите!\r\n\`\`\``);
                }
            }
            break;
        }  
    }      
}  

function whoNext(){
    var nDay = true;
    for(var i = 0; i < 5; i++){
        var tmpSep = boss[0][i].split(':');
        if ((time[1] >= tmpSep[0]) && (time[2] >= tmpSep[1]))
        {}
        else{
            return `\`\`\`asciidoc\r\nСледующий босс\r\n= ${boss[time[0]][i]} =\r\nв\r\n= ${boss[0][i]} =\r\nне пропустите!\r\n\`\`\``;  
            nDay = false;          
            break;
        }
    }
    if (nDay){
        if (time[0] < 7){
            return `\`\`\`asciidoc\r\nСледующий босс\r\n= ${boss[time[0] + 1][0]} =\r\nв\r\n= ${boss[0][0]} =\r\nне пропустите!\r\n\`\`\``; 
        }
        else{
            return `\`\`\`asciidoc\r\nСледующий босс\r\n= ${boss[1][0]} =\r\nв\r\n= ${boss[0][0]} =\r\nне пропустите!\r\n\`\`\``; 
        }        
    }
}