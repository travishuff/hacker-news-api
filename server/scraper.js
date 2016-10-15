'use strict';

const cheerio = require('cheerio');
const request = require('request');
const scraperController2 = require('./scraper2');

const scraperController = {
  getData: (req, res, next) => {
    console.log('accepted request from scraper', res.statusCode);

    request('https://news.ycombinator.com/', (error, response, html) => {
      const $ = cheerio.load(html);
      // add code here

      const titleArr = [];
      $('.storylink').each(function (title) {
        titleArr.push($(this).text());
      });
      
      const linkArr = [];
      $('.storylink').each(function (link) {
        linkArr.push($(this).attr('href'));
      });

      let commentArr = [];
      $('.subtext').each(function (comment) {
        commentArr.push($(this).children().last().text().slice(0, -9));
      });
      commentArr = commentArr.map(num => {
        if (num === '') return 0;
        return Number(num);
      });
      let dataArr = [];
      for (let i = 0; i < 30; i++) {
        dataArr.push(
          {
            'title': titleArr[i],
            'link': linkArr[i],
            'comment': commentArr[i]
          }
        )
      }
      dataArr.sort((a, b) => {
        return b.comment - a.comment;
      });
      dataArr = dataArr.slice(0, 10);
      
      const data = JSON.stringify(dataArr);

      res.set('Content-Type', 'application/JSON');
      res.send(data);
    });
  }
};

module.exports = scraperController;
// TOP class = "athing"
// title: class="title" + class="storylink" get the text
// storylink: class="storylink" atr="href" get the href attribute
// comments: class="subtext" lastChild parse to "&nnbsp" then convert to number