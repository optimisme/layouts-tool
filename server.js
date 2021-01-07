let express = require('express')

let port = 8000
let app = express()

app.use(express.static('./public'))

app.listen(port, () => {
  console.log(`Navigate to: http://localhost:${port}`)
  console.log(`Navigate to: http://localhost:${port}/tool`)
})