class DbToolTablesListItem extends HTMLElement {

    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
        this.selected = false
    }

    attributeChangedCallback(name, oldValue, newValue) { }

    async connectedCallback () {

        this.shadow.innerHTML = appDb.shadowElements[this.constructor.name][1]
        this.elmStyle = document.createElement('style')
        this.elmStyle.textContent = appDb.shadowElements[this.constructor.name][2]
        this.shadow.appendChild(this.elmStyle)

        let refRoot = this.shadow.querySelector('.root')
        refRoot.addEventListener('click', async () => {
            if (this.selected) {
                await appDb.unselectTable()
            } else {
                await appDb.selectTable(this)
            }
        })
        refRoot.textContent = this.textContent
    }

    select () {
        let refRoot = this.shadow.querySelector('.root')
        refRoot.classList.add('selected')
        this.selected = true
    }

    unselect () {
        let refRoot = this.shadow.querySelector('.root')
        refRoot.classList.remove('selected')
        this.selected = false
    }
}