let express = require('express')
let utilsLib = require('./server/utils.js')

let port = 8000
let app = express()
let utils = new utilsLib()

async function main () {

    await utils.query('CREATE TABLE IF NOT EXISTS contact (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, mail TEXT NOT NULL, description TEXT NOT NULL)')
    
    app.post('/query', async (request, response) => { await answerQuery(request, response) })
    app.use(express.static('./public'))

    utils.server = app.listen(port, () => {
      console.log(`Navigate to: http://localhost:${port}`)
      console.log(`Navigate to: http://localhost:${port}/tool`)
    })

    process.on('SIGTERM', () => { console.log('SIGTERM', utils); utils.shutDown() })  
    process.on('SIGINT', () => { console.log('SIGINT'); utils.shutDown() })  
}
main()

/**
 * Answers a query
 * Calls each function depending on 'data.type' requested 
 * @param {request} full request data
 * @param {response} object to return an answer
 */
async function answerQuery (request, response) {

  let data = await utils.getPostData(request) 
  let rst = {}

  switch (data.type) {
  case 'contact':
        rst = await queryContact(data)
        break
  }
   
  response.json(rst)
}

/**
 * Answers a query of 'contact' type
 * @param {data} received data from client's navigator
 */
async function queryContact (data) {

    await utils.query(`INSERT INTO contact (name, mail, description) VALUES ("${data.name}", "${data.mail}", "${data.description}")`)

    console.log(await utils.query('SELECT * FROM contact'))

    utils.shutDown()

    return { status: 'ok', result: 'Dades mostrades' } 
}