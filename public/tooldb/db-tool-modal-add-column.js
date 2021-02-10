class DbToolModalAddColumn extends DbToolModal {

    constructor() {
        super()
        this.tableName = ''
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

        let refButton = this.shadow.querySelector('db-tool-form-button')
        refButton.addEventListener('click', () => { this.addColumn() })
    }

    async show (tableName) {
        this.tableName = tableName

        await super.show()
    }

    async hide () {
        super.hide()
        this.tableName = ''
    }

    checkForm () {
        let refButton = this.shadow.querySelector('db-tool-form-button')
        let refInput = this.shadow.querySelector('db-tool-form-input-text')
        let valid = refInput.checkValidity()

        if (refInput.value == '') valid = false

        if (valid) {
            refButton.removeAttribute('disabled')
        } else {
            refButton.setAttribute('disabled', 'true')
        }
    }

    async addColumn () {
        let refInput = this.shadow.querySelector('db-tool-form-input-text')
        let refButton = this.shadow.querySelector('.button')
        let refType = this.shadow.querySelector('db-tool-form-select')
        let refWait = this.shadow.querySelector('.wait')
        let refError = this.shadow.querySelector('.msgKo')
        let response = {}

        let obj = {
            loginInId: 'tooldb', 
            type: 'dbAddColumn',
            tableName: this.tableName,
            columnName: refInput.value,
            columnType: refType.value
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
            refType.value = 'TEXT'
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