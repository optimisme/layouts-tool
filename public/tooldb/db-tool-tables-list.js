class DbToolTablesList extends HTMLElement {

    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
    }

    attributeChangedCallback(name, oldValue, newValue) { }

    async connectedCallback () {

        appDb.refTablesList = this

        this.shadow.innerHTML = appDb.shadowElements[this.constructor.name][1]
        this.elmStyle = document.createElement('style')
        this.elmStyle.textContent = appDb.shadowElements[this.constructor.name][2]
        this.shadow.appendChild(this.elmStyle)

        let refAdd = this.shadow.querySelector('div[data-name="buttonAdd"]')
        refAdd.addEventListener('click', async () => {
            await appDb.addTable()
            await appDb.refresh()
        })

        let refRefresh = this.shadow.querySelector('div[data-name="buttonRefresh"]')
        refRefresh.addEventListener('click', async () => {
            await appDb.refresh()
        })

        let refEdit = this.shadow.querySelector('div[data-name="buttonEdit"]')
        refEdit.addEventListener('click', async () => {
            await appDb.editTable()
            await appDb.refresh()
        })

        await appDb.refresh()
    }

    async refresh () {
        let refList = this.shadow.querySelector('.list')
        let selectedName = ''

        if (appDb.refTableSelected != null) {
            selectedName = appDb.refTableSelected.textContent
        }

        while (refList.firstChild) { refList.removeChild(refList.lastChild) }
        for (let cnt = 0; cnt < appDb.tables.length; cnt = cnt + 1) {
            let tmp = document.createElement('db-tool-tables-list-item')
            let name = appDb.tables[cnt].name
            tmp.textContent = name
            refList.appendChild(tmp)
            if (name == selectedName) { tmp.select() }
        }
    }

    activateButtons () {
        let refEdit = this.shadow.querySelector('div[data-name="buttonEdit"]')
        refEdit.classList.remove('disabled')
    }

    deactivateButtons () {
        let refEdit = this.shadow.querySelector('div[data-name="buttonEdit"]')
        refEdit.classList.add('disabled')
    }

    show () {
        let refRoot = this.shadow.querySelector('.root')
        refRoot.style.transform = 'translate3d(0, 0 ,0)'
    }
}