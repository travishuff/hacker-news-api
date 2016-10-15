'use strict';

const express = require('express');
const app = express();
const cache = require('apicache').middleware;
const scraperController = require('./scraper');
const scraperController2 = require('./scraper2');

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', scraperController.getData);

app.get('/scraper2', cache('5 minutes'), scraperController2.getData);

app.listen(3000);

module.exports = app;
