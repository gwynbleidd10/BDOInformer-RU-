module.exports.boss = ['Каранда','Древень','Кзарка','Нубэр','Кутум','Трусливый бхег','Грязь','Красный нос'];

function getTime(){
    //var day = new Date().getDay();
    var hour = new Date().getHours() + 3;
    var minute = new Date().getMinutes(); 
    console.log("test");
    return `${hour} : ${minute}`;
};

module.exports.gettime = getTime();