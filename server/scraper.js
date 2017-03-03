const cheerio = require('cheerio');
const request = require('request');

// get top 30 most commented Hacker News articles
const scraperController = {
  getData: (req, res, next) => {
    console.log('accepted request from scraper.', 'status:', res.statusCode);

    request('https://news.ycombinator.com/', (error, response, html) => {
      if (error) console.error(error);

      const $ = cheerio.load(html);

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

      // set number of articles here
      // dataArr = dataArr.slice(0, 10);

      res.set('Content-Type', 'application/JSON');
      res.send(JSON.stringify(dataArr));

      // no need to use next() since this is the last middleware in the chain
    });
  }
};

module.exports = scraperController;

// TOP class = "athing"
// title: class="title" + class="storylink" get the text
// storylink: class="storylink" atr="href" get the href attribute
// comments: class="subtext" lastChild parse to "&nnbsp" then convert to number