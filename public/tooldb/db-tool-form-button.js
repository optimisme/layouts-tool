class DbToolFormButton extends HTMLElement {

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

        let refButton = this.shadow.querySelector('button')
        refButton.innerHTML = this.textContent

        for (let cnt = 0; cnt < this.attributes.length; cnt = cnt + 1) {
            let attribute = this.attributes[cnt]
            if (attribute.name != 'id' && attribute.name != 'class') {
                refButton.setAttribute(attribute.name, attribute.value)
            }
        }
    }

    setAttribute (name, value) {
        let refButton = this.shadow.querySelector('button')
        refButton.setAttribute(name, value)
    }

    removeAttribute (name) {
        let refButton = this.shadow.querySelector('button')
        refButton.removeAttribute(name)
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