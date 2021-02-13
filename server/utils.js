const sqlite = require('sqlite3')
const md5 = require('md5')
const fs = require('fs')

class Obj {

    constructor () { 
        this.server = undefined
        this.db = new sqlite.Database('./server/data.db')

        this.dbScripts = ''
        this.uploadsFolder = './public/images'
    }

    async init () {

        process.on('SIGHUP', () => { this.close() })
        process.on('SIGINT', () => { this.close() })
        process.on('SIGTERM', () => { this.close() })

        await this.dbBuildScripts()

        await this.query('CREATE TABLE IF NOT EXISTS usuaris (id INTEGER PRIMARY KEY AUTOINCREMENT, nom TEXT NOT NULL, cognom TEXT NOT NULL, mail TEXT NOT NULL UNIQUE, contrasenya TEXT NOT NULL, token TEXT)')

        let rst = await this.query('SELECT * FROM usuaris WHERE mail="admin@admin.com"')
        if (rst.length == 0) {
            await this.query(`INSERT INTO usuaris (nom, cognom, mail, contrasenya, token) VALUES ("Admin", "Master", "admin@admin.com", "${md5('admin123')}", "")`)
        }
    }

    async appLogIn (data) {
        if (typeof data.mail == 'undefined'
         || typeof data.contrasenya == 'undefined'
         || data.mail.indexOf(';') >= 0 
         || data.contrasenya.indexOf(';') >= 0) { return { status: 'ko', result: 'appLogIn: Wrong data' } }

        try {
            let rst = await this.query(`SELECT * FROM usuaris WHERE mail="${data.mail}" AND contrasenya="${md5(data.contrasenya)}"`)
            if (rst.length == 1) {
                let token = md5((Math.random()).toString())
                await this.query(`UPDATE usuaris SET token='${token}' WHERE id=${rst[0].id}`)
                rst[0].token=[token]
                return { status: 'ok', result: { id: rst[0].id, nom: rst[0].nom, cognom: rst[0].cognom, mail: rst[0].mail, token: token } }
            } else {
                return { status: 'ko', result: 'appLogIn: Impossible more than one user with same mail' }
            }
        } catch (err) {
            return { status: 'ko', result: 'appLogIn: Could not log in' }
        }
    }

    async appGetTokenUser (data) {
        if (typeof data.logInId != 'string'
         || typeof data.logInToken != 'string'
         || data.logInId.indexOf(';') >= 0
         || data.logInToken.indexOf(';') >= 0) { return { status: 'ko', result: 'appLogInToken: Wrong data' } }

        try {
            let rst = await this.query(`SELECT * FROM usuaris WHERE id="${data.logInId}" AND token="${data.logInToken}"`)
            if (rst.length == 1) {
                return { id: rst[0].id, nom: rst[0].nom, cognom: rst[0].cognom, mail: rst[0].mail, token: rst[0].token }
            } else {
                return null
            } 
        } catch (err) {
            return null
        }
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
            return { status: 'ko', result: 'Error "dbGetTablesList": ' + err.toString() } 
        }
    }

    async dbAddTable (data) {
        if (typeof data.tableName == 'undefined'
         || data.tableName.indexOf(';') >= 0) { return { status: 'ko', result: 'dbAddTable: Wrong data' } }

        try {
            return { status: 'ok', result: await this.query(`CREATE TABLE IF NOT EXISTS "${data.tableName}" (id INTEGER PRIMARY KEY AUTOINCREMENT)`) }
        } catch (err) {
            return { status: 'ko', result: 'Error "dbAddTable": ' + err.toString() } 
        } 
    }

    async dbRenameTable (data) {
        if (typeof data.oldTableName == 'undefined'
         || typeof data.newTableName == 'undefined'
         || data.oldTableName.indexOf(';') >= 0
         || data.newTableName.indexOf(';') >= 0) { return { status: 'ko', result: 'dbRenameTable: Wrong data' } }

        try {
            return { status: 'ok', result: await this.query(`ALTER TABLE "${data.oldTableName}" RENAME TO "${data.newTableName}"`) }
        } catch (err) {
            return { status: 'ko', result: 'Error "dbRenameTable": ' + err.toString() } 
        } 
    }

    async dbDelTable (data) {
        if (typeof data.tableName == 'undefined'
         || data.tableName.indexOf(';') >= 0) { return { status: 'ko', result: 'dbDelTable: Wrong data' } }

        try {
            return { status: 'ok', result: await this.query(`DROP TABLE IF EXISTS "${data.tableName}"`) }
        } catch (err) {
            return { status: 'ko', result: 'Error "dbDelTable": ' + err.toString() } 
        } 
    }

    async dbGetTableColumns (data) {
        if (typeof data.tableName == 'undefined'
         || data.tableName.indexOf(';') >= 0) { return { status: 'ko', result: 'dbGetTableColumns: Wrong data' } }

        try {
            return { status: 'ok', result: await this.query(`PRAGMA table_info("${data.tableName}")`) }
        } catch (err) {
            return { status: 'ko', result: 'Error "dbGetTableColumns": ' + err.toString() } 
        }    
    }

    async dbGetTableData (data) {
        if (typeof data.tableName == 'undefined'
         || data.tableName.indexOf(';') >= 0) { return { status: 'ko', result: 'dbGetTableData: Wrong data' } }

        if (typeof data.queryFilter != 'undefined'
         && data.queryFilter.indexOf(';') >= 0) { return { status: 'ko', result: 'dbGetTableData: Wrong data filter' } }

        try {
            if (typeof data.queryFilter == 'undefined') {
                return { status: 'ok', result: await this.query(`SELECT * FROM "${data.tableName}"`) }
            } else {
                return { status: 'ok', result: await this.query(`SELECT * FROM "${data.tableName}" ${data.queryFilter}`) }
            }
        } catch (err) {
            return { status: 'ko', result: 'Error "dbGetTableData": ' + err.toString() } 
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
           return { status: 'ko', result: 'Error "dbAddColumn": ' + err.toString() } 
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
           return { status: 'ko', result: 'Error "dbRenameColumn": ' + err.toString() } 
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
            return { status: 'ko', result: 'Error "dbDelColumn": ' + err.toString() } 
        }  
    }

    async dbAddRow (data) {
        if (typeof data.tableName == 'undefined'
        || data.tableName.indexOf(';') >= 0) { return { status: 'ko', result: 'dbAddRow: Wrong data' } }

        let values = []
        let columns = []
        let tableColumns = []

        try {
            tableColumns = await this.query(`PRAGMA table_info("${data.tableName}")`)
            for (let cnt = 0; cnt < tableColumns.length; cnt = cnt + 1) {
                let column = tableColumns[cnt]
                if (typeof data.columns[column.name] != 'undefined') {
                    columns.push(column.name)
                    if (column.type == "TEXT") {
                        if (data.tableName == 'usuaris' && column.name == 'contrasenya') {
                            values.push(`"${md5(data.columns[column.name])}"`)
                        } else {
                            values.push(`"${data.columns[column.name]}"`)
                        }
                    } else if (column.type == "REAL" || column.type == "NUMBER") {
                        values.push(parseFloat(data.columns[column.name]))
                    } else if (column.type == "INTEGER") {
                        values.push(parseInt(data.columns[column.name]))
                    }
                }
            }

            let columnsRemoved = columns.filter((x) => { return (x.indexOf(';') == -1) })
            let columnsQuotes = columnsRemoved.map((x) => { return `"${x}"` })
            let columnsSeparated = columnsQuotes.join(', ')

            return { status: 'ok', result: await this.query(`INSERT INTO "${data.tableName}" (${columnsSeparated}) VALUES (${values.join(', ')})`) }
       } catch (err) {
            let str = await err.toString()
            console.log(str)
            return { status: 'ko', result: 'Error "dbAddRow": ' + err.toString() } 
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
                        if (data.tableName == 'usuaris' && column.name == 'contrasenya') {
                            values.push(`"${column.name}" = "${md5(data.columns[column.name])}"`)
                        } else {
                            values.push(`"${column.name}" = "${data.columns[column.name]}"`)
                        }
                    } else if (column.type == "REAL" || column.type == "NUMBER") {
                        values.push(`"${column.name}" = "${parseFloat(data.columns[column.name])}"`)
                    } else if (column.type == "INTEGER") {
                        values.push(`"${column.name}" = "${parseInt(data.columns[column.name])}"`)
                    }
                }
            }
            return { status: 'ok', result: await this.query(`UPDATE "${data.tableName}" SET ${values.join(', ')} WHERE "id" = ${data.columns.id}`) }
       } catch (err) {
           console.log(err)
            return { status: 'ko', result: 'Error "dbEditRow": ' + err.toString() } 
       }
    }

    async dbDelRow (data) {
        if (typeof data.tableName == 'undefined'
        || typeof data.id != 'number'
        || data.tableName.indexOf(';') >= 0) { return { status: 'ko', result: 'dbDelRow: Wrong data' } }

        try {
            return { status: 'ok', result: await this.query(`DELETE FROM "${data.tableName}" WHERE "id" = ${data.id}`) }
       } catch (err) {
           console.log(err)
            return { status: 'ko', result: 'Error "dbDelRow": ' + err.toString() } 
       }
    }

    async uploadFileChunk (data) {
        if (typeof data.fileName == 'undefined'
         || typeof data.offset != 'number'
         || typeof data.chunk == 'undefined'
         || data.fileName.indexOf(';') >= 0
         || data.chunk.indexOf(';') >= 0) { return { status: 'ko', result: 'uploadFileChunk: Wrong data' } }
        let rst = { }
        try {
            let buffer = new Buffer.from(data.chunk, 'base64')
            if (data.offset == 0) {
                await fs.promises.writeFile(`${this.uploadsFolder}/tmp_${data.fileName}.part`, buffer)
            } else {
                await fs.promises.appendFile(`${this.uploadsFolder}/tmp_${data.fileName}.part`, buffer)
            }
            rst = { status: 'ok', result: '' } 
        } catch (err) {
            rst = { status: 'ko', result: 'Could not upload file chunk' } 
        }
        return rst
    }

    async uploadFileDone (data) {
        if (typeof data.fileName == 'undefined'
         || data.fileName.indexOf(';') >= 0) { return { status: 'ko', result: 'uploadFileDone: Wrong data' } }
        let rst = { }
        try {
            await fs.promises.rename(`${this.uploadsFolder}/tmp_${data.fileName}.part`, `${this.uploadsFolder}/${data.fileName}`)
            rst = { status: 'ok', result: '' } 
        } catch (err) {
            rst = { status: 'ko', result: 'Could not rename file' } 
        }
        return rst
    }

    async uploadFileError (data) {
        if (typeof data.fileName == 'undefined'
         || data.fileName.indexOf(';') >= 0) { return { status: 'ko', result: 'uploadFileError: Wrong data' } }
        let rst = { }
        try {
            await fs.promises.unlink(`${this.uploadsFolder}/tmp_${data.fileName}.part`)
            rst = { status: 'ok', result: '' } 
        } catch (err) {
            rst = { status: 'ko', result: 'Could not unlink file' } 
        }
        return rst
    }
}

module.exports = Obj 