const sqlite = require('sqlite3-lite')
const md5 = require('md5')
const fs = require('fs')

class Obj {

    constructor () { 
        this.server = undefined
        this.db = new sqlite.Database('./server/data.db')

        this.dbScripts = ''
    }

    async init () {

        process.on('SIGHUP', () => { this.close() })
        process.on('SIGINT', () => { this.close() })
        process.on('SIGTERM', () => { this.close() })

        await this.dbBuildScripts()

        //await this.query('CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, description TEXT NOT NULL)')
        //await this.query('CREATE TABLE IF NOT EXISTS users    (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT NOT NULL, name TEXT NOT NULL, surname TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL, tokens TEXT NOT NULL)')
        //await this.query('CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT NOT NULL, image TEXT NOT NULL, price REAL  NOT NULL)')
/*
        let rst = await this.query('SELECT * FROM users WHERE id="1"')
        if (rst.length == 0) {
            await this.query(`INSERT INTO users (id, name, surname, type, email, password, tokens) VALUES (1, "Admin", "", "admin", "admin@admin.com", "${md5('admin')}", "[]")`)
        }*/
    }
/*
    async signIn (data) {
        if (typeof data.email == 'undefined'
         || typeof data.password == 'undefined'
         || data.email.indexOf(';') >= 0 
         || data.password.indexOf(';') >= 0) { return { status: 'ko', result: 'signIn: Wrong signIn data' } }

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
         || typeof data.signInToken == 'undefined') { return { status: 'ko', result: 'signInToken: Wrong signIn data' } }

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
         || typeof data.signInToken == 'undefined') { return { status: 'ko', result: 'signOut: Wrong signIn data' } }

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
         || data.surname.indexOf(';') >= 0) { return { status: 'ko', result: 'signUp: Wrong data' } }

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
// TODO: tornar error si hi ha
        let signInObj = {
            email: data.email,
            password: data.password
        }
        
        return await this.signIn(signInObj)
    }

    async userEdit (data) {

        if (typeof data.email == 'undefined'
         || typeof data.password == 'undefined'
         || typeof data.name == 'undefined'
         || typeof data.surname == 'undefined'
         || data.email.indexOf(';') >= 0
         || data.password.indexOf(';') >= 0
         || data.name.indexOf(';') >= 0
         || data.surname.indexOf(';') >= 0) { return { status: 'ko', result: 'userEdit: Wrong data' } }

        let updateObj = {
            tableName: 'users',
            id: data.signInId,
            name: data.name,
            surname: data.surname,
            email: data.email
        }

        if (data.password != '') {
            updateObj.password = data.password
        }

        await this.update(updateObj)
// TODO: tornar error si hi ha
        let signInObj = {
            signInId: data.signInId,
            signInToken: data.signInToken
        }
        
        return await this.signInToken(signInObj)
    }

    async getUser (data) {
        if (typeof data.signInId != 'number'
         || typeof data.signInToken == 'undefined') { return { status: 'ko', result: 'getUser: Wrong data' } }

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
*/
/*
    async get (data) {
        if (typeof data.tableName == 'undefined'
         || data.tableName.indexOf(';') >= 0) { return { status: 'ko', result: 'get: Wrong data' } }

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
         || typeof data.id != 'number'
         || data.tableName.indexOf(';') >= 0) { return { status: 'ko', result: 'del: Wrong data' } }

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
         || typeof data.id != 'number'
         || data.tableName.indexOf(';') >= 0) { return { status: 'ko', result: 'update: Wrong data' } }

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
*/
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
            } else if (query.indexOf('PRAGMA') >= 0) {
                this.db.all(query, (err, rst) => {
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

    async dbBuildScripts () {
        let folderFiles = []
        let scripts = ''

        try {
            folderFiles = await fs.promises.readdir('./public/tooldb/')
            folderFiles.sort((a, b) => { return a.length - b.length })
            for (let cntFile = 0; cntFile < folderFiles.length; cntFile = cntFile + 1) {
                let fileName = folderFiles[cntFile]
                if (fileName.indexOf('db-tool') == 0 && fileName.indexOf('.js') > 0) {
                    let fileContent = await fs.promises.readFile('./public/tooldb/' + fileName, 'utf-8')
                    let key = (fileContent.substring(0, fileContent.indexOf('extends'))).split(' ')[1]
                    scripts += fileContent + `;\nwindow.${key} = ${key};\n`
                }
            }

            scripts +=  await this.dbBuildShadows()

            this.dbScripts = scripts
        } catch (err) {
            console.log(err)
        }
    }

    async dbBuildShadows () {
        let folderFiles = []
        let shadows = {}
        try {
            folderFiles = await fs.promises.readdir('./public/tooldb/')
            folderFiles.sort((a, b) => { return a.length - b.length })
            for (let cntFile = 0; cntFile < folderFiles.length; cntFile = cntFile + 1) {
                let fileName = folderFiles[cntFile]
                let tagName = fileName.substring(0, fileName.indexOf('.'))
                if (fileName.indexOf('db-tool') == 0 && fileName.indexOf('.js') > 0) {
                    let fileContent = await fs.promises.readFile('./public/tooldb/' + fileName, 'utf-8')
                    let key = (fileContent.substring(0, fileContent.indexOf('extends'))).split(' ')[1]
                    shadows[key] = [tagName, '', '']
                    shadows[key][1] = await fs.promises.readFile('./public/tooldb/' + tagName + '.html', 'utf-8')
                    shadows[key][2] = await fs.promises.readFile('./public/tooldb/' + tagName + '.css', 'utf-8')
                }
            }
            return `appDb.shadowElements = ${JSON.stringify(shadows, null, 4)};\n`
        } catch (err) {
            console.log(err)
        }
    }

    async dbGetScripts (data) {
        if (this.dbScripts == '') {
            return { status: 'ko', result: 'Error "dbGetScripts" not ready' } 
        }
        try {
            return { status: 'ok', result: this.dbScripts }
        } catch (err) {
            return { status: 'ko', result: 'Error "dbGetScripts"' } 
        }
    }

    async dbGetTablesList (data) {
        try {
            return { status: 'ok', result: await this.query('SELECT name FROM sqlite_master WHERE type="table" AND name NOT LIKE "sqlite_%" ORDER BY name') }
        } catch (err) {
            return { status: 'ko', result: 'Error "dbGetTablesList"' } 
        }
    }

    async dbAddTable (data) {
        if (typeof data.name == 'undefined'
         || data.name.indexOf(';') >= 0) { return { status: 'ko', result: 'dbAddTable: Wrong data' } }

        try {
            return { status: 'ok', result: await this.query(`CREATE TABLE IF NOT EXISTS "${data.name}" (id INTEGER PRIMARY KEY AUTOINCREMENT)`) }
        } catch (err) {
            return { status: 'ko', result: 'Error "dbAddTable"' } 
        } 
    }

    async dbRenameTable (data) {
        if (typeof data.oldName == 'undefined'
         || typeof data.newName == 'undefined'
         || data.oldName.indexOf(';') >= 0
         || data.newName.indexOf(';') >= 0) { return { status: 'ko', result: 'dbRenameTable: Wrong data' } }

        try {
            return { status: 'ok', result: await this.query(`ALTER TABLE "${data.oldName}" RENAME TO "${data.newName}"`) }
        } catch (err) {
            return { status: 'ko', result: 'Error "dbRenameTable"' } 
        } 
    }

    async dbDelTable (data) {
        if (typeof data.name == 'undefined'
         || data.name.indexOf(';') >= 0) { return { status: 'ko', result: 'dbDelTable: Wrong data' } }

        try {
            return { status: 'ok', result: await this.query(`DROP TABLE IF EXISTS "${data.name}"`) }
        } catch (err) {
            return { status: 'ko', result: 'Error "dbDelTable"' } 
        } 
    }

    async dbGetTableColumns (data) {
        if (typeof data.name == 'undefined'
         || data.name.indexOf(';') >= 0) { return { status: 'ko', result: 'dbGetTableColumns: Wrong data' } }

        try {
            return { status: 'ok', result: await this.query(`PRAGMA table_info("${data.name}")`) }
        } catch (err) {
            return { status: 'ko', result: 'Error "dbGetTableColumns"' } 
        }    
    }

    async dbGetTableData (data) {
        if (typeof data.name == 'undefined'
         || data.name.indexOf(';') >= 0) { return { status: 'ko', result: 'dbGetTableData: Wrong data' } }

        try {
            return { status: 'ok', result: await this.query(`SELECT * FROM "${data.name}"`) }
        } catch (err) {
            return { status: 'ko', result: 'Error "dbGetTableData"' } 
        }     
    }

    async dbAddColumn (data) {
        if (typeof data.tableName == 'undefined'
        || typeof data.columnName == 'undefined'
        || typeof data.columnType == 'undefined'
        || data.tableName.indexOf(';') >= 0
        || data.columnName.indexOf(';') >= 0
        || data.columnType.indexOf(';') >= 0) { return { status: 'ko', result: 'dbAddColumn: Wrong data' } }

       try {
           return { status: 'ok', result: await this.query(`ALTER TABLE "${data.tableName}" ADD COLUMN "${data.columnName}" ${data.columnType}`) }
       } catch (err) {
           return { status: 'ko', result: 'Error "dbAddColumn"' } 
       }  
    }

    async dbRenameColumn (data) {
        if (typeof data.tableName == 'undefined'
        || typeof data.oldColumnName == 'undefined'
        || typeof data.newColumnName == 'undefined'
        || data.tableName.indexOf(';') >= 0
        || data.oldColumnName.indexOf(';') >= 0
        || data.newColumnName.indexOf(';') >= 0) { return { status: 'ko', result: 'dbRenameColumn: Wrong data' } }

       try {
           return { status: 'ok', result: await this.query(`ALTER TABLE "${data.tableName}" RENAME COLUMN "${data.oldColumnName}" TO "${data.newColumnName}"`) }
       } catch (err) {
           return { status: 'ko', result: 'Error "dbRenameColumn"' } 
       }  
    }

    async dbDelColumn (data) {
        if (typeof data.tableName == 'undefined'
        || typeof data.columnName == 'undefined'
        || data.tableName.indexOf(';') >= 0
        || data.columnName.indexOf(';') >= 0) { return { status: 'ko', result: 'dbDelColumn: Wrong data' } }

        try {
            let oldCreate = (await this.query(`SELECT sql FROM sqlite_master WHERE name = "${data.tableName}"`))[0].sql
            let columnPosition = oldCreate.indexOf(', ' + data.columnName + ' ')
            if (columnPosition == -1) { columnPosition = oldCreate.indexOf(`, "${data.columnName}" `) }
            if (columnPosition == -1) { columnPosition = oldCreate.indexOf(`, '${data.columnName}' `) }
            let columnEnd = oldCreate.substring(columnPosition + 1)
            let columnLength = columnEnd.indexOf(',')
            if (columnLength == - 1) { columnLength = columnEnd.indexOf(')') }
            let newCreate = oldCreate.substr(0, columnPosition) + oldCreate.substring(columnPosition + columnLength + 1)
            let tableInfo = await this.query(`PRAGMA table_info("${data.tableName}")`)
            let columns = (tableInfo.map((x) => { return x.name }))
            let columnsRemoved = columns.filter((x) => { return (x != data.columnName) })
            let columnsQuotes = columnsRemoved.map((x) => { return `"${x}"` })
            let columnsSeparated = columnsQuotes.join(', ')

            await this.query(`ALTER TABLE "${data.tableName}" RENAME TO "${data.tableName}_old"`)
            await this.query(newCreate)
            await this.query(`INSERT INTO "${data.tableName}" (${columnsSeparated}) SELECT ${columnsSeparated} FROM "${data.tableName}_old"`)
            await this.query(`DROP TABLE "${data.tableName}_old"`)

            return { status: 'ok', result: '' }
        } catch (err) {
            return { status: 'ko', result: 'Error "dbDelColumn"' } 
        }  
    }

    async dbAddRow (data) {
        if (typeof data.tableName == 'undefined'
        || data.tableName.indexOf(';') >= 0) { return { status: 'ko', result: 'dbAddRow: Wrong data' } }

        let columns = (Object.keys(data.columns))
        let columnsRemoved = columns.filter((x) => { return (x.indexOf(';') == -1) })
        let columnsQuotes = columnsRemoved.map((x) => { return `"${x}"` })
        let columnsSeparated = columnsQuotes.join(', ')
        let values = []
        let tableColumns = []

        try {
            tableColumns = await this.query(`PRAGMA table_info("${data.tableName}")`)
            for (let cnt = 0; cnt < tableColumns.length; cnt = cnt + 1) {
                let column = tableColumns[cnt]
                if (typeof data.columns[column.name] != 'undefined') {
                    if (column.type == "TEXT") {
                        values.push(`"${data.columns[column.name]}"`)
                    } else {
                        if (data.columns[column.name].indexOf(';') == -1) {
                            values.push(`${data.columns[column.name]}`)
                        }
                    }
                }
            }

            return { status: 'ok', result: await this.query(`INSERT INTO "${data.tableName}" (${columnsSeparated}) VALUES (${values.join(', ')})`) }
       } catch (err) {
            return { status: 'ko', result: 'Error "dbAddRow"' } 
       }
    }

    async dbEditRow (data) {
        if (typeof data.tableName == 'undefined'
        || typeof data.columns.id != 'number'
        || data.tableName.indexOf(';') >= 0) { return { status: 'ko', result: 'dbEditRow: Wrong data' } }

        let values = []
        let tableColumns = []

        try {
            tableColumns = await this.query(`PRAGMA table_info("${data.tableName}")`)
            for (let cnt = 0; cnt < tableColumns.length; cnt = cnt + 1) {
                let column = tableColumns[cnt]
                if (typeof data.columns[column.name] != 'undefined') {
                    if (column.type == "TEXT") {
                        values.push(`"${column.name}" = "${data.columns[column.name]}"`)
                    } else {
                        values.push(`"${column.name}" = ${data.columns[column.name]}`)
                    }
                }
            }
            return { status: 'ok', result: await this.query(`UPDATE "${data.tableName}" SET ${values.join(', ')} WHERE "id" = ${data.columns.id}`) }
       } catch (err) {
           console.log(err)
            return { status: 'ko', result: 'Error "dbEditRow"' } 
       }
    }
}

module.exports = Obj 