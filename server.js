let express = require('express')
let utilsLib = require('./server/utils.js')

let port = 8000
let app = express()
let utils = new utilsLib()

async function main () {

    utils.init()

    app.post('/query', async (request, response) => { await answerQuery(request, response) })
    app.use(express.static('./public'))

    utils.server = app.listen(port, () => {
      console.log(`Navigate to: http://localhost:${port}`)
      console.log(`Navigate to: http://localhost:${port}/tool`)
      console.log(`Navigate to: http://localhost:${port}/tooldb`)
    })
}

main()

async function answerQuery (request, response) {
  let data = await utils.getPostData(request) 
  let hasPermission = true
  let knownUser = false
  let user = {}
  let rst = {}

  if (typeof data.logInId == 'string' && typeof data.logInToken == 'string') {
    if (await utils.appGetTokenUser(data) != null) knownUser = true
  }

  if (knownUser == false && data.type == 'dbGetTableData' && data.tableName == 'consoles') hasPermission = false 

  if (data.type.indexOf(';') >= 0) { hasPermission = false } // Important, evita atacs per injecció de codi
  
  if (hasPermission) {
    try {
      rst = await eval(`utils.${data.type}(data)`)
    } catch (err) {
      console.log(err)
      rst = { status: 'ko', result: 'Unknown error' } 
    }
  } else {
    rst = { status: 'ko', result: 'Forbidden' } 
  }

  response.json(rst)
}
