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
  let rst = {}
  let hasPermission = false
  let queryUser = await utils.getUser(data)
  let loggedUser = null

  if (queryUser.status == 'ok') {
    loggedUser = queryUser.result 
    if (loggedUser.type == 'admin') {
      hasPermission = true
    }
    // TODO: modificar dades de usuari propies
    // TODO: gestionar tokens de sessions obertes
    // TODO: guardar informació del dispositiu de cada sessió
  }

  if (data.table == 'products' && data.type == 'get') {
    hasPermission = true
  }

  if (data.type == 'signIn' || data.type == 'signInToken' || data.type == 'signUp') {
    hasPermission = true
  }
 
  if (hasPermission) {
    try {
      switch (data.type) {
      case 'signIn':
        rst = await utils.signIn(data)
        break
      case 'signInToken':
        rst = await utils.signInToken(data)
        break
      case 'signOut':
        rst = await utils.signOut(data)
        break
      case 'signUp':
        rst = await utils.signUp(data)
        break
      case 'get':
        rst = await utils.get(data)
        break
      case 'add':
        rst = await utils.add(data)
        break
      case 'del':
        rst = await utils.del(data)
        break
      case 'update':
        rst = await utils.update(data)
        break
      }
    } catch (err) {
      console.log(err)
      rst = { status: 'ko', result: 'Unknown error' } 
    }
  } else {
    rst = { status: 'ko', result: 'Forbidden' } 
  }

  response.json(rst)
}