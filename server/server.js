'use strict';

const express = require('express');
const app = express();
const scraperController = require('./scraper');

// first sample route
app.get('/sample', scraperController.getData);

app.listen(3000);

module.exports = app;
