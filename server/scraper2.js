'use strict';

const cheerio = require('cheerio');
const request = require('request');
const scraperController = require('./scraper');

const scraperController2 = {
  getData: (req, res, next) => {
    console.log('accepted request from scraper2', res.statusCode);

    request('http://www.imdb.com/', (error, response, html) => {
      let $ = cheerio.load(html);
      // add code here
      
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

      let p1 = new Promise(function(resolve, reject) {
          request('http://www.imdb.com' + linkArr[0], (error, response, html) => {
            let $ = cheerio.load(html);
            if (error) reject(error);
            resolve($('.credit_summary_item').first().find($('.itemprop')).text());
          });
        })
      .then(function(result) {
        let movie1 = {'title': titleArr[0].trim(), 'director': result};
        console.log(movie1);
      });
      //      let p2 = new Promise(function(resolve, reject) {
      //     request('http://www.imdb.com' + linkArr[1], (error, response, html) => {
      //       let $ = cheerio.load(html);
      //       if (error) reject(error);
      //       resolve($('.credit_summary_item').first().find($('.itemprop')).text());
      //     });
      //   })
      // .then(function(result) {
      //   console.log(result);
      // });


      // res.set('Content-Type', 'application/JSON');

    });
  }
};

module.exports = scraperController2;

//  get 7 titles class="title" get test  , navigate to on down href attr
//  navigate to their page and get first 2 stars class="actors" text