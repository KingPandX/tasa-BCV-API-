import { chromium } from 'playwright'
import express from 'express'

const app = express()
const port = 4321
let Moneys
getMoneys()
setInterval(getMoneys, 60 * 60 * 1000)

app.get('/BCV', async (req, res) => {
  const data = req.query
  console.log(data)
  switch (data.moneda) {
    case "'EUR'":
      res.json(Moneys.EUR)
      break
    case "'CNY'":
      res.json(Moneys.CNY)
      break
    case "'TRY'":
      res.json(Moneys.TRY)
      break
    case "'RUB'":
      res.json(Moneys.RUB)
      break
    case "'USD'":
      console.log(Moneys.USD)
      res.json(Moneys.USD)
      break
    default:
      res.json(Moneys)
      break
  }
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/Bcv`)
})

async function getMoneys () {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto('https://www.bcv.org.ve/')
  const trys = ['euro', 'yuan', 'lira', 'rublo', 'dolar']
  let monedas = []
  for (let i = 0; i < trys.length; i++) {
    const element = trys[i]
    let content = await page.textContent(`[id="${element}"]`)

    content = content.trim()
    content = content.split(' ')
    const final = stringClean(content)
    monedas = monedas.concat(final)
  }
  browser.close()
  Moneys = convertJson(monedas)
}

function stringClean (cont) {
  const value = cont.filter(i => {
    const none = ['', '\n', '\n\n', '\t']
    if (none.includes(i)) {
      return false
    }

    return true
  })
  return value
}

function convertJson (input) {
  const obj = input.reduce(function (acc, cur, i) {
    if (i % 2 === 0) {
      acc[cur.trim()] = input[i + 1]
    }
    return acc
  }, {})
  return obj
}
