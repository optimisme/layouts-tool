const md5 = require('md5')
const fs = require('fs')
const jdbLib = require('./jdb.js')

class Obj {

    constructor () { 
        this.server = undefined
        this.jdb = new jdbLib('./server/jdb.json')
        this.closing = false

        this.dbToolScripts = ''
        this.uploadsFolder = './public/images'
    }

    async init () {

        await this.jdb.init()

        await this.jdb.createTableIfNotExists('usuaris', [
            { name: 'id',           type: 'number', unique: true,  md5: false, default: 'AUTOINCREMENT' },
            { name: 'nom',          type: 'string', unique: false, md5: false, default: '' },
            { name: 'cognom',       type: 'string', unique: false, md5: false, default: '' },
            { name: 'mail',         type: 'string', unique: true,  md5: false, default: 'NOTNULL' },
            { name: 'contrasenya',  type: 'string', unique: false, md5: true,  default: '' },
            { name: 'token',        type: 'string', unique: false, md5: false, default: '' },
        ])
        let users = await this.jdb.getRows('usuaris', 'row.mail == "admin@admin.com"')
        if (users.result.length == 0) {
            await this.jdb.insertRow('usuaris', {
                'nom': 'Admin',
                'cognom': 'Master',
                'mail': 'admin@admin.com',
                'contrasenya': 'admin123'
            })
        }

        process.on('SIGHUP', async () => { await this.close() })
        process.on('SIGINT', async () => { await this.close() })
        process.on('SIGTERM', async () => { await this.close() })

        await this.dbToolBuildScripts()
    }

    async close () {
        if (this.closing) return
        this.closing = true

        await this.jdb.close()
        if (this.server) {
            this.server.close(() => {
                console.log('Exit')
                process.exit(1)
            })
            this.server = undefined
        }
    }

    async appLogIn (data) {
        if (typeof data.mail == 'undefined'
         || typeof data.contrasenya == 'undefined'
         || data.mail.indexOf(';') >= 0 
         || data.contrasenya.indexOf(';') >= 0) { return { status: 'ko', result: 'appLogIn: Wrong data' } }

        try {
            let rst = await this.jdb.getRows('usuaris', `row.mail == "${data.mail}" && row.contrasenya == "${md5(data.contrasenya)}"`)
            if (rst.status == 'ok' && rst.result.length == 1) {
                let token = md5((Math.random()).toString())
                this.jdb.editRow('usuaris', { token: token }, `row.id == ${rst.result[0].id}`)
                rst.result[0].token=[token]
                return { status: 'ok', result: { id: rst.result[0].id, nom: rst.result[0].nom, cognom: rst.result[0].cognom, mail: rst.result[0].mail, token: token } }
            } else {
                return { status: 'ko', result: 'appLogIn: Impossible more than one user with same mail' }
            }
        } catch (err) {
            console.log(err)
            return { status: 'ko', result: 'appLogIn: Could not log in' }
        }
    }

    async appGetTokenUser (data) {
        if (typeof data.logInId != 'string'
         || typeof data.logInToken != 'string'
         || data.logInId.indexOf(';') >= 0
         || data.logInToken.indexOf(';') >= 0) { return { status: 'ko', result: 'appLogInToken: Wrong data' } }

        try {
            let rst = await this.jdb.getRows('usuaris', `row.id == "${data.logInId}" && row.token == "${data.logInToken}"`)
            if (rst.status == 'ok' && rst.result.length == 1) {
                return { id: rst.result[0].id, nom: rst.result[0].nom, cognom: rst.result[0].cognom, mail: rst.result[0].mail, token: rst.result[0].token }
            } else {
                return null
            } 
        } catch (err) {
            return null
        }
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

    async dbToolBuildScripts () {
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

            scripts +=  await this.dbToolBuildShadows()

            this.dbToolScripts = scripts
        } catch (err) {
            console.log(err)
        }
    }

    async dbToolBuildShadows () {
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
        if (this.dbToolScripts == '') {
            return { status: 'ko', result: 'Error "dbGetScripts" not ready' } 
        }
        try {
            return { status: 'ok', result: this.dbToolScripts }
        } catch (err) {
            return { status: 'ko', result: 'Error "dbGetScripts"' } 
        }
    }

    async dbGetTablesList (data) {
        return await this.jdb.getTables()
    }

    async dbAddTable (data) {
        if (typeof data.tableName == 'undefined'
         || data.tableName.indexOf(';') >= 0) { return { status: 'ko', result: 'dbAddTable: Wrong data' } }

        return await this.jdb.createTable(data.tableName, [ { name: 'id', type: 'number', unique: true,  md5: false, default: 'AUTOINCREMENT' } ])
    }

    async dbRenameTable (data) {
        if (typeof data.oldTableName == 'undefined'
         || typeof data.newTableName == 'undefined'
         || data.oldTableName.indexOf(';') >= 0
         || data.newTableName.indexOf(';') >= 0) { return { status: 'ko', result: 'dbRenameTable: Wrong data' } }

        return await this.jdb.renameTable(data.oldTableName, data.newTableName)
    }

    async dbDelTable (data) {
        if (typeof data.tableName == 'undefined'
         || data.tableName.indexOf(';') >= 0) { return { status: 'ko', result: 'dbDelTable: Wrong data' } }

        return await this.jdb.deleteTable(data.tableName)
    }

    async dbGetTableColumns (data) {
        if (typeof data.tableName == 'undefined'
         || data.tableName.indexOf(';') >= 0) { return { status: 'ko', result: 'dbGetTableColumns: Wrong data' } }

        return await this.jdb.getTableColumns(data.tableName)
    }

    async dbGetTableData (data) {
        if (typeof data.tableName == 'undefined'
         || data.tableName.indexOf(';') >= 0) { return { status: 'ko', result: 'dbGetTableData: Wrong data' } }

        if (typeof data.queryFilter != 'undefined'
         && data.queryFilter.indexOf(';') >= 0) { return { status: 'ko', result: 'dbGetTableData: Wrong data filter' } }

        return await this.jdb.getRows(data.tableName, data.queryFilter)
    }

    async dbAddColumn (data) {
        if (typeof data.tableName == 'undefined'
         || typeof data.columnName == 'undefined'
         || typeof data.columnType == 'undefined'
         || data.tableName.indexOf(';') >= 0
         || data.columnName.indexOf(';') >= 0
         || data.columnType.indexOf(';') >= 0) { return { status: 'ko', result: 'dbAddColumn: Wrong data' } }

        return await this.jdb.addTableColumn(data.tableName, { name: data.columnName, type: data.columnType, unique: false, md5: false, default: '' })
    }

    async dbRenameColumn (data) {
        if (typeof data.tableName == 'undefined'
         || typeof data.oldColumnName == 'undefined'
         || typeof data.newColumnName == 'undefined'
         || data.tableName.indexOf(';') >= 0
         || data.oldColumnName.indexOf(';') >= 0
         || data.newColumnName.indexOf(';') >= 0) { return { status: 'ko', result: 'dbRenameColumn: Wrong data' } }

        return await this.jdb.renameTableColumn(data.tableName, data.oldColumnName, data.newColumnName)
    }

    async dbDelColumn (data) {
        if (typeof data.tableName == 'undefined'
         || typeof data.columnName == 'undefined'
         || data.tableName.indexOf(';') >= 0
         || data.columnName.indexOf(';') >= 0) { return { status: 'ko', result: 'dbDelColumn: Wrong data' } }

        return await this.jdb.deleteTableColumn(data.tableName, data.columnName)
    }

    async dbAddRow (data) {
        if (typeof data.tableName == 'undefined'
        || data.tableName.indexOf(';') >= 0) { return { status: 'ko', result: 'dbAddRow: Wrong data' } }

        let keys = Object.keys(data.columns) 
        for (let cnt = 0; cnt < keys.length; cnt = cnt + 1) {
            let key = keys[cnt]
            let value = data.columns[key]
            if (key.indexOf(';') >= 0) {
                return { status: 'ko', result: `dbAddRow: Wrong data at key: "${key}"` }
            }
        }
        return await this.jdb.insertRow(data.tableName, data.columns)
    }

    async dbEditRow (data) {
        if (typeof data.tableName == 'undefined'
        || typeof data.columns.id != 'number'
        || data.tableName.indexOf(';') >= 0) { return { status: 'ko', result: 'dbEditRow: Wrong data' } }

        let keys = Object.keys(data.columns) 
        for (let cnt = 0; cnt < keys.length; cnt = cnt + 1) {
            let key = keys[cnt]
            let value = data.columns[key]
            if (key.indexOf(';') >= 0) {
                return { status: 'ko', result: `dbEditRow: Wrong data at key: "${key}"` }
            }
        }
        return await this.jdb.editRow(data.tableName, data.columns, `row.id == ${data.columns.id}`)
    }

    async dbDelRow (data) {
        if (typeof data.tableName == 'undefined'
         || typeof data.id != 'number'
         || data.tableName.indexOf(';') >= 0) { return { status: 'ko', result: 'dbDelRow: Wrong data' } }

        return await this.jdb.deleteRow(data.tableName, `row.id == ${data.id}`)
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