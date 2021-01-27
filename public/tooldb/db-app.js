class AppDb {

    constructor () {
        this.handler = this.init.bind(this)
        window.addEventListener('load', this.handler)

        this.tables = []
        this.refTablesList = null
        this.refTableEdit = null
        this.refTableSelected = null
        this.refTableSelectedColumns = []
        this.refTableSelectedRows = []

        this.shadowElements = {
            DbTool:                     ['db-tool',                     '', ''],
            DbToolFormButton:           ['db-tool-form-button',         '', ''],
            DbToolFormInputText:        ['db-tool-form-input-text',     '', ''],
            DbToolFormSelect:           ['db-tool-form-select',         '', ''],
            DbToolFormSpinner:          ['db-tool-form-spinner',        '', ''],
            DbToolModal:                ['db-tool-modal',               '', ''],
            DbToolModalAddColumn:       ['db-tool-modal-add-column',    '', ''],
            DbToolModalAddRow:          ['db-tool-modal-add-row',       '', ''],
            DbToolModalAddTable:        ['db-tool-modal-add-table',     '', ''],
            DbToolModalEditTable:       ['db-tool-modal-edit-table',    '', ''],
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

        for (let cnt = 0; cnt < keys.length; cnt = cnt + 1) {
            let key = keys[cnt]
            let element = this.shadowElements[key]
            if (!scriptsReady) {
                let script = (await this.callServer('GET',`./${element[0]}.js`, {}))
                eval(`${script}; window.${key} = ${key}`)
                element[1] = await this.callServer('GET',`./${element[0]}.html`, {})
                element[2] = await this.callServer('GET',`./${element[0]}.css`, {})
            }
            eval(`customElements.define("${element[0]}", ${key})`)
            refLoading.textContent = 'Loading ' + parseInt(cnt * 100 / keys.length) + '%'
            await this.wait(1)
        }

        refLoading.textContent = 'Loading 100%'
        await this.wait(250)
        refLogo.style.opacity = 0
        refLoading.style.opacity = 0

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

    async refresh () {
        let rst = JSON.parse(await appDb.callServer('POST', '/query', { type: 'dbGetTablesList' }))

        if (rst.status == 'ok') {
            this.tables = rst.result
        } else {
            this.tables = []
        }

        await this.refTablesList.refresh()

        if (this.refTableSelected != null) {
            await this.refTableEdit.refresh()
            await this.refTablesList.refresh()
        }
    }

    async selectTable (ref) {
        if (this.refTableSelected != null) {
            this.refTableSelected.unselect()
        }
        this.refTableSelected = ref
        ref.select()

        this.refTablesList.activateButtons()
        await this.refTableEdit.selectTable()
    }

    unselectTable () {

        this.refTableSelected.unselect()
        this.refTableSelected = null

        this.refTablesList.deactivateButtons()
        this.refTableEdit.unselectTable()
        this.refTableSelectedColumns = []
        this.refTableSelectedRows = []
    }

    async addTable () {
        let refModal = document.querySelector('db-tool').shadow.querySelector('db-tool-modal-add-table')
        await refModal.show()
    }

    async editTable () {
        let name = this.refTableSelected.textContent
        let refModal = document.querySelector('db-tool').shadow.querySelector('db-tool-modal-edit-table')

        await refModal.show(name)
    }

    async addColumn () {
        let name = this.refTableSelected.textContent
        let refModal = document.querySelector('db-tool').shadow.querySelector('db-tool-modal-add-column')
        await refModal.show(name)
    }

    async editColumn (columnName) {
        let name = this.refTableSelected.textContent
        let refModal = document.querySelector('db-tool').shadow.querySelector('db-tool-modal-edit-column')
        await refModal.show(name, columnName)
    }

    async addRow () {
        let name = this.refTableSelected.textContent
        let refModal = document.querySelector('db-tool').shadow.querySelector('db-tool-modal-add-row')
        await refModal.show(name)
    }

    async editRow (id) {
        let name = this.refTableSelected.textContent
        let refModal = document.querySelector('db-tool').shadow.querySelector('db-tool-modal-edit-row')
        await refModal.show(name, id)
    }

    wait (time) {
        return new Promise((resolve, reject) => {
            setTimeout(() => { resolve() }, time)
        })
    }
    
    async waitUntilPropertyValue (ref, property, value) {
        let style = window.getComputedStyle(ref)
        let now = style.getPropertyValue(property)
        if (now != value) {
            await this.wait(1)
            await this.waitUntilPropertyValue(ref, property, value)
        }
    }
}

let app = null
window.addEventListener('DOMContentLoaded', () => { appDb = new AppDb() })
