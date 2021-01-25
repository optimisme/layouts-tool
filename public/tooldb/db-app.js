class AppDb {

    constructor () {
        this.handler = this.init.bind(this)
        window.addEventListener('load', this.handler)

        this.tables = []
        this.refTablesList = null
        this.refTableEdit = null
        this.refTableSelected = null
        this.refTableSelectedColumns = []

        this.shadowElements = {
            DbTool:                     ['db-tool',                     '', ''],
            DbToolFormButton:           ['db-tool-form-button',         '', ''],
            DbToolFormInputText:        ['db-tool-form-input-text',     '', ''],
            DbToolFormSpinner:          ['db-tool-form-spinner',        '', ''],
            DbToolModal:                ['db-tool-modal',               '', ''],
            DbToolModalAddColumn:       ['db-tool-modal-add-column',    '', ''],
            DbToolModalAddRow:          ['db-tool-modal-add-row',       '', ''],
            DbToolModalAddTable:        ['db-tool-modal-add-table',     '', ''],
            DbToolModalRenameTable:     ['db-tool-modal-rename-table',  '', ''],
            DbToolModalDelTable:        ['db-tool-modal-del-table',     '', ''],
            DbToolTableEdit:            ['db-tool-table-edit',          '', ''],
            DbToolModalEditColumn:      ['db-tool-modal-edit-column',   '', ''],
            DbToolModalEditRow:         ['db-tool-modal-edit-row',      '', ''],
            DbToolTableEditCell:        ['db-tool-table-edit-cell',     '', ''],
            DbToolTableEditColumn:      ['db-tool-table-edit-column',   '', ''],
            DbToolTablesListItem:       ['db-tool-tables-list-item',    '', ''],
            DbToolTablesList:           ['db-tool-tables-list',         '', ''],
        }
    }

    async init () {
        let refBody = document.getElementsByTagName('body')[0]
        let keys = Object.keys(this.shadowElements)
        let refLogo = refBody.querySelector('.logo')
        let refLoading = refBody.querySelector('.loading')

        let scriptsReady = false
        try {
            let rstScripts = JSON.parse(await appDb.callServer('POST', '/query', { type: 'dbGetScripts' }))
            if (rstScripts.status == 'ok') {
                eval(rstScripts.result)
                scriptsReady = true
            }
        } catch (e) {
            console.log(e)
        }

        let shadowsReady = false
        try {
            let rstShadows = JSON.parse(await appDb.callServer('POST', '/query', { type: 'dbGetShadows' }))
            if (rstShadows.status == 'ok') {
                this.shadowElements = rstShadows.result
                shadowsReady = true
            }
        } catch (e) {
            console.log(e)
        }

        for (let cnt = 0; cnt < keys.length; cnt = cnt + 1) {
            let key = keys[cnt]
            let element = this.shadowElements[key]
            if (!scriptsReady) {
                let script = (await this.callServer('GET',`./${element[0]}.js`, {}))
                eval(`${script}; window.${key} = ${key}`)
            }
            eval(`customElements.define("${element[0]}", ${key})`)
            if (!shadowsReady) {
                element[1] = await this.callServer('GET',`./${element[0]}.html`, {})
                element[2] = await this.callServer('GET',`./${element[0]}.css`, {})
            }
            refLoading.textContent = 'Loading ' + parseInt(cnt * 100 / keys.length) + '%'
        }
        refLoading.textContent = 'Loading 100%'
        refLogo.style.opacity = 0
        refLoading.style.opacity = 0
        await this.wait(250)

        let refTool = document.createElement('db-tool')
        refBody.appendChild(refTool)
        await this.wait(1)

        appDb.refTablesList.show()
    }

    async callServer (method, url, obj) {
        return new Promise((resolve, reject) => {
            let req = new XMLHttpRequest()
            req.onreadystatechange = (res) => {
                let response = null
                if (req.readyState === 4) {
                    response = req.responseText
                    if (req.status >= 200 && req.status < 300) {
                        return resolve(response)
                    } else {
                        return reject(response)
                    }
                }
            }
            req.open(method, url, true)
            req.send(JSON.stringify(obj))
        })
    }

    async refreshTables () {
        let rst = JSON.parse(await appDb.callServer('POST', '/query', { type: 'dbGetTablesList' }))

        if (rst.status == 'ok') {
            this.tables = rst.result
        } else {
            this.tables = []
        }

        await this.refTablesList.refreshTables()
    }

    async selectTable (ref) {
        if (this.refTableSelected != null) {
            this.refTableSelected.unselect()
        }
        this.refTableSelected = ref
        ref.select()

        this.refTablesList.activateButtons()
        this.refTableSelectedColumns = await this.refTableEdit.selectTable()
    }

    unselectTable (ref) {
        this.refTableSelected = null

        ref.unselect()

        this.refTablesList.deactivateButtons()
        this.refTableEdit.unselectTable()
        this.refTableSelectedColumns = []
    }

    async reloadTable () {
        await this.refTableEdit.reloadTable()
    }

    addTable () {
        let refModal = document.querySelector('db-tool').shadow.querySelector('db-tool-modal-add-table')
        refModal.show()
    }

    renameTable () {
        let name = this.refTableSelected.textContent
        let refModal = document.querySelector('db-tool').shadow.querySelector('db-tool-modal-rename-table')
        refModal.show(name)
    }

    deleteTable () {
        let name = this.refTableSelected.textContent
        let refModal = document.querySelector('db-tool').shadow.querySelector('db-tool-modal-del-table')
        refModal.show(name)
    }

    addColumn () {
        let name = this.refTableSelected.textContent
        let refModal = document.querySelector('db-tool').shadow.querySelector('db-tool-modal-add-column')
        refModal.show(name)
    }

    editColumn (columnName) {
        let name = this.refTableSelected.textContent
        let refModal = document.querySelector('db-tool').shadow.querySelector('db-tool-modal-edit-column')
        refModal.show(name, columnName)
    }

    addRow () {
        let name = this.refTableSelected.textContent
        let refModal = document.querySelector('db-tool').shadow.querySelector('db-tool-modal-add-row')
        refModal.show(name)
    }

    editRow (id) {
        let name = this.refTableSelected.textContent
        let refModal = document.querySelector('db-tool').shadow.querySelector('db-tool-modal-edit-row')
        refModal.show(name, id)
    }

    wait (time) {
        return new Promise((resolve, reject) => {
            setTimeout(() => { resolve() }, time)
        })
    }
    
    waitUntilPropertyValue (ref, property, value) {
        return new Promise(async (resolve, reject) => {
            let style = window.getComputedStyle(ref)
            let now = style.getPropertyValue(property)
    
            if (now === value) {
                resolve()
            } else {
                await promiseWait(1)
                await promiseWaitUntilPropertyValue(ref, property, value)
            }
        }) 
    }
}

let app = null
window.addEventListener('DOMContentLoaded', () => { appDb = new AppDb() })