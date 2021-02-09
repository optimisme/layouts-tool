class DbToolModal extends HTMLElement {

    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
        this.mouseDownOnBackground = false
        this.showing = false
    }

    attributeChangedCallback(name, oldValue, newValue) { }

    async connectedCallback () {

        let className = Object.getPrototypeOf(this.constructor).name // Can't use "this.constructor.name" because this will be extended

        this.shadow.innerHTML = appDb.shadowElements[className][1]
        this.elmStyle = document.createElement('style')
        this.elmStyle.textContent = appDb.shadowElements[className][2]
        this.shadow.appendChild(this.elmStyle)

        let refRoot = this.shadow.querySelector('.root')
        refRoot.addEventListener('mousedown', (event) => {
            if (event.target.getAttribute('class') == 'root') {
                this.mouseDownOnBackground = true
            }
        })
        refRoot.addEventListener('mouseup', (event) => {
            if (event.target.getAttribute('class') == 'root' && this.mouseDownOnBackground) {
                this.hide()
            }
            this.mouseDownOnBackground = false
        })
    }

    async show () {
        let refBody = document.getElementsByTagName('body')[0]
        let refRoot = this.shadow.querySelector('.root')

        refBody.style.overflow = 'hidden'
        refRoot.style.display = 'flex'
        await appDb.waitUntilPropertyValue(refRoot, 'display', 'flex')  
        refRoot.style.opacity = '1'
        refRoot.querySelector('.content').style.transform = 'translateY(0)'
        await appDb.wait(300)

        this.showing = true
        while (this.showing) {await appDb.wait(50) }
    }

    async hide () {
        let refBody = document.getElementsByTagName('body')[0]
        let refRoot = this.shadow.querySelector('.root')
        
        refRoot.style.opacity = '0'
        refRoot.querySelector('.content').style.transform = 'translateY(-100vh)'
        await appDb.wait(300)
        refBody.style.overflow = 'initial'
        refRoot.style.display = 'none'

        this.showing = false
    }
}