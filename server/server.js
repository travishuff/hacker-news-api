'use strict';

const express = require('express');
const app = express();
const scraperController = require('./scraper');
const scraperController2 = require('./scraper2');

// first sample route

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', scraperController.getData);

app.get('/scraper2', scraperController2.getData);

app.listen(3000);

module.exports = app;
