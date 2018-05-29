var day, time;

getTime();

var bosses = ['Каранда','Древень','Кзарка','Нубэр','Кутум','Трусливый бхег','Грязь','Красный нос'];

function getTime(){
    //day = new Date().getDay();
    return time = new Date().getHours() + 3 + " : " + new Date().getMinutes();
};

//console.log(getTime());
module.exports = getTime();