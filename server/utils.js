const sqlite3 = require('sqlite3')

class Obj {

    constructor () { 
        this.server = null
        this.db = new sqlite3.Database('./server/data.db')
    }

    query (query) {
        return new Promise((resolve, reject) => {
            if (query.indexOf('SELECT') >= 0) {
                this.db.all(query, [], (err, rows) => { 
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                })
            } else {
                this.db.run(query, (err) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                })
            }
        })
    }

    /**
     * Reads the stream of data input and 
     * transforms it into a JSON object
     * @param {request} query data
     */
    async getPostData (request) {
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
  
    /**
     * Turns off the server and database
     */
    shutDown () {
        this.db.close()
        if (this.server) {
            this.server.close(() => {
                console.log('Forcing exit')
                process.exit(1)  
            })
        }
    }
}

module.exports = Obj 