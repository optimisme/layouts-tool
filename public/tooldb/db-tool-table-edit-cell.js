class DbToolTableEditCell extends HTMLElement {

    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
        this.valueId = ''
        this.valueColumn = ''
    }

    attributeChangedCallback(name, oldValue, newValue) { }

    async connectedCallback () {
        this.shadow.innerHTML = appDb.shadowElements[this.constructor.name][1]
        this.elmStyle = document.createElement('style')
        this.elmStyle.textContent = appDb.shadowElements[this.constructor.name][2]
        this.shadow.appendChild(this.elmStyle)

        let refRoot = this.shadow.querySelector('.root')
        refRoot.textContent = this.textContent
        refRoot.addEventListener('click', () => {
            appDb.editRow(this.valueId)
        })
    }
}