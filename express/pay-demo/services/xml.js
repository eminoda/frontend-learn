const xml2js = require('xml2js')
const { parseString } = require('xml2js')

module.exports = {
  buildXML: (data) => {
    var builder = new xml2js.Builder()
    const xmlData = builder.buildObject({
      xml: {
        ...data,
      },
    })
    return xmlData
  },
  parseXML: async (xml) => {
    return new Promise((resolve, reject) => {
      parseString(xml, { trim: true, explicitArray: false }, (err, result) => {
        resolve(result.xml)
      })
    })
  },
}
