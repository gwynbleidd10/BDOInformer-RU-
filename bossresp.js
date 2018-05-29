var day, time;

getTime();

var bosses = ['Каранда','Древень','Кзарка','Нубэр','Кутум','Трусливый бхег','Грязь','Красный нос'];

function getTime(){
    day = new Date().getDay();
    time = new Date().getHours() + 3 + " : " + new Date().getMinutes();
};

//console.log(time);
module.exports = time;