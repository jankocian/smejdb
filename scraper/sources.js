const utils = require('./utils')
const cheerio = require('cheerio')

// Definition of datasources to be scraped & scraping functions
module.exports = [
  {
    url: 'https://sukl.gov.cz/prumysl/leciva/dozor-nad-reklamou/seznam-stranek-s-nelegalni-nabidkou-lecivych-pripravku/internetove-stranky-s-nelegalnimi-nabidkami-neschvalenych-pripravku/', // old: https://www.sukl.cz/leciva/webove-stranky-s-nelegalnimi-nabidkami-leciv
    name: 'SÚKL - Webové stránky s nelegálními nabídkami léčiv',
    slug: 'sukl',
    process: (result) => {
      const data = []
      const $ = cheerio.load(result)

      $('body .article-content table > tbody > tr:not(:first-child) > td:nth-child(2)').each((index, element) => {
        const textArray = $(element).text().split(/,|;/).map(item => item.trim())
        const urls = textArray.filter(item => item.match(utils.urlRegex))

        const items = urls.map(url => ({url}))
        data.push(...items)
      })

      return data
    }
  },
  {
    url: 'https://www.coi.cz/pro-spotrebitele/rizikove-e-shopy/',
    name: 'ČOI - Rizikové e-shopy',
    slug: 'coi',
    process: (result) => {
      const data = []
      const $ = cheerio.load(result)

      $('body .eshops-list > article > .entry-content').each((index, element) => {
        const textArray = $(element).find('.list_titles').text().split(/,|;| /).map(item => item.trim())
        const urls = textArray.filter(item => item.match(utils.urlRegex))
        const description = $(element).find('.list_titles').next().text().trim()

        const items = urls.map(url => ({url, description}))
        data.push(...items)
      })

      return data
    }
  },
]
