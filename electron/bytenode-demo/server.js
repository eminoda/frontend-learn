const express = require('express')
const http = require('http')
const app = express()

app.use(function (req, res, next) {
  res.send('hello bytenode')
})
const server = http.createServer(app).listen(5000)

server.on('listening', () => {
  // const testFn = new Function('var x = 1; return x;')
  // console.log(testFn.toString())
  console.log('server is working on port 5000')
})

const test = async function () {
  return '123'
}

module.exports = {
  test,
}
