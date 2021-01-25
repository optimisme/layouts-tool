class DbToolFormInputText extends HTMLElement {

    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
    }

    attributeChangedCallback(name, oldValue, newValue) { }

    async connectedCallback () {

        this.shadow.innerHTML = appDb.shadowElements[this.constructor.name][1]
        this.elmStyle = document.createElement('style')
        this.elmStyle.textContent = appDb.shadowElements[this.constructor.name][2]
        this.shadow.appendChild(this.elmStyle)

        let refRoot = this.shadow.querySelector('.root')

        let refInput = refRoot.querySelector('input')
        refInput.setAttribute('pattern', this.getAttribute('pattern'))

        let refLabel = refRoot.querySelector('label')
        refLabel.innerHTML = this.textContent
        
        let refSpan = refRoot.querySelector('span')
        refSpan.innerHTML = this.getAttribute('error')
    }

    set value (value) {
        let refRoot = this.shadow.querySelector('.root')
        let refInput = refRoot.querySelector('input')
        refInput.value = value
    }

    get value () {
        let refRoot = this.shadow.querySelector('.root')
        let refInput = refRoot.querySelector('input')
        return refInput.value
    }

    addEventListener (name, action) {
        let refRoot = this.shadow.querySelector('.root')
        let refInput = refRoot.querySelector('input')
        refInput.addEventListener(name, action)
    }

    removeEventListener (name, action) {
        let refRoot = this.shadow.querySelector('.root')
        let refInput = refRoot.querySelector('input')
        refInput.removeEventListener(name, action)
    }

    checkValidity () {
        let refRoot = this.shadow.querySelector('.root')
        let refInput = refRoot.querySelector('input')
        return refInput.checkValidity()
    }
}