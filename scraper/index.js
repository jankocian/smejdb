const fs = require('fs')
const path = require('path')
const request = require('request-promise')
const utils = require('./utils')
const sources = require('./sources')

// Data naming & location
const rootFolder = '/..'
const dataFolder = '/data'
const filePath = (...args) => (path.join(__dirname, rootFolder, ...args) + '.json')

// Fetch & process the data
const getSourceData = async (source) => {
  const result = await request.get(source.url)
  return source.process(result)
}


const smejdb = [];

const requests = sources.map(source => {
  return new Promise((resolve, reject) => {
    getSourceData(source, resolve, reject)
      .then(data => {
        fs.writeFileSync(path.resolve(filePath(dataFolder, source.slug)), JSON.stringify(data, null, 2))

        // add source metadata
        smejdb.push(...data.map(item => ({
          ...item,
          sourceUrl: source.url,
          sourceName: source.name,
          sourceSlug: source.slug,
        })))

        resolve()
      })
      .catch(err => reject(err))
  })
})

// Once all the sources scraped, save the data to the final json
Promise.all(requests)
  .then(() => fs.writeFileSync(path.resolve(filePath('smejdb')), JSON.stringify(smejdb, null, 2)))
  .catch(err => console.warn(err))


// read data, if needed
/* const data = [];
if (fs.existsSync(pathToData)) {
  data = JSON.parse(fs.readFileSync(pathToData));
} */