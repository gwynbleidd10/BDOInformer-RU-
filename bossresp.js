module.exports.boss = ['Каранда','Древень','Кзарка','Нубэр','Кутум','Трусливый бхег','Грязь','Красный нос'];

module.exports.getTime = function(){
    //day = new Date().getDay();
    return `${new Date().getHours() + 3} : ${new Date().getMinutes()}`;
};