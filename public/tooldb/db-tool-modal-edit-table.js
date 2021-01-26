class DbToolModalEditTable extends DbToolModal {

    constructor() {
        super()
        this.name = ''
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
        refDelButton.addEventListener('click', () => { this.delTable() })

        let refButton = this.shadow.querySelector('db-tool-form-button')
        refButton.addEventListener('click', () => { this.renameTable() })
    }

    async show (name) {
        let refName = this.shadow.querySelector('span[id="name"]')
        refName.textContent = name
        this.name = name

        await super.show()
    }

    async hide () {
        super.hide()
        this.name = ''
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

    async renameTable () {
        let refInput = this.shadow.querySelector('db-tool-form-input-text')
        let refButtons = this.shadow.querySelector('.buttons')
        let refWait = this.shadow.querySelector('.wait')
        let refError = this.shadow.querySelector('.msgKo')
        let response = {}

        let obj = {
            type: 'dbRenameTable',
            oldName: this.name,
            newName: refInput.value
        }

        refButtons.style.display = 'none'
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

        refButtons.style.display = 'flex'
        this.checkForm()
    }

    async delTable () {
        let refButtons = this.shadow.querySelector('.buttons')
        let refWait = this.shadow.querySelector('.wait')
        let refError = this.shadow.querySelector('.msgKo')
        let response = {}

        let obj = {
            type: 'dbDelTable',
            name: this.name
        }

        refButtons.style.display = 'none'
        refWait.style.display = 'flex'
        await appDb.wait(500)

        try {
            response = JSON.parse(await appDb.callServer('POST', '/query', obj))
        } catch (e) {
            console.log(e)
        }

        refWait.style.display = 'none'

        if (response.status == 'ok') {
            this.hide()
            appDb.unselectTable()
        } else {
            refError.style.display = 'flex'
            await appDb.wait(3000)
            refError.style.display = 'none'
        }

        refButtons.style.display = 'flex'
    }
}