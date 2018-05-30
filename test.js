var request = require('request');
var cheerio = require('cheerio');

var url = 'https://forum.gamenet.ru/forumdisplay.php?f=437';

request(url, function(err, resp, html) {
        if (!err){
          const $ = cheerio.load(html);
          var asd = $('li .threadinfo').attr('title');
          console.log(asd); 
      }
});


/*const osmosis = require('osmosis');
osmosis
    .get('https://forum.gamenet.ru/forumdisplay.php?f=437')
    .find('.threadinfo')
    .set({'title': 'div'})
    .data(console.log)  // выведет {'Title': 'Google'}*/