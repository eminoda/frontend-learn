'use strict';
const express = require('express');
const corsRouter = require('./routes/cors');
const cors = require('cors');
const app = express();

// app.use(cors())
app.use(function (req, res, next) {
  if (req.method == 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    // res.setHeader('Content-Length', '0');
    // res.setHeader('Vary', 'Origin');
    res.status(204).end();
  } else {
    // res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  }
});

app.use(express.static('public'));
app.use(express.json());

app.use('/test/cors', corsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ code: -1, msg: err.message });
});

module.exports = app;
