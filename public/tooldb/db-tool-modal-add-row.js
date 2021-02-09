class DbToolModalAddRow extends DbToolModal {

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

        let refButton = this.shadow.querySelector('db-tool-form-button')
        refButton.addEventListener('click', () => { this.addColumn() })
    }

    async show (tableName) {
        let refInputs = this.shadow.querySelector('.inputs')

        this.tableName = tableName

        while (refInputs.firstChild) { refInputs.removeChild(refInputs.lastChild) }
        for (let cnt = 0; cnt < appDb.refTableSelectedColumns.length; cnt = cnt + 1) {
            let column = appDb.refTableSelectedColumns[cnt]
            if (column.name != 'id') {
                let input = document.createElement('db-tool-form-input-text')
                refInputs.appendChild(input)
                input.setAttribute('id', column.name + 'Form')
                input.addEventListener('keyup', () => { this.checkForm() })
                input.label = column.name
                if (column.type == 'INTEGER') {
                    input.setAttribute('pattern', '[0-9]+')
                    input.hint = 'Only INTEGER numbers allowed'
                }
                if (column.type == 'REAL' || input.type == 'NUMERIC') {
                    input.setAttribute('pattern', '[0-9]+([\.][0-9]+)?')
                    input.hint = 'Only REAL numbers allowed (0.0)'
                }
                if (column['dflt_value']) input.value = column['dflt_value']
            }
        }

        await super.show()
    }

    async hide () {
        super.hide()
        this.tableName = ''
    }

    checkForm () {
        let refButton = this.shadow.querySelector('db-tool-form-button')
        let refInputs = this.shadow.querySelector('.inputs')
        let valid = true

        for (let cnt = 0; cnt < appDb.refTableSelectedColumns.length; cnt = cnt + 1) {
            let column = appDb.refTableSelectedColumns[cnt]
            if (column.name != 'id') {
                let input = refInputs.querySelector('#' + column.name + 'Form')
                valid = input.checkValidity()
                if (column.notnull == 1 && input.value == '') valid = false
                if (!valid) break
            }
        }

        if (valid) {
            refButton.removeAttribute('disabled')
        } else {
            refButton.setAttribute('disabled', 'true')
        }
    }

    async addColumn () {
        let refInputs = this.shadow.querySelector('.inputs')
        let refButton = this.shadow.querySelector('.button')
        let refWait = this.shadow.querySelector('.wait')
        let refError = this.shadow.querySelector('.msgKo')
        let response = {}

        let obj = {
            type: 'dbAddRow',
            tableName: this.tableName,
            columns: {}
        }
        for (let cnt = 0; cnt < appDb.refTableSelectedColumns.length; cnt = cnt + 1) {
            let column = appDb.refTableSelectedColumns[cnt]
            if (column.name != 'id') {
                let input = refInputs.querySelector('#' + column.name + 'Form')
                obj.columns[column.name] = input.value
            }
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
            for (let cnt = 0; cnt < appDb.refTableSelectedColumns.length; cnt = cnt + 1) {
                let column = appDb.refTableSelectedColumns[cnt]
                if (column.name != 'id') {
                    let input = refInputs.querySelector('#' + column.name + 'Form')
                    input.value = ''
                }
            }
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