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
    })
}

main()

async function answerQuery (request, response) {
  let data = await utils.getPostData(request) 
  let hasPermission = true // TODO: Set permissions to perform actions
  let rst = {}

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