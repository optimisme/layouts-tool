const md5 = require('md5')
const fs = require('fs')
const { fail } = require('assert')

class Obj {

    constructor (file) { 
        this.file = file
        this.data = { 'tables': [] }
    }

    async init () {
        await this.load()
    }

    async close () {
        await this.save()
    }

    async load () {
        let fileStats = await fs.promises.stat(this.file).catch(e => false)
        let fileExists = !!fileStats
        if (fileExists) {
            this.data = JSON.parse(await fs.promises.readFile(this.file))
        } else {
            console.log(`Warning, "${this.file}" does not exist`)
            await this.save()
        }
    }

    async save () {
        let tmpName = this.file + '.tmp'
        try {
            await fs.promises.writeFile(tmpName, JSON.stringify(this.data, null, 4))
            await fs.promises.rename(tmpName, this.file)
        } catch (err) {
            console.log(err)
        }
    }

    getTable (tableName) {
        let table = this.data['tables'].filter((t) => { return t.name == tableName })
        if (table.length == 1) {
            return table[0]
        } else {
            return undefined
        }
    }

    async getTables () {
        return { status: 'ok', result: this.data['tables'].map((t) => { return t.name }) }
    }

    async createTable (tableName, columns) {
        let table = this.getTable(tableName)
        if (table == undefined) {
            this.data['tables'].push({ name: tableName, columns: columns, data: [] })
            await this.save()
            return { status: 'ok', result: '' }
        } else {
            return { status: 'ko', result: 'Error, createTable, table exists' }
        }
    }

    async createTableIfNotExists (tableName, columns) {
        let table = this.getTable(tableName)
        if (table == undefined) {
            await this.createTable(tableName, columns)
        }
        return { status: 'ok', result: '' }
    }

    async renameTable (oldName, newName) {
        let oldTable = this.getTable(oldName)
        let newTable = this.getTable(newName)
        if (oldTable != undefined && newTable == undefined) {
            oldTable.name = newName
            await this.save()
            return { status: 'ok', result: '' }
        } else {
            return { status: 'ko', result: 'Error, renameTable' }
        }
    }

    async deleteTable (tableName) {
        let table = this.getTable(tableName)
        if (table != undefined) {
            let tableIndex = this.data['tables'].indexOf(table)
            if (tableIndex != -1) {
                this.data['tables'].splice(tableIndex, 1)
                await this.save()
            }
            return { status: 'ok', result: '' }
        } else {
            return { status: 'ko', result: 'Error, deleteTable' }
        }
    }

    async getTableColumns (tableName) {
        let table = this.getTable(tableName)
        if (table != undefined) {
            return { status: 'ok', result: table.columns }
        } else {
            return { status: 'ko', result: 'Error, getTableColumns' }
        }
    }

    async addTableColumn (tableName, column) {
        let table = this.getTable(tableName)
        if (table != undefined) {
            let columns = table.columns.filter((row) => { return row.name == column.name })
            if (columns.length == 0) {
                table.columns.push(column)
                for (let cnt = 0; cnt < table.data.length; cnt = cnt + 1) {
                    let value = undefined
                    if (column.default == 'AUTOINCREMENT') {
                        value = cnt
                    } else if (column.unique) {
                        if (column.type == 'number') value = cnt
                        if (column.type == 'string') value = cnt.toString()
                    } else  {
                        if (column.type == 'number') value = 0
                        if (column.type == 'string') value = ''
                    } 
                    table.data[cnt][column.name] = value
                }
                await this.save()
                return { status: 'ok', result: '' }
            } else {
                return { status: 'ko', result: 'Error, getTableColumns (1)' }
            }
        } else {
            return { status: 'ko', result: 'Error, getTableColumns (2)' }
        }
    }

    async renameTableColumn (tableName, oldName, newName) {
        let table = this.getTable(tableName)
        if (table != undefined) {
            let oldColumns = table.columns.filter((row) => { return row.name == oldName })
            let newColumns = table.columns.filter((row) => { return row.name == newName })
            if (oldColumns.length == 1 && newColumns.length == 0) {
                let column = oldColumns[0]
                column.name = newName
                for (let cnt = 0; cnt < table.data.length; cnt = cnt + 1) {
                    table.data[cnt][newName] = table.data[cnt][oldName]
                    delete table.data[cnt][oldName]
                }
                await this.save()
                return { status: 'ok', result: '' }
            } else {
                return { status: 'ko', result: 'Error, renameTableColumn (1)' }
            }
        } else {
            return { status: 'ko', result: 'Error, renameTableColumn (2)' }
        }
    }

    async deleteTableColumn (tableName, columnName) {
        let table = this.getTable(tableName)
        if (table != undefined) {
            let columns = table.columns.filter((row) => { return row.name == columnName })
            if (columns.length == 1) {
                let columnIndex = table.columns.indexOf(columns[0])
                table.columns.splice(columnIndex, 1)
                for (let cnt = 0; cnt < table.data.length; cnt = cnt + 1) {
                    delete table.data[cnt][columnName]
                }
                await this.save()
                return { status: 'ok', result: '' }
            } else {
                return { status: 'ko', result: 'Error, deleteTableColumn (1)' }
            }
        } else {
            return { status: 'ko', result: 'Error, deleteTableColumn (2)' }
        }
    }

    async getRows (tableName, filter) {
        let table = this.getTable(tableName)
        try {
            if (table != undefined) {
                if (table.data.length == 0) {
                    return { status: 'ok', result: [] }
                } else if (typeof filter == 'string') {
                    return { status: 'ok', result: table.data.filter((row) => { return eval(filter) }) }
                } else {
                    return { status: 'ok', result: table.data }
                }
            } else {
                return { status: 'ko', result: 'Error, getRows (1)' }
            }
        } catch (err) {
            return { status: 'ko', result: 'Error, getRows (2)' }
        }
    }

    async insertRow (tableName, rowColumns) {
        let table = this.getTable(tableName)
        if (table != undefined) {
            let row = {}
            for (let cnt = 0; cnt < table.columns.length; cnt = cnt + 1) {
                let rowConfig = table.columns[cnt]
                let value = undefined
                if (rowColumns[rowConfig.name]) {
                    if (rowConfig.type == 'number') {
                        if (typeof rowColumns[rowConfig.name] == 'number') {
                            if (rowConfig.md5)      value = md5(parseFloat(rowColumns[rowConfig.name]))
                            else                    value = parseFloat(rowColumns[rowConfig.name])
                        } else {
                            return { status: 'ko', result:  `Error, editRow, row "${rowConfig.name}" must be a number` }
                        }
                    } else {
                        if (rowConfig.md5)      value = md5((rowColumns[rowConfig.name]).toString())
                        else                    value = (rowColumns[rowConfig.name]).toString()
                    }
                }
                if (rowConfig.default == 'AUTOINCREMENT') {
                    if (table.data.length == 0) value = 0
                    else                        value = (table.data[table.data.length - 1][rowConfig.name]) + 1
                } else if (value == undefined) {
                    if (rowConfig.default == 'NOTNULL') {
                        return { status: 'ko', result:  `Error, insertRow, "${rowConfig.name}" can't be NULL` }
                    }
                    if (rowConfig.md5) value = md5(rowConfig.default)
                    else value = rowConfig.default
                }
                if (rowConfig.unique) {
                    let rows = []
                    if (rowConfig.type == 'number') rows = await table.data.filter((row) => { return eval(`row.${rowConfig.name} == ${value}`) })
                    if (rowConfig.type == 'string') rows = await table.data.filter((row) => { return eval(`row.${rowConfig.name} == "${value}"`) })
                    if (rows.length != 0) {
                        return { status: 'ko', result:  `Error, insertRow, "${rowConfig.name}" must be unique` }
                    }
                }
                row[rowConfig.name] = value
            }
            if ((Object.keys(row)).length == table.columns.length) {
                table.data.push(row)
                await this.save()
                return { status: 'ok', result: '' }
            } else {
                return { status: 'ko', result: 'Error, insertRow (1)' }
            }
        } else {
            return { status: 'ko', result: 'Error, insertRow (2)' }
        }
    }

    async editRow (tableName, rowColumns, filter) {
        let table = this.getTable(tableName)
        if (table != undefined) {
            let rowsFilter = table.data.filter((row) => { return eval(filter) })
            let row = {}
            if (rowsFilter.length == 1) {
                row = rowsFilter[0]
            } else {
                return { status: 'ko', result:  `Error, editRow, filter must get a single row` }
            }
            for (let cnt = 0; cnt < table.columns.length; cnt = cnt + 1) {
                let rowConfig = table.columns[cnt]
                let value = undefined
                if (rowColumns[rowConfig.name] && rowConfig.default != 'AUTOINCREMENT') {
                    if (rowConfig.type == 'number') {
                        if (typeof rowColumns[rowConfig.name] == 'number') {
                            if (rowConfig.md5)  value = md5(parseFloat(rowColumns[rowConfig.name]))
                            else                value = parseFloat(rowColumns[rowConfig.name])
                        } else {
                            return { status: 'ko', result:  `Error, editRow, row "${rowConfig.name}" must be a number` }
                        }
                    } else {
                        if (rowConfig.md5)  value = md5((rowColumns[rowConfig.name]).toString())
                        else                value = (rowColumns[rowConfig.name]).toString()
                    }
                } else {
                    value = row[rowConfig.name]
                }
                if (rowConfig.unique) {
                    let rows = []
                    if (rowConfig.type == 'number') rows = await table.data.filter((row) => { return eval(`row.${rowConfig.name} == ${value}`) })
                    if (rowConfig.type == 'string') rows = await table.data.filter((row) => { return eval(`row.${rowConfig.name} == "${value}"`) })
                    if (rows.length != 0  && rows[0] != row) {
                        return { status: 'ko', result:  `Error, editRow, "${rowConfig.name}" must be unique` }
                    }
                }
                row[rowConfig.name] = value
            }
            await this.save()
            return { status: 'ok', result: '' }
        } else {
            return { status: 'ko', result: 'Error, editRow' }
        }
    }

    async deleteRow (tableName, filter) {
        let table = this.getTable(tableName)
        if (table != undefined) {
            let rowsFilter = table.data.filter((row) => { return eval(filter) })
            let row = {}
            if (rowsFilter.length == 1) {
                row = rowsFilter[0]
            } else {
                return { status: 'ko', result:  `Error, deleteRow, filter must get a single row` }
            }
            let rowIndex = table.data.indexOf(row)
            table.data.splice(rowIndex, 1)
            await this.save()
            return { status: 'ok', result: '' }
        } else {
            return { status: 'ko', result: 'Error, deleteRow, table does not exist' }
        }
    }
}

module.exports = Obj 