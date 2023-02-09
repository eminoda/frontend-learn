'use strict'
const express = require('express')
const healthRouter = require('./routes/health')

const app = express()

app.use(async (req, res, next) => {
  console.log(req.path)
  const match = req.path.match(/(\d+)s\.(css|js)/)
  if (match && match.length >= 1) {
    const lazyTime = match[1]
    setTimeout(() => {
      express.static('public', {
        cacheControl: false,
      })(req, res, next)
    }, lazyTime * 1000)
  } else {
    next()
  }
})
app.use(express.static('public'))
app.use(express.json())

app.use('/health', healthRouter)

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
