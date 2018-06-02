//var options = { timeZone: 'Europe/Moscow' };
//var formatter = new Intl.DateTimeFormat('ru', options);
//var date = new Date();//.toLocaleDateString('en-GB', options);
//console.log(formatter);


var date = new Date();//(2014, 11, 31, 12, 30, 0);

var formatter = new Intl.DateTimeFormat("ru", {
  hour: "numeric",
  minute: "numeric"
});
console.log(formatter.format(date)); // 12:30:00