var cheerio = require('cheerio');
var request = require('request');

function scrape() {
    request('http://www.producthunt.com/', function(error, response, html) {
        var $ = cheerio.load(html);

        var titles = $('a').map(function(index,element) {
            return [element.attribs.title];
        }).filter(function(index, element) {
            return element;
        });
        console.log(titles);
    });
}

scrape();

module.exports = scrape;