"use strict";
const express = require("express");
const corsRouter = require("./routes/cors");
const cors = require("cors");
const app = express();

// app.use(cors());
app.use(function (req, res, next) {
  if (req.method == 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5000');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'content-type,abc');
    res.setHeader('Access-Control-Allow-Credentials', 'true'); 
    // res.setHeader('Set-Cookie', 'pageAccess=3; expires=Wed, 31-Dec-2022 01:34:53 GMT');
    res.setHeader('Access-Control-Max-Age', '-1');
    // // res.setHeader('Vary', 'Origin');
    res.status(200).end();
  } else {
    console.log(req.headers.cookies)
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Authorization', '123');
    next();
  }
});

app.use(express.static("public"));
app.use(express.json());

app.use("/test/cors", corsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ code: -1, msg: err.message });
});

module.exports = app;
