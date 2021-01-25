class DbToolModalDelTable extends DbToolModal {

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

        let refButton = this.shadow.querySelector('db-tool-form-button')
        refButton.addEventListener('click', () => { this.delTable() })
    }

    async show (name) {
        super.show()

        let refName = this.shadow.querySelector('span[id="name"]')
        refName.textContent = name
        this.name = name
    }

    async hide () {
        super.hide()
        this.name = ''
    }

    async delTable () {
        let refButton = this.shadow.querySelector('.button')
        let refWait = this.shadow.querySelector('.wait')
        let refError = this.shadow.querySelector('.msgKo')
        let response = {}

        let obj = {
            type: 'dbDelTable',
            name: this.name
        }

        refButton.style.display = 'none'
        refWait.style.display = 'flex'
        await appDb.wait(500)

        try {
            response = JSON.parse(await appDb.callServer('POST', '/query', obj))
        } catch (e) {
            console.log(e)
        }
        await appDb.refreshTables()

        refWait.style.display = 'none'

        if (response.status == 'ok') {
            this.hide()
        } else {
            refError.style.display = 'flex'
            await appDb.wait(3000)
            refError.style.display = 'none'
        }

        refButton.style.display = 'flex'
    }
}