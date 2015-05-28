var cheerio = require('cheerio');
var request = require('request');

function scrape() {
    request(YOUR_URL, function(error, response, html) {
        var $ = cheerio.load(html);

    });
}

scrape();

module.exports = scrape;