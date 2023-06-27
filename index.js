const dotenv = require('dotenv')
dotenv.config()

// const xmla = require('xmla4js')
const xmla = require('./xmla4js')

const SSAS_URL = process.env.ISAPI_ENDPOINT
const username = process.env.DB_USER
const password = process.env.DB_PWD
const authHeader = `Basic ${Buffer.from(
  username + ':' + (password ?? ''),
).toString('base64')}`

console.log(SSAS_URL)

const xmlaClient = new xmla.Xmla()

function executeTabularQuery(xmla, cubeName, query) {
  return new Promise((resolve, reject) => {
    const options = {
      url: SSAS_URL,
      async: true,
      statement: query,
      properties: {
        Catalog: cubeName,
      },
      headers: {
        Authorization: authHeader,
      },
      success: function (_xmla, _xmlaRequest, xmlaResponse) {
        resolve(xmlaResponse.fetchAllAsObject())
      },
      error: function (_xmla, _xmlaRequest, exception) {
        reject(exception)
      },
    }

    xmla.executeTabular(options)
  })
}

function executeMDXQuery(xmla, cubeName, query) {
  return new Promise((resolve, reject) => {
    const options = {
      url: SSAS_URL,
      async: true,
      statement: query,
      properties: {
        Catalog: cubeName,
      },
      headers: {
        Authorization: authHeader,
      },
      success: function (_xmla, _xmlaRequest, xmlaResponse) {
        try {
          const data = fetchAsObject.call(xmlaResponse)
          resolve(data)
        } catch (error) {
          reject(error)
        }
      },
      error: function (_xmla, _xmlaRequest, exception) {
        reject(exception)
      },
    }

    xmla.executeMultiDimensional(options)
  })
}

const start = async () => {
  console.time('query')
  const CUBE = 'Cubo Nissan'

  const mdxQuery = `
    DRILLTHROUGH
    SELECT {[Measures].[Matriculaciones]} ON COLUMNS
    FROM [Cubo Nissan]
    WHERE (
      {[Fecha].[Año - Mes - Día].[Año].&[2023].&[Junio]},
      {[Color].[Color].&[3695]}
    )
  `

  const daxQuery = `
    EVALUATE
    CALCULATETABLE (
      DETAILROWS ([Matriculaciones]),
      'Fecha'[Fecha] >= DATE (2023, 6, 1),
      'Fecha'[Fecha] <= DATE (2023, 6, 30),
      'Color'[Color] = "3695"
    )
  `

  // const query = `
  //   SELECT {[Measures].[Matriculaciones]} ON COLUMNS,
  //   NON EMPTY [Fecha].[Año - Mes - Día].[Año] ON ROWS
  //   FROM [Cubo Nissan]
  // `

  try {
    // const res = await executeMDXQuery(xmlaClient, CUBE, query)
    const res = await executeTabularQuery(xmlaClient, CUBE, daxQuery)
    // console.log(res)
    console.log(res.length)
  } catch (err) {
    console.log(err)
  }

  console.timeEnd('query')
}

start()
