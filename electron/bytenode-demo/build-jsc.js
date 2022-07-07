const fs = require('fs')
const path = require('path')
const bytenode = require('bytenode')

// 测试普通 server.js 文件
// 编译 exports 文件需要调用 compileFile
bytenode
  .compileFile({
    // 注意：bytenode 的 require 需要使用绝对路径，'server.js'
    filename: path.join(__dirname, 'server.js'),
    compileAsModule: true,
  })
  .then((outputPath) => {
    // jsc 文件默认输出路径
    console.log('outputPath: ', outputPath)

    // 测试 module exports 的输出
    const module = require(outputPath)
    console.log('module exports', module.test.toString())
  })
