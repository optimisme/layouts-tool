class DbToolModalEditColumn extends DbToolModal {

    constructor() {
        super()
        this.tableName = ''
        this.columnName = ''
    }

    async connectedCallback () {
        await super.connectedCallback()
        let refContent = this.shadow.querySelector('.content')
        refContent.innerHTML = appDb.shadowElements[this.constructor.name][1]
        this.elmStyle = document.createElement('style')
        this.elmStyle.textContent = appDb.shadowElements[this.constructor.name][2]
        this.shadow.appendChild(this.elmStyle)

        let refInput = this.shadow.querySelector('db-tool-form-input-text')
        refInput.addEventListener('keyup', () => { this.checkForm() })

        let refDelButton = this.shadow.querySelector('#deleteButton')
        refDelButton.addEventListener('click', async () => {
            await this.deleteColumn() 
        })

        let refRenameButton = this.shadow.querySelector('#renameButton')
        refRenameButton.addEventListener('click', async () => { 
            await this.renameColumn() 
        })
    }

    async show (tableName, columnName) {
        this.tableName = tableName
        this.columnName = columnName

        let refName = this.shadow.querySelector('span[id="name"]')
        refName.textContent = columnName

        await super.show()
    }

    async hide () {
        super.hide()
        this.tableName = ''
    }

    checkForm () {
        let refButton = this.shadow.querySelector('#renameButton')
        let refInput = this.shadow.querySelector('db-tool-form-input-text')
        let valid = refInput.checkValidity()

        if (refInput.value == '') valid = false

        if (valid) {
            refButton.removeAttribute('disabled')
        } else {
            refButton.setAttribute('disabled', 'true')
        }
    }

    async renameColumn () {
        let refInput = this.shadow.querySelector('db-tool-form-input-text')
        let refButton = this.shadow.querySelector('.buttons')
        let refWait = this.shadow.querySelector('.wait')
        let refError = this.shadow.querySelector('.msgKo')
        let response = {}

        let obj = {
            loginInId: 'tooldb', 
            type: 'dbRenameColumn',
            tableName: this.tableName,
            oldColumnName: this.columnName,
            newColumnName: refInput.value
        }

        refButton.style.display = 'none'
        refWait.style.display = 'flex'
        await appDb.wait(500)

        try {
            response = JSON.parse(await appDb.callServer('POST', '/query', obj))
        } catch (e) {
            console.log(e)
        }

        refWait.style.display = 'none'

        if (response.status == 'ok') {
            refInput.value = ''
            this.hide()
        } else {
            refError.style.display = 'flex'
            await appDb.wait(3000)
            refError.style.display = 'none'
        }

        refButton.style.display = 'flex'
        this.checkForm()
    }

    async deleteColumn () {
        let refInput = this.shadow.querySelector('db-tool-form-input-text')
        let refButton = this.shadow.querySelector('.buttons')
        let refWait = this.shadow.querySelector('.wait')
        let refError = this.shadow.querySelector('.msgKo')
        let response = {}

        let obj = {
            loginInId: 'tooldb', 
            type: 'dbDelColumn',
            tableName: this.tableName,
            columnName: this.columnName,
        }

        refButton.style.display = 'none'
        refWait.style.display = 'flex'
        await appDb.wait(500)

        try {
            response = JSON.parse(await appDb.callServer('POST', '/query', obj))
        } catch (e) {
            console.log(e)
        }

        refWait.style.display = 'none'

        if (response.status == 'ok') {
            refInput.value = ''
            this.hide()
        } else {
            refError.style.display = 'flex'
            await appDb.wait(3000)
            refError.style.display = 'none'
        }

        refButton.style.display = 'flex'
        this.checkForm()
    }
}