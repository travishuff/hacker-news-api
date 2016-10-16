'use strict';

const cheerio = require('cheerio');
const request = require('request');
const scraperController = require('./scraper');

const scraperController2 = {
  getData: (req, res, next) => {
    console.log('accepted request from scraper2', res.statusCode);

    request('http://www.imdb.com/', (error, response, html) => {
      const $ = cheerio.load(html);
      
      let titleArr = [];
      $('.title').each( function(title) {
        titleArr.push($(this).text());
      });
      titleArr = titleArr.slice(0, 5);

      let linkArr = [];
      $('.title').each(function (link) {
        linkArr.push($(this).children().first().attr('href'));
      });
      linkArr = linkArr.slice(0, 5);

      const data = [];
      const promiseArr = [];
      let promiseVar;
      for (let i = 0; i < 5; i++) {
        promiseVar = new Promise((resolve, reject) => {
            request('http://www.imdb.com' + linkArr[i], (error, response, html) => {
              const $ = cheerio.load(html);
              if (error) reject(error);
              resolve(
                $('.credit_summary_item').first().find($('.itemprop')).text());
            });
          }).then((result) => {
            data.push({'title': titleArr[i].trim(), 'director': result});
          });
          promiseArr.push(promiseVar);
      }
      
      // when all promises are in the array and finished => Promise.all
      Promise.all(promiseArr).then(() => {
            res.set('Content-Type', 'application/JSON');
            res.send(data);
      });
    });
  }
};

module.exports = scraperController2;
