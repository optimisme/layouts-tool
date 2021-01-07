class SdwToolList extends HTMLElement {

    constructor() {
        super()

        this.shadow = this.attachShadow({ mode: 'open' })
    }

    attributeChangedCallback(name, oldValue, newValue) { }

    connectedCallback () {

        this.elmStyle = document.createElement('style')
        this.elmStyle.textContent = `
        .root {
            background-color: #fafafa;
            border-left: solid 1px gray;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            height: 100%;
            position: absolute;
            right: 250px;
            top: 0;
            width: 250px;
        }
        .list {
            overflow: auto;
            height: calc(100% - 32px);
        }
        .buttons {
            align-items: center;
            border-top: solid 1px lightgrey;
            box-sizing: border-box;
            color: rgb(0, 125, 255);
            display: flex;
            font-size: 1.5em;
            height: 32px;
            justify-content: space-around;
        }
        .button {
            cursor: pointer;
        }
        .button:active {
            background-color: rgba(0, 125, 255, 0.2);
        }
        .disabled {
            color: #888 !important;
            pointer-events: none;
        }`
        this.shadow.appendChild(this.elmStyle)

        this.elmRoot = document.createElement('div')
        this.elmRoot.setAttribute('class', `root`)
        
            let list = document.createElement('div')
            list.setAttribute('name', 'list')
            list.setAttribute('class', 'list')
            this.elmRoot.appendChild(list)

                let rootChild = document.createElement('sdw-tool-list-item')
                list.appendChild(rootChild)
        
            this.elmRoot.appendChild(this.getButtonsRow())

        this.shadow.appendChild(this.elmRoot)

        this.innerHTML = ''
    }

    getButtonsRow () {

        let buttons = document.createElement('div')
        buttons.setAttribute('class', 'buttons')

            let buttonAdd = document.createElement('div')
            buttonAdd.setAttribute('name', 'buttonAdd')
            buttonAdd.setAttribute('class', 'button disabled')
            buttonAdd.addEventListener('click', (evt) => {
                evt.stopPropagation()
                if (app.refSelected.childsAllowed == 'all') {
                    document.getElementById('popupadd').showPopup(this.elmRoot.querySelector('div[name="buttonAdd"]'))
                } else if (app.refSelected.childsAllowed != 'none') {
                    app.add(app.refSelected.childsAllowed)
                }
            })
            buttons.appendChild(buttonAdd)

                let addIcon = document.createElement('ion-icon')
                addIcon.setAttribute('name', 'add-circle-outline')
                buttonAdd.appendChild(addIcon)

            let buttonDuplicate = document.createElement('div')
            buttonDuplicate.setAttribute('name', 'buttonDuplicate')
            buttonDuplicate.setAttribute('class', 'button disabled')
            buttonDuplicate.addEventListener('click', (evt) => {
                evt.stopPropagation()
                app.duplicate()
            })
            buttons.appendChild(buttonDuplicate)

                let duplicateIcon = document.createElement('ion-icon')
                duplicateIcon.setAttribute('name', 'duplicate-outline')
                buttonDuplicate.appendChild(duplicateIcon)

            let buttonTempaltes = document.createElement('div')
            buttonTempaltes.setAttribute('name', 'buttonTemplates')
            buttonTempaltes.setAttribute('class', 'button disabled')
            buttonTempaltes.addEventListener('click', (evt) => {
                evt.stopPropagation()
                document.getElementById('popuptemplates').showPopup(this.elmRoot.querySelector('div[name="buttonTemplates"]'))
            })
            buttons.appendChild(buttonTempaltes)
    
                    let templatesIcon = document.createElement('ion-icon')
                    templatesIcon.setAttribute('name', 'color-wand-outline')
                    buttonTempaltes.appendChild(templatesIcon)

            let buttonUp = document.createElement('div')
            buttonUp.setAttribute('name', 'buttonUp')
            buttonUp.setAttribute('class', 'button disabled')
            buttonUp.addEventListener('click', (evt) => {
                evt.stopPropagation()
                app.moveUp()
            })
            buttons.appendChild(buttonUp)
    
                    let upIcon = document.createElement('ion-icon')
                    upIcon.setAttribute('name', 'arrow-up-outline')
                    buttonUp.appendChild(upIcon)

            let buttonDown = document.createElement('div')
            buttonDown.setAttribute('name', 'buttonDown')
            buttonDown.setAttribute('class', 'button disabled')
            buttonDown.addEventListener('click', (evt) => {
                evt.stopPropagation()
                app.moveDown()
            })
            buttons.appendChild(buttonDown)
            
                    let DownIcon = document.createElement('ion-icon')
                    DownIcon.setAttribute('name', 'arrow-down-outline')
                    buttonDown.appendChild(DownIcon)

            let buttonDelete = document.createElement('div')
            buttonDelete.setAttribute('name', 'buttonDelete')
            buttonDelete.setAttribute('class', 'button disabled')
            buttonDelete.addEventListener('click', (evt) => {
                evt.stopPropagation()
                app.remove()
            })
            buttons.appendChild(buttonDelete)

                let deleteIcon = document.createElement('ion-icon')
                deleteIcon.setAttribute('name', 'trash-outline')
                buttonDelete.appendChild(deleteIcon)

        return buttons
    }

    setButtonAdd (activate) {
        
        if (activate) {
            this.elmRoot.querySelector('div[name="buttonAdd"]').classList.remove('disabled')
        } else {
            this.elmRoot.querySelector('div[name="buttonAdd"]').classList.add('disabled')
        }
    }

    setButtonDuplicate (activate) {

        if (activate) {
            this.elmRoot.querySelector('div[name="buttonDuplicate"]').classList.remove('disabled')
        } else {
            this.elmRoot.querySelector('div[name="buttonDuplicate"]').classList.add('disabled')
        }
    }

    setButtonTemplates (activate) {

        if (activate) {
            this.elmRoot.querySelector('div[name="buttonTemplates"]').classList.remove('disabled')
        } else {
            this.elmRoot.querySelector('div[name="buttonTemplates"]').classList.add('disabled')
        }
    }

    setButtonUp (activate) {

        if (activate) {
            this.elmRoot.querySelector('div[name="buttonUp"]').classList.remove('disabled')
        } else {
            this.elmRoot.querySelector('div[name="buttonUp"]').classList.add('disabled')
        }
    }

    setButtonDown (activate) {

        if (activate) {
            this.elmRoot.querySelector('div[name="buttonDown"]').classList.remove('disabled')
        } else {
            this.elmRoot.querySelector('div[name="buttonDown"]').classList.add('disabled')
        }
    }

    setButtonDelete (activate) {
        
        if (activate) {
            this.elmRoot.querySelector('div[name="buttonDelete"]').classList.remove('disabled')
        } else {
            this.elmRoot.querySelector('div[name="buttonDelete"]').classList.add('disabled')
        }
    }

    rebuild () {
        let childs = this.elmRoot.querySelector('sdw-tool-list-item').shadow.querySelector('div[name="childs"]')

        while (childs.childNodes.length > 0) {
            childs.removeChild(childs.childNodes[0])
        }

        this.rebuildItem(app.elementsRoot)
    }

    rebuildItem (refApp) {

        for (let cnt = 0; cnt < refApp.childs.length; cnt = cnt + 1) {
            let child = refApp.childs[cnt]
            child.refList = null
        }

        for (let cnt = 0; cnt < refApp.childs.length; cnt = cnt + 1) {
            let child = refApp.childs[cnt]
            child.refList = refApp.refList.add(child)
            if (child.childs.length > 0) {
                this.rebuildItem(child)
            }
        }
    }
}

