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
      // console.log(titleArr);

      let linkArr = [];
      $('.title').each(function (link) {
        linkArr.push($(this).children().first().attr('href'));
      });
      linkArr = linkArr.slice(0, 5);
      // console.log(linkArr);
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
      Promise.all(promiseArr).then(() => {
            res.set('Content-Type', 'application/JSON');
            res.send(data);
      });
    });
  }
};

module.exports = scraperController2;

//  get 7 titles class="title" get test  , navigate to on down href attr
//  navigate to their page and get first 2 stars class="actors" text
//  for (let i = 0; i < 5; i++) {
//         let promiseVar = new Promise(function(resolve, reject) {
//             request('http://www.imdb.com' + linkArr[i], (error, response, html) => {
//               let $ = cheerio.load(html);
//               if (error) reject(error);
//               resolve($('.credit_summary_item').first().find($('.itemprop')).text());
//             });
//           })
//         .then(function(result) {
//           data.push({'title': titleArr[i].trim(), 'director': result});
//           if (data.length === 5) {
//             res.set('Content-Type', 'application/JSON');
//             res.send(data);
//           }
//         });
//       } 