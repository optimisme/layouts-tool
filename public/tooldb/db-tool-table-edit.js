class DbToolTableEdit extends HTMLElement {

    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
    }

    attributeChangedCallback(name, oldValue, newValue) { }
    async waitUntilConnected() { while (!this.connected) { await appDb.wait(1) } }

    async connectedCallback () {

        appDb.refTableEdit = this

        this.shadow.innerHTML = appDb.shadowElements[this.constructor.name][1]
        this.elmStyle = document.createElement('style')
        this.elmStyle.textContent = appDb.shadowElements[this.constructor.name][2]
        this.shadow.appendChild(this.elmStyle)

        let refAddColumn = this.shadow.querySelector('#addColumn')
        refAddColumn.addEventListener('click', async () => {
            await appDb.addColumn()
            await appDb.refresh()
        })

        let refAddRow = this.shadow.querySelector('#addRow')
        refAddRow.addEventListener('click', async () => {
            await appDb.addRow()
            await appDb.refresh()
        })
    }

    async selectTable () {
        let refContainer = this.shadow.querySelector('.container')
        refContainer.style.display = 'grid'

        await this.refresh()
    }

    async unselectTable () {
        let refContainer = this.shadow.querySelector('.container')
        refContainer.style.display = 'none'
        this.clearTable()
    }

    clearTable () {
        let refTable = this.shadow.querySelector('.table')
        while (refTable.firstChild) { refTable.removeChild(refTable.lastChild) }
    }

    async refresh () {
        let tableName = appDb.refTableSelected.textContent
        let rstColumns = JSON.parse(await appDb.callServer('POST',  '/query', { loginInId: 'tooldb', type: 'dbGetTableColumns',  tableName: tableName }))
        let rstData =    JSON.parse(await appDb.callServer('POST',  '/query', { loginInId: 'tooldb', type: 'dbGetTableData',     tableName: tableName }))
        let objTable = document.createElement('table')
        let columns = []
        let data = []

        this.clearTable()
        if (rstColumns.status == 'ok' && rstData.status == 'ok') {
            let objTr = document.createElement('tr')
            columns = rstColumns.result

            for (let cnt = 0; cnt < columns.length; cnt = cnt + 1) {
                let objTd = document.createElement('td')
                let column = columns[cnt]
                let tmp = document.createElement('db-tool-table-edit-column')
                
                tmp.textContent = column.name
                tmp.valueType = column.type
                tmp.valueUnique = column.unique
                tmp.valueMd5 = column.md5
                tmp.valueDefault = column.default

                objTd.appendChild(tmp)
                objTr.appendChild(objTd)
            }
            objTable.appendChild(objTr)
            objTr = document.createElement('tr')

            data = rstData.result
            for (let cntRow = 0; cntRow < data.length; cntRow = cntRow + 1) {
                let objTr = document.createElement('tr')
                let columns = Object.keys(data[cntRow])
                let row = data[cntRow]
                for (let cntColumn = 0; cntColumn < columns.length; cntColumn = cntColumn + 1) {
                    let objTd = document.createElement('td')
                    let columnName = columns[cntColumn]
                    let cell = row[columnName]
                    let tmp = document.createElement('db-tool-table-edit-cell')
                    tmp.textContent = cell
                    tmp.valueId = row['id']
                    tmp.valueColumn = columnName

                    objTd.appendChild(tmp)
                    objTr.appendChild(objTd)
                }
                objTable.appendChild(objTr)
                objTr = document.createElement('tr')
            }
        }

        let refTable = this.shadow.querySelector('.table')
        refTable.appendChild(objTable)
        refTable.style.gridTemplateColumns = (new Array(columns.length + 1)).join('auto ')  

        appDb.refTableSelectedColumns = columns
        appDb.refTableSelectedRows = data
    }
}