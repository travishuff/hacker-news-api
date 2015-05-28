var express = require('express');
var app = express();

// var scraper = require('./scraper');

app.get('/one', there);
app.get('/two', there);
app.get('/three', there);

function there(req, res) {
  res.end('hi');
}


app.listen(3000);

module.exports = app;
