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
  let hasPermission = false
  let knownUser = false
  let user = {}
  let rst = {}
  
  if (typeof data.logInId == 'string' && typeof data.logInToken == 'string') {
    user = await utils.appGetTokenUser(data)
    if (user != null) knownUser = true
  }

  if (data.type == 'appLogIn') hasPermission = true
  if (data.type == 'dbAddRow' && data.tableName == 'contacte') hasPermission = true 
  if (knownUser == true && data.type == 'dbGetTableData' && data.tableName == 'consoles') hasPermission = true 
  if (knownUser == true && ['uploadFileChunk', 'uploadFileDone', 'uploadFileError'].indexOf(data.type) != -1) hasPermission = true

  if (typeof data.loginInId == 'string' && data.loginInId == 'tooldb') hasPermission = true // Hack per permetre el funcionament de la 'tooldb'
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
