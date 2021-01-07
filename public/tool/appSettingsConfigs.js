class SdwConfig extends HTMLElement {

    constructor() {
        super()

        parent = null

        this.shadow = this.attachShadow({ mode: 'open' })

        this.name = ''
        this.value = null
        this.editable = false
        this.onchange = (name, value) => { }
    }

    attributeChangedCallback(name, oldValue, newValue) { }

    connectedCallback() {

        this.elmStyle = document.createElement('style')
        this.elmStyle.textContent = `
        .root {
            align-items: center;
            display: flex;
        }
        .name {
            color: #444;
            font-size: 0.8em;
            padding: 4px 8px;
            text-align: right;
            width: calc(60% - 16px);
        }
        .text {
            font-size: 0.8em;
            text-align: left; 
        }
        .input {
            padding: 4px 8px;
        }
        .input > input {
            font-size: 0.9em;
            width: 75px;
        }
        .notInitial {
            color: rgb(0, 125, 255);
        }`
        this.shadow.appendChild(this.elmStyle)

        this.elmRoot = document.createElement('div')
        this.elmRoot.setAttribute('class', `root`)

        let divName = document.createElement('div')
        divName.setAttribute('name', 'name')
        if (this.value != 'initial' && this.editable) {
            divName.setAttribute('class', 'name notInitial')
        } else {
            divName.setAttribute('class', 'name')
        }
        divName.textContent = this.name
        this.elmRoot.appendChild(divName)

        let divInput = document.createElement('div')
        divInput.setAttribute('class', `input`)
        this.elmRoot.appendChild(divInput)

        if (!this.editable) {
            let divText = document.createElement('div')
            divText.setAttribute('class', 'text')
            divText.innerText = this.value
            divInput.appendChild(divText)
        } else {
            let input = document.createElement('input')
            input.setAttribute('type', 'text')
            input.setAttribute('value', this.value)
            input.addEventListener('change', (evt) => {
                evt.preventDefault()
                let value = this.elmRoot.querySelector('input').value
                if (value == '' || value == 'initial') {
                    value = 'initial'
                    this.elmRoot.querySelector('input').value = value
                    this.elmRoot.querySelector('div[name="name"]').classList.remove('notInitial')
                } else {
                    this.elmRoot.querySelector('div[name="name"]').classList.add('notInitial')
                }
                this.onchange(this.name, value)
            })
            divInput.appendChild(input)
        }

        this.shadow.appendChild(this.elmRoot)
        this.innerHTML = ''
    }

    static getObject (name, value, editable, onchange) {
        let rst = document.createElement('sdw-config')
        rst.name = name
        rst.value = value
        rst.editable = editable
        rst.onchange = onchange
        return rst
    }
}

class SdwConfigSelect extends HTMLElement {

    constructor() {
        super()

        parent = null

        this.shadow = this.attachShadow({ mode: 'open' })

        this.name = ''
        this.value = null
        this.editable = false
        this.options = []
        this.onchange = (name, value) => { }
    }

    attributeChangedCallback(name, oldValue, newValue) { }

    connectedCallback() {

        this.elmStyle = document.createElement('style')
        this.elmStyle.textContent = `
        .root {
            align-items: center;
            display: flex;
        }
        .name {
            color: #444;
            font-size: 0.8em;
            padding: 4px 8px;
            text-align: right;
            width: calc(60% - 16px);
        }
        .text {
            font-size: 0.8em;
            text-align: left; 
        }
        .input {
            padding: 4px 8px;
        }
        .input > select {
            font-size: 0.9em;
            width: 75px;
        }
        .notInitial {
            color: rgb(0, 125, 255);
        }`
        this.shadow.appendChild(this.elmStyle)

        this.elmRoot = document.createElement('div')
        this.elmRoot.setAttribute('class', `root`)

        let divName = document.createElement('div')
        divName.setAttribute('name', 'name')
        if (this.value != 'initial' && this.editable) {
            divName.setAttribute('class', 'name notInitial')
        } else {
            divName.setAttribute('class', 'name')
        }
        divName.textContent = this.name
        this.elmRoot.appendChild(divName)

        let divInput = document.createElement('div')
        divInput.setAttribute('class', `input`)
        this.elmRoot.appendChild(divInput)

        if (!this.editable) {
            let divText = document.createElement('div')
            divText.setAttribute('class', 'text')
            divText.innerText = this.value
            divInput.appendChild(divText)
        } else {
            let select = document.createElement('select')
            select.setAttribute('type', 'text')
            select.setAttribute('value', this.value)
            select.addEventListener('change', (evt) => {
                evt.preventDefault()
                let value = this.elmRoot.querySelector('select').value
                if (value == 'initial') {
                    this.elmRoot.querySelector('div[name="name"]').classList.remove('notInitial')
                } else {
                    this.elmRoot.querySelector('div[name="name"]').classList.add('notInitial')
                }
                this.onchange(this.name, value)
            })
            divInput.appendChild(select)

                for (let cnt = 0; cnt < this.options.length; cnt = cnt + 1) {
                    let option = document.createElement('option')
                    option.setAttribute('value', this.options[cnt])
                    option.textContent = this.options[cnt]
                    if (this.options[cnt] == this.value) {
                        option.setAttribute('selected', 'true')
                    }
                    select.appendChild(option)
                }
        }

        this.shadow.appendChild(this.elmRoot)
        this.innerHTML = ''
    }

    static getObject (name, value, editable, options, onchange) {
        let rst = document.createElement('sdw-config-select')
        rst.name = name
        rst.value = value
        rst.editable = editable
        rst.options = options
        rst.onchange = onchange
        return rst
    }
}

class SdwConfigSelectCustom extends HTMLElement {

    constructor() {
        super()

        parent = null

        this.shadow = this.attachShadow({ mode: 'open' })

        this.name = ''
        this.value = null
        this.editable = false
        this.options = []
        this.onchange = (name, value) => { }
    }

    attributeChangedCallback(name, oldValue, newValue) { }

    connectedCallback() {

        let foundSelected = false

        this.elmStyle = document.createElement('style')
        this.elmStyle.textContent = `
        .root {
            height: 27px;
            overflow: hidden;
            transition: height 0.25s ease;
        }
        .expanded {
            height: 54px;
        }
        .row {
            align-items: center;
            display: flex;
        }
        .name {
            color: #444;
            font-size: 0.8em;
            padding: 4px 8px;
            text-align: right;
            width: calc(60% - 16px);
        }
        .text {
            font-size: 0.8em;
            text-align: left; 
        }
        .input {
            display: flex;
            flex-direction: column;
            padding: 4px 8px;
            width: 75px;
        }
        .input > select {
            font-size: 0.9em;
        }
        .input > input {
            width: 75px;
        }
        .notInitial {
            color: rgb(0, 125, 255);
        }`
        this.shadow.appendChild(this.elmStyle)

        this.elmRoot = document.createElement('div')
        this.elmRoot.setAttribute('class', `root`)

        let row0 = document.createElement('div')
        row0.setAttribute('class', 'row')
        this.elmRoot.appendChild(row0)

        let row1 = document.createElement('div')
        row1.setAttribute('class', 'row')
        this.elmRoot.appendChild(row1)

            let divName0 = document.createElement('div')
            divName0.setAttribute('name', `name`)
            if (this.value != 'initial' && this.editable) {
                divName0.setAttribute('class', 'name notInitial')
            } else {
                divName0.setAttribute('class', 'name')
            }
            divName0.textContent = this.name
            row0.appendChild(divName0)

            let divInput0 = document.createElement('div')
            divInput0.setAttribute('class', `input`)
            row0.appendChild(divInput0)

            if (!this.editable) {
                let divText = document.createElement('div')
                divText.setAttribute('class', 'text')
                divText.innerText = this.value
                divInput0.appendChild(divText)
            } else {
                let select = document.createElement('select')
                select.setAttribute('type', 'text')
                select.setAttribute('value', this.value)
                select.addEventListener('change', (evt) => {
                    evt.preventDefault()
                    let value = this.elmRoot.querySelector('select').value
                    if (value != 'custom') {
                        this.elmRoot.querySelector('input[name="custom"]').value = ''
                        // this.elmRoot.querySelector('input[name="custom"]').setAttribute('disabled', 'true')
                        this.elmRoot.classList.remove('expanded')
                        this.onchange(this.name, value)
                    } else {
                        //this.elmRoot.querySelector('input[name="custom"]').removeAttribute('disabled')
                        this.elmRoot.classList.add('expanded')
                    }
                    if (value == 'initial') {
                        this.elmRoot.querySelector('div[name="name"]').classList.remove('notInitial')
                    } else {
                        this.elmRoot.querySelector('div[name="name"]').classList.add('notInitial')
                    }
                })
                divInput0.appendChild(select)

                    for (let cnt = 0; cnt < this.options.length; cnt = cnt + 1) {
                        let option = document.createElement('option')
                        option.setAttribute('value', this.options[cnt])
                        option.textContent = this.options[cnt]
                        if (this.options[cnt] == this.value) {
                            option.setAttribute('selected', 'true')
                            foundSelected = true
                        }
                        select.appendChild(option)
                    }

            let divName1 = document.createElement('div')
            divName1.setAttribute('class', `name`)
            divName1.textContent = ''
            row1.appendChild(divName1)

            let divInput1 = document.createElement('div')
            divInput1.setAttribute('class', `input`)
            row1.appendChild(divInput1)

                let input = document.createElement('input')
                input.setAttribute('name', 'custom')
                input.setAttribute('type', 'text')
                if (!foundSelected) {
                    input.value = this.value
                    this.elmRoot.querySelectorAll('option')[1].selected = true
                    this.elmRoot.classList.add('expanded')
                }
                input.addEventListener('change', (evt) => {
                    evt.preventDefault()
                    let value = this.elmRoot.querySelector('input').value
                    if (value == '' || value == 'initial') {
                        value = ''
                        this.elmRoot.querySelector('input').value = ''
                        this.elmRoot.querySelectorAll('option')[0].selected = true
                        this.elmRoot.classList.remove('expanded')
                        this.elmRoot.querySelector('div[name="name"]').classList.remove('notInitial')
                    } else {
                        this.onchange(this.name, value)
                        this.elmRoot.querySelector('div[name="name"]').classList.add('notInitial')
                    }
                })
                divInput1.appendChild(input)
            }

        this.shadow.appendChild(this.elmRoot)
        this.innerHTML = ''
    }

    static getObject (name, value, editable, options, onchange) {
        let rst = document.createElement('sdw-config-select-costum')
        rst.name = name
        rst.value = value
        rst.editable = editable
        rst.options = options
        rst.onchange = onchange
        return rst
    }
}