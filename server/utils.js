const sqlite = require('sqlite3-lite')
const md5 = require('md5')

class Obj {

    constructor () { 
        this.server = undefined
        this.db = new sqlite.Database('./server/data.db')
    }

   async init () {

        process.on('SIGHUP', () => { this.close() })
        process.on('SIGINT', () => { this.close() })
        process.on('SIGTERM', () => { this.close() })

        await this.query('CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, description TEXT NOT NULL)')
        await this.query('CREATE TABLE IF NOT EXISTS users    (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT NOT NULL, name TEXT NOT NULL, surname TEXT NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL, tokens TEXT NOT NULL)')
        await this.query('CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT NOT NULL, image TEXT NOT NULL, price REAL  NOT NULL)')

        let rst = await this.query('SELECT * FROM users WHERE id="1"')
        if (rst.length == 0) {
            await this.query(`INSERT INTO users (id, name, surname, type, email, password, tokens) VALUES (1, "Admin", "", "admin", "admin@admin.com", "${md5('admin')}", "[]")`)
        }
    }

    async signIn (data) {
        if (typeof data.email == 'undefined'
         || typeof data.password == 'undefined'
         || data.email.indexOf(';') >= 0 
         || data.password.indexOf(';') >= 0) { return { status: 'ko', result: 'signIn: Wrong signIn data (X)' } }

        let rst = await this.query(`SELECT * FROM users WHERE email="${data.email}" AND password="${md5(data.password)}"`)
        if (rst.length == 1) {
            let token = md5((Math.random()).toString())
            let arrTokens = JSON.parse(rst[0].tokens)
            while (arrTokens.indexOf(token) >= 0) {
                token = md5((Math.random()).toString())
            }
            arrTokens.push(token)
            await this.query(`UPDATE users SET tokens='${JSON.stringify(arrTokens)}' WHERE id=${rst[0].id}`)
            rst[0].tokens=[token]
            return { status: 'ok', result: rst }
        } else {
            return { status: 'ko', result: 'signIn: Wrong data (1)' }
        }
    }

    async signInToken (data) {
        if (typeof data.signInId != 'number'
         || typeof data.signInToken == 'undefined') { return { status: 'ko', result: 'signInToken: Wrong signIn data (X)' } }

        let rst = await this.query(`SELECT * FROM users WHERE id="${data.signInId}"`)
        if (rst.length == 1) {
            let arrTokens = JSON.parse(rst[0].tokens)
            if (arrTokens.indexOf(data.signInToken) >= 0) {
                rst[0].tokens=[data.signInToken]
                return { status: 'ok', result: rst }
            } else {
                return { status: 'ko', result: 'signInToken: Wrong data (1)' }
            }
        } else {
            return { status: 'ko', result: 'signInToken: Wrong data (2)' }
        }  
    }

    async signOut (data) {
        if (typeof data.signInId != 'number'
         || typeof data.signInToken == 'undefined') { return { status: 'ko', result: 'signOut: Wrong signIn data (X)' } }

        let rst = await this.query(`SELECT * FROM users WHERE id="${data.signInId}"`)
        if (rst.length == 1) {
            let arrTokens = JSON.parse(rst[0].tokens)
            let position = arrTokens.indexOf(data.signInToken)
            if (position >= 0) {
                arrTokens.splice(position, 1)
                await this.query(`UPDATE users SET tokens="${JSON.stringify(arrTokens)}" WHERE id=${rst[0].id}`)
            } else {
                return { status: 'ko', result: 'signOut: Wrong data (1)' }
            }
        } else {
            return { status: 'ko', result: 'signOut: Wrong data (2)' }
        }  
    }

    async signUp (data) {

        if (typeof data.email == 'undefined'
         || typeof data.password == 'undefined'
         || typeof data.name == 'undefined'
         || typeof data.surname == 'undefined'
         || data.email.indexOf(';') >= 0
         || data.password.indexOf(';') >= 0
         || data.name.indexOf(';') >= 0
         || data.surname.indexOf(';') >= 0) { return { status: 'ko', result: 'signUp: Wrong data (X)' } }

        let addObj = {
            tableName: 'users',
            name: data.name,
            surname: data.surname,
            type: 'user',
            email: data.email,
            password: data.password,
            tokens: "[]"
        }

        await this.add(addObj)

        let signInObj = {
            email: data.email,
            password: data.password
        }
        
        return await this.signIn(signInObj)
    }

    async getUser (data) {
        if (typeof data.signInId != 'number'
         || typeof data.signInToken == 'undefined') { return { status: 'ko', result: 'getUser: Wrong data (X)' } }

        let rst = await this.query(`SELECT * FROM users WHERE id="${data.signInId}"`)
        if (rst.length == 1) {
            let arrTokens = JSON.parse(rst[0].tokens)
            if (arrTokens.indexOf(data.signInToken) >= 0) {
                return { status: 'ok', result: rst[0] }
            } else {
                return { status: 'ko', result: 'getUser: Wrong data (1)' }
            }
        } else {
            return { status: 'ko', result: 'getUser: Wrong data (2)' }
        }  
    }

    async get (data) {
        if (typeof data.tableName == 'undefined'
         || data.tableName.indexOf(';') >= 0) { return { status: 'ko', result: 'get: Wrong data (X)' } }

        try {
            let queryStr = `SELECT * FROM ${data.tableName}`

            if (typeof data.where != 'undefined' && data.where.indexOf(';') == -1) queryStr += ` WHERE ${data.where}`
            if (typeof data.order != 'undefined' && data.order.indexOf(';') == -1) queryStr += ` ORDER BY ${data.order}`
            if (typeof data.limit != 'undefined' && data.limit.indexOf(';') == -1) queryStr += ` LIMIT ${data.limit}`

            let rst = await this.query(queryStr)
            return { status: 'ok', result: rst } 
        } catch (err) {
            console.log('Could not get', err)
            return { status: 'ko', result: 'Error' } 
        }
    }

    async add (data) {
        try {
            await this.query(`INSERT INTO ${data.tableName} (${this.getAddFields(data)}) VALUES (${this.getAddValues(data)})`)
            return { status: 'ok', result: '' } 
        } catch (err) {
            console.log('Could not add', err)
            return { status: 'ko', result: 'Error' } 
        }
    }

    async del (data) {
        if (typeof data.tableName == 'undefined'
         || typeof data.id == 'undefined'
         || data.tableName.indexOf(';') >= 0
         || data.id.indexOf(';')) { return { status: 'ko', result: 'del: Wrong data (X)' } }

        if (data.tableName == 'users' && data.id == 1) {
            return { status: 'ko', result: 'Can\'t delete main "admin"' } 
        } else {
            try {
                await this.query(`DELETE FROM ${data.tableName} WHERE id=${data.id}`)
                return { status: 'ok', result: '' } 
            } catch (err) {
                console.log('Could not del', err)
                return { status: 'ko', result: 'Error' } 
            }
        }
    }

    async update (data) {
        if (typeof data.tableName == 'undefined'
         || typeof data.id == 'undefined'
         || data.tableName.indexOf(';') >= 0
         || data.id.indexOf(';')) { return { status: 'ko', result: 'update: Wrong data (X)' } }

        try {
            await this.query(`UPDATE ${data.tableName} SET ${this.getUpdateValues(data)} WHERE id="${data.id}"`)
            return { status: 'ok', result: '' } 
        } catch (err) {
            console.log('Could not update', err)
            return { status: 'ko', result: 'Error' } 
        }
    }

    getAddFields (data) {
        let keys = Object.keys(data)

        if (keys.indexOf('signInId') >= 0) keys.splice(keys.indexOf('signInId'), 1)
        if (keys.indexOf('signInToken') >= 0) keys.splice(keys.indexOf('signInToken'), 1)
        if (keys.indexOf('tableName') >= 0) keys.splice(keys.indexOf('tableName'), 1)

        let codeInjected = keys.filter((x) => { return (x.indexOf(';') >= 0) })
        if (codeInjected.length > 0) return ''

        return keys.join(', ')
    }

    getAddValues (data) {
        let keys = Object.keys(data)
        let values = []

        if (keys.indexOf('signInId') >= 0) keys.splice(keys.indexOf('signInId'), 1)
        if (keys.indexOf('signInToken') >= 0) keys.splice(keys.indexOf('signInToken'), 1)
        if (keys.indexOf('tableName') >= 0) keys.splice(keys.indexOf('tableName'), 1)

        for (let cnt = 0; cnt < keys.length; cnt = cnt + 1) {
            let field = keys[cnt]
            let value = data[field]

            if (data.tableName == 'users' && field == 'password') {
                value = md5(value)
            }

            if (typeof value == 'string') {
                values.push('"' + value + '"')
            } else {
                values.push(value)
            }
        }

        return values.join(', ')
    }

    getUpdateValues (data) {
        let keys = Object.keys(data)
        let values = []

        if (keys.indexOf('signInId') >= 0) keys.splice(keys.indexOf('signInId'), 1)
        if (keys.indexOf('signInToken') >= 0) keys.splice(keys.indexOf('signInToken'), 1)
        if (keys.indexOf('tableName') >= 0) keys.splice(keys.indexOf('tableName'), 1)

        for (let cnt = 0; cnt < keys.length; cnt = cnt + 1) {
            let field = keys[cnt]
            let value = data[field]

            if (data.tableName == 'users' && field == 'password') {
                value = md5(value)
            }

            if (typeof value == 'string') {
                values.push(field + '="' + value + '"')
            } else {
                values.push(field + '=' + value)
            }
        }

        return values.join(', ')
    }

    query (query) {
        return new Promise((resolve, reject) => {
            if (query.indexOf('SELECT') >= 0) {
                this.db.all(query, [], (err, rst) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rst)
                    }
                })
            } else {
                this.db.run(query, [], (err) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                })
            }
        })
    }

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

    close () {
        this.db.close()
        if (this.server) {
            this.server.close(() => {
                console.log('Exit')
                process.exit(1)
            })
            this.server = undefined
        }
    }
}

module.exports = Obj 