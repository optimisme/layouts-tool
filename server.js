let express = require('express')

let port = 8000
let app = express()

async function main () {

    app.post('/query', (request, response) => { answerQuery(request, response) })

    app.use(express.static('./public'))

    app.listen(port, () => {
      console.log(`Navigate to: http://localhost:${port}`)
      console.log(`Navigate to: http://localhost:${port}/tool`)
    })
}
main() 

/**
 * Answers a query
 * Calls each function depending on 'data.type' requested
 * @param {request} full request data
 * @param {response} object to return an answer
 */
async function answerQuery (request, response) {

  let data = await getPostData(request)
  let rst = {}

  switch (data.type) {
  case 'contact':
      rst = await queryContact(data)
      break
  }
   
  response.json({ status: 'ok', result: rst })
}

/**
 * Answers a query of 'contact' type
 * @param {data} received data from client's navigator
 */
async function queryContact (data) {
  console.log('Rebut', data)
}

/**
 * Reads the stream of data input and 
 * transforms it into a JSON object
 * @param {request} query data
 */
async function getPostData (request) {
  return new Promise(async (resolve, reject) => {
      let body = '',
          error = null

      request.on('data', (data) => { body = body + data.toString() })
      request.on('close', () => { /* TODO - Client closed connection, destroy everything! */ })
      request.on('error', (err) => { error = 'Error getting data' })
      request.on('end', async () => {
          if (error !== null) {
              console.log('Error getting data from post: ', error)
              return reject(error)
          } else {
              try {
                  return resolve(JSON.parse(body))
              } catch (e) {
                  console.log('Error parsing data from post: ', error)
                  return reject(e)
              }
              
          }
      })
  })
}