'use strict'
const express = require('express')
const healthRouter = require('./routes/health')
const payRouter = require('./routes/pay')

const app = express()

app.use(express.json())
app.use(express.urlencoded())

app.use('/health', healthRouter)
app.use('/pay', payRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.json({ code: -1, msg: err.message })
})

module.exports = app
