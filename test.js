var date = new Date();
var formatter = new Date().toLocaleDateString('ru', {
    timeZone: 'Europe/Moscow',
    hour: "numeric",
    minute: "numeric"
});
console.log(formatter);




var formatter = new Intl.DateTimeFormat("ru", {
  hour: "numeric",
  minute: "numeric"
});
console.log(formatter.format(date)); // 12:30:00