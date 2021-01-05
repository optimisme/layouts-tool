class SdwToolPopup extends HTMLElement {

    constructor() {
        super()

        parent = null

        this.list = this.getAttribute('list')
        this.shadow = this.attachShadow({ mode: 'open' })
    }

    attributeChangedCallback(name, oldValue, newValue) { }

    connectedCallback () {
        
        this.elmStyle = document.createElement('style')
        this.elmStyle.textContent = `
        .root {
            /* background-color: rgba(0, 0, 0, 0.1); */
            display: none;
            height: 100%;
            left: 0;
            position: absolute;
            top: 0px;
            width: 100%;
        }
        .popup {
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 10px 16px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            overflow: auto;
            padding: 8px 16px;
            height: 400px;
            position: absolute;
            width: 400px;
        }
        .popupPointer {
            background-color: white;
            top: 0;
            height: 10px;
            position: absolute;
            transform: rotateZ(45deg);
            width: 10px;
        }
        .item {
            align-items: center;
            display: flex;
            cursor: pointer;
            font-size: 0.9em;
            height: 50px;
        }
        .item > img {
            border: solid 1px lightgrey;
            margin-right: 8px;
        }`
        this.shadow.appendChild(this.elmStyle)

        this.elmRoot = document.createElement('div')
        this.elmRoot.setAttribute('class', `root`)
        this.elmRoot.addEventListener('click', (evt) => {
            evt.stopPropagation()
            this.hidePopup()
        })

            if (this.list == 'types') {
                this.getTypes()
            } else {
                this.getTemplates()
            }

            let divPopupPointer = document.createElement('div')
            divPopupPointer.setAttribute('name', 'popupPointer')
            divPopupPointer.setAttribute('class', `popupPointer`)
            this.elmRoot.appendChild(divPopupPointer)

        this.shadow.appendChild(this.elmRoot)
        this.innerHTML = ''
    }

    showPopup (ref) {
        let style = this.elmRoot.querySelector('div[name="popup"]').style
        let stylePointer = this.elmRoot.querySelector('div[name="popupPointer"]').style
        let rect = ref.getBoundingClientRect()
        let left = rect.x + (rect.width /2) - 200
        let top = rect.y - 400 // + rect.height

        this.elmRoot.style.display = 'block'
        style.top = top + 'px'
        style.left = left + 'px'
        stylePointer.top = (rect.y - 5) + 'px'
        stylePointer.left = (left + 195) + 'px'
    }

    hidePopup () {
        let style = this.elmRoot.querySelector('div[name="popup"]').style
        let stylePointer = this.elmRoot.querySelector('div[name="popupPointer"]').style
        
        this.elmRoot.style.display = 'none'
        style.top = '-10px'
        style.left = '0'
        stylePointer.top = '-10px'
        stylePointer.left = '0'
    }

    getTypes () {

        let divPopup = document.createElement('div')
        divPopup.setAttribute('name', 'popup')
        divPopup.setAttribute('class', `popup`)
        this.elmRoot.appendChild(divPopup)

        for (let cnt = 0; cnt < appTypeNames.length; cnt = cnt + 1) {
            let divItem = document.createElement('div')
            let obj = app.getNamedObject(appTypeNames[cnt])
            divItem.setAttribute('class', `item`)
            divItem.addEventListener('click', (evt) => {
                evt.stopPropagation()
                app.add(obj.typeName)
                this.hidePopup()
            })
            divPopup.appendChild(divItem)

            let divItemImage = document.createElement('img')
            divItemImage.setAttribute('src', `./imagesTool/${obj.image}`)
            divItemImage.setAttribute('width', `75`)
            divItem.appendChild(divItemImage)

            let divItemText = document.createElement('div')
            divItemText.setAttribute('width', `100`)
            divItemText.innerText = obj.description
            divItem.appendChild(divItemText)
        }
    }

    getTemplates () {

        let divPopup = document.createElement('div')
        divPopup.setAttribute('name', 'popup')
        divPopup.setAttribute('class', `popup`)
        this.elmRoot.appendChild(divPopup)

        for (let cnt = 0; cnt < appTemplateNames.length; cnt = cnt + 1) {
            let divItem = document.createElement('div')
            let obj = app.getNamedObject(appTemplateNames[cnt])
            divItem.setAttribute('class', `item`)
            divItem.addEventListener('click', (evt) => {
                evt.stopPropagation()
                app.addTemplate(obj.typeName)
                this.hidePopup()
            })
            divPopup.appendChild(divItem)

            let divItemImage = document.createElement('img')
            divItemImage.setAttribute('src', `./imagesTool/${obj.image}`)
            divItemImage.setAttribute('width', `75`)
            divItem.appendChild(divItemImage)

            let divItemText = document.createElement('div')
            divItemText.setAttribute('width', `100`)
            divItemText.innerText = obj.description
            divItem.appendChild(divItemText)
        }
    }
}