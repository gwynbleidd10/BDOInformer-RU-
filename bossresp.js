module.exports.boss = ['Каранда','Древень','Кзарка','Нубэр','Кутум','Трусливый бхег','Грязь','Красный нос'];

module.exports.getTime = function(){
    //var day = new Date().getDay();
    var hour = new Date().getHours() + 3;
    var minute = new Date().getMinutes(); 
    return `${hour} : ${minute}`;
};