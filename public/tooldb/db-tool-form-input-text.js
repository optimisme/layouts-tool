class DbToolFormInputText extends HTMLElement {

    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
    }

    static get observedAttributes() { return ['pattern']; }
    attributeChangedCallback(name, oldValue, newValue) { 
        let refRoot = this.shadow.querySelector('.root')
        if (refRoot) {
            let refInput = refRoot.querySelector('input')
            refInput.setAttribute(name, newValue)
        }
    }

    async connectedCallback () {

        this.shadow.innerHTML = appDb.shadowElements[this.constructor.name][1]
        this.elmStyle = document.createElement('style')
        this.elmStyle.textContent = appDb.shadowElements[this.constructor.name][2]
        this.shadow.appendChild(this.elmStyle)

        let refRoot = this.shadow.querySelector('.root')

        let refInput = refRoot.querySelector('input')
        if (this.getAttribute('pattern') && this.getAttribute('pattern') != 'null') {
            refInput.setAttribute('pattern', this.getAttribute('pattern'))
        }

        let refLabel = refRoot.querySelector('label')
        refLabel.innerHTML = this.textContent
        refLabel.addEventListener('click', () => {
            refInput.focus()
        })
        
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

    set label (value) {
        let refRoot = this.shadow.querySelector('.root')
        let refLabel = refRoot.querySelector('label')
        refLabel.textContent = value
    }

    set hint (value) {
        let refRoot = this.shadow.querySelector('.root')
        let refSpan = refRoot.querySelector('span')
        refSpan.textContent = value
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
        if (refInput.getAttribute('pattern') && refInput.getAttribute('pattern') != 'null') {
            return refInput.checkValidity()
        } else {
            return true
        }
    }
}