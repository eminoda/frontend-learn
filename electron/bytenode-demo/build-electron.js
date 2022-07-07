const fs = require('fs')
const path = require('path')
const bytenode = require('bytenode')
const Glob = require('glob').Glob
const isNegatedGlob = require('is-negated-glob')
const toAbsoluteGlob = require('to-absolute-glob')

const electronOutput = path.join(__dirname, 'electron-output')
const electronWorkspace = path.join(__dirname, 'electron-workspace')

const byteHandle = (filename) => {
  let output = ''
  if (process.platform === 'win32') {
    output = filename.replace(electronWorkspace.replace(/\\/g, '/'), electronOutput.replace(/\\/g, '/')) + 'c'
  } else {
    output = filename.replace(electronWorkspace, electronOutput) + 'c'
  }
  const dir = path.dirname(output)
  fs.mkdirSync(dir, { recursive: true })
  return bytenode.compileFile({
    filename,
    compileAsModule: true,
    electron: true,
    output,
  })
}

fs.mkdirSync(electronOutput, { recursive: true })

const globsHandler = (globs, opt) => {
  const negatives = []
  const positives = []
  // 分离待可选及排除目录 pattern
  globs.forEach((globString, index) => {
    var glob = isNegatedGlob(globString)
    var globArray = glob.negated ? negatives : positives
    globArray.push({
      index,
      glob: glob.pattern,
    })
  })
  // 过滤排除路径
  return Promise.all(
    positives.map((positive) => {
      return new Promise((resolve, reject) => {
        new Glob(
          toAbsoluteGlob(positive.glob, { cwd: opt.cwd }),
          {
            ignore: negatives.map((negative) => {
              return toAbsoluteGlob(negative.glob, { cwd: opt.cwd })
            }),
            cwd: opt.cwd,
          },
          (err, files) => {
            resolve(files)
          }
        )
      })
    })
  )
}

globsHandler(['**/*.js', '!main.js'], { cwd: electronWorkspace }).then((filepaths) => {
  filepaths.flat().forEach((filepath) => {
    byteHandle(filepath)
  })
})
