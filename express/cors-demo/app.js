'use strict';
const express = require('express');
const corsRouter = require('./routes/cors');
const cors = require('cors');
const app = express();

app.use(function (req, res, next) {
  const origin = req.headers.origin;
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Expose-Headers', 'def');
  if (req.method == 'OPTIONS') {
    console.log(req.headers);
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'content-type, abc');
    res.setHeader('Access-Control-Max-Age', '-1');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Vary', 'Origin' + ', ' + req.headers['access-control-request-headers']);
    res.status(200).end();
  } else {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('def', '123');
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
