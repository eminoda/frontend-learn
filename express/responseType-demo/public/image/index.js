const fs = require('fs')

const data = fs.readFileSync('google.png')
console.log(data.toString())