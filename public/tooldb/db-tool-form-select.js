class DbToolFormSelect extends HTMLElement {

    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
    }

    static get observedAttributes() { return ['required']; }
    attributeChangedCallback(name, oldValue, newValue) { 
        let refRoot = this.shadow.querySelector('.root')
        if (refRoot) {
            let refSelect = refRoot.querySelector('select')
            refSelect.setAttribute(name, newValue)
        }
    }

    set value (value) {
        let refRoot = this.shadow.querySelector('.root')
        let refSelect = refRoot.querySelector('select')
        refSelect.value = value
    }

    get value () {
        let refRoot = this.shadow.querySelector('.root')
        let refSelect = refRoot.querySelector('select')
        return refSelect.value
    }

    async connectedCallback () {

        this.shadow.innerHTML = appDb.shadowElements[this.constructor.name][1]
        this.elmStyle = document.createElement('style')
        this.elmStyle.textContent = appDb.shadowElements[this.constructor.name][2]
        this.shadow.appendChild(this.elmStyle)

        let refRoot = this.shadow.querySelector('.root')
        let refSelect = refRoot.querySelector('select')
        refSelect.innerHTML = this.innerHTML

        if (this.getAttribute('required') && this.getAttribute('required') != 'null') {
            refSelect.setAttribute('required', this.getAttribute('required'))
        }
    }

    addEventListener (name, action) {
        let refButton = this.shadow.querySelector('button')
        refButton.addEventListener(name, action)
    }

    removeEventListener (name, action) {
        let refButton = this.shadow.querySelector('button')
        refButton.removeEventListener(name, action)
    }
}