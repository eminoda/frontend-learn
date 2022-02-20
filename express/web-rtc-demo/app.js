"use strict";
const express = require("express");
var cors = require("cors");
const healthRouter = require("./routes/health");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/health", healthRouter);
app.get("/", (req, res, next) => {
  res.send("Hello World\n");
});
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
