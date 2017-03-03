const cheerio = require('cheerio');
const request = require('request');

// get movies w/ director opening this week
const scraperController2 = {
  getData: (req, res, next) => {
    console.log('accepted request from scraper2.', 'status:', res.statusCode);

    request('http://www.imdb.com/', (error, response, html) => {
      if (error) console.error(error);

      const $ = cheerio.load(html);

      let titleArr = [];
      $('.title').each( function(title) {
        titleArr.push($(this).text());
      });

      let linkArr = [];
      $('.title').each(function (link) {
        linkArr.push($(this).children().first().attr('href'));
      });

      const data = [];
      const promiseArr = [];
      let promiseVar;

      // set number of articles by looping i times below
      for (let i = 0; i < 10; i++) {
        promiseVar = new Promise((resolve, reject) => {
          request('http://www.imdb.com' + linkArr[i], (error, response, html) => {
            if (error) {
              reject(Error(res.statusCode));
            }
            const $ = cheerio.load(html);
            resolve($('.credit_summary_item').first().find($('.itemprop')).text());
          });
        })
        .then((result) => {
          data.push({'title': titleArr[i].trim(), 'director': result});
        });

        // might not need this catch as it's handled by promise.all
        // .catch((error) => {
        //   console.error('Error resolving promise:', error.message);
        // });

        promiseArr.push(promiseVar);
      }

      // when all promises are in the array and finished => Promise.all
      Promise.all(promiseArr)
        .then(() => {
          res.set('Content-Type', 'application/JSON');
          res.send(data);
        })
        .catch(error => console.error('Error with one of the promises:', error.message));
    });
  }
};

module.exports = scraperController2;
