class SdwToolPreview extends HTMLElement {

    constructor() {
        super()

        this.shadow = this.attachShadow({ mode: 'open' })
        this.ids = []

        this.visualization = 'desktop'
    }

    attributeChangedCallback(name, oldValue, newValue) { }

    connectedCallback () {

        this.elmStyle = document.createElement('style')
        this.elmStyle.textContent = `
        .root {
            align-items: center;
            background-color: lightgray;
            box-sizing: border-box;
            display: flex;
            height: 100%;
            justify-content: center;
            left: 0;
            overflow-y: auto;
            position: absolute;
            top: 0;
            width: calc(100% - 500px);
        }
        .root > div[name="buttons"] {
            align-items: center;
            display: flex;
            flex-direction: row;
            justify-content: center;
            position: absolute;
            top: 16px;
            width: calc(100% - 64px);
        }
        .root > div[name="buttons"] > div {
            border-radius: 5px;
            color: rgb(0, 125, 255);
            cursor: pointer;
            font-size: 1.5em;
            padding: 4px;
            margin: 0 8px;
        }
        .root > div[name="buttons"] > div:active {
            background-color: rgba(0, 125, 255, 0.2);
        }
        .root > div[name="buttons"] > .buttonSelected {
            background-color: rgba(0, 125, 255, 0.2);
        }
        .disabled {
            color: #888 !important;
            pointer-events: none;
        }
        .grow {
            flex-grow: 1;
            pointer-events: none;
        }
        .root > div[name="content"] {
            background-color: white;
            box-shadow: 0 10px 16px 0 rgba(0,0,0,0.2),0 6px 10px 0 rgba(0,0,0,0.19);
            height: calc(100% - 128px);
            overflow-y: auto;
            position: relative;
            transition: width 0.5s ease;
            width: calc(100% - 64px);
        }
        .root > .contentSizePhone {
            width: 320px !important;
        }
        .root > div[name="content"] > div[name="contentPhone"] {
            display: none;
        }
        .popupAddback {
            background-color: rgba(0, 0, 0, 0.1)
            bottom: 0;
            left: 0;
            position: absolute;
            right: 0;
            top: 0;
        }
        #pexels {
            bottom: 15px;
            color: grey;
            font-size: 0.8em;
            position: absolute;
            text-align: center;
            width: calc(100% - 300px);
        }
        #pexels > a { color: black; }
        #pexels > a:visited { color: black; }
        .selected {
            border: solid 1px rgb(0, 125, 255) !important;
        }
        .carouselDots {
            align-items: center;
            box-sizing: border-box;
            display: flex;
            flex-direction:column;
            margin: 0;
            width: 100%;
        }
        .carouselDots > div:first-child {
            overflow: hidden;
            width: 100%;
        }
        .carouselDots > div:first-child > div {
            display: flex;
            height: 100%;
            transform: translate(0px);
            transition: transform 0.3s ease;
            will-change: transform;
        }
        .carouselDots > div:first-child > div > div {
            background-color: darkgray;
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
            height: 100%;
            min-width: 100%;
        }
        .carouselDots > div:last-child {
            margin-top: 16px;
        }
        .carouselDots > div:last-child > div {
            border: solid 2px lightgrey;
            border-radius: 100%;
            cursor: pointer;
            display: inline-block;
            height: 10px;
            margin: 0 15px 0 15px;
            width: 10px;
        }
        .carouselDots > div:last-child > div:first-child {
            background-color: lightgrey;
        }
        .carouselDotsSelected {
            background-color: lightgrey !important;
        }
        .carouselDotsUnselected {
            background-color: initial !important;
        }
        `
        this.shadow.appendChild(this.elmStyle)

        this.elmRoot = document.createElement('div')
        this.elmRoot.setAttribute('class', `root`)

        let refButtons = document.createElement('div')
        refButtons.setAttribute('name', 'buttons')
        this.elmRoot.appendChild(refButtons)

            let buttonSave = document.createElement('div')
            buttonSave.addEventListener('click', () => {
                app.downloadWebtemplate()
            })
            refButtons.appendChild(buttonSave)
            
                let SaveIcon = document.createElement('ion-icon')
                SaveIcon.setAttribute('name', 'cloud-download-outline')
                buttonSave.appendChild(SaveIcon)

            let buttonLoad = document.createElement('div')
            buttonLoad.addEventListener('click', () => {
                document.getElementById('fileInput').click()
            })
            refButtons.appendChild(buttonLoad)
            
                let LoadIcon = document.createElement('ion-icon')
                LoadIcon.setAttribute('name', 'cloud-upload-outline')
                buttonLoad.appendChild(LoadIcon)

            let buttonCode = document.createElement('div')
            refButtons.appendChild(buttonCode)

                let codeIcon = document.createElement('ion-icon')
                codeIcon.setAttribute('name', 'code-outline')
                buttonCode.appendChild(codeIcon)

            let divGrow = document.createElement('div')
            divGrow.setAttribute('class', 'grow')
            refButtons.appendChild(divGrow)

            let buttonPhone = document.createElement('div')
            buttonPhone.setAttribute('name', 'buttonPhone')
            buttonPhone.addEventListener('click', () => {
                app.setVisualization('phone')
            })
            refButtons.appendChild(buttonPhone)

                let phoneIcon = document.createElement('ion-icon')
                phoneIcon.setAttribute('name', 'phone-portrait-outline')
                buttonPhone.appendChild(phoneIcon)

            let buttonDesktop = document.createElement('div')
            buttonDesktop.setAttribute('name', 'buttonDesktop')
            buttonDesktop.setAttribute('class', 'buttonSelected')
            buttonDesktop.addEventListener('click', () => {
                app.setVisualization('desktop')
            })
            refButtons.appendChild(buttonDesktop)

                let desktopIcon = document.createElement('ion-icon')
                desktopIcon.setAttribute('name', 'desktop-outline')
                buttonDesktop.appendChild(desktopIcon)

        let refContent = document.createElement('div')
        refContent.setAttribute('name', 'content')
        this.elmRoot.appendChild(refContent)

            let refContentDesktop = document.createElement('div')
            refContentDesktop.setAttribute('name', 'contentDesktop')
            refContent.appendChild(refContentDesktop)

            let refContentPhone = document.createElement('div')
            refContentPhone.setAttribute('name', 'contentPhone')
            refContent.appendChild(refContentPhone)

        let refPexels = document.createElement('div')
        refPexels.setAttribute('id', 'pexels')
        refPexels.textContent = 'Images from '
        this.elmRoot.appendChild(refPexels)

            let linkPexels = document.createElement('a')
            linkPexels.setAttribute('href', 'https://www.pexels.com/')
            linkPexels.setAttribute('target', '_blank')
            linkPexels.textContent = 'Pexels.com'
            refPexels.appendChild(linkPexels)

        this.shadow.appendChild(this.elmRoot)
        this.innerHTML = ''

        this.refSelected = null
    }

    childAdd (parent, child) {

        let newItemDesktop = document.createElement(child.tag)
        parent.refPreviewDesktop.appendChild(newItemDesktop)

        let newItemPhone = document.createElement(child.tag)
        parent.refPreviewPhone.appendChild(newItemPhone)

        let styleStr = ''
        let styleStrPhone = ''
        if (child != null) {
            for (let cnt = 0; cnt < child.style.length; cnt = cnt + 1) {
                let propertyName = child.style[cnt][0]
                let propertyValueDesktop = child.style[cnt][1]
                if (child.style[cnt][1] != 'initial') {
                    if (propertyValueDesktop != 'initial') {
                        styleStr = styleStr + propertyName + ':' + child.style[cnt][1] + ';'
                    }
                }
                let phonePropretyPosition = app.getPropertyPosition(child.phone, propertyName)
                if (phonePropretyPosition >= 0) {
                    let propertyValuePhone = child.phone[phonePropretyPosition][1]
                    if (propertyValuePhone != 'initial') {
                       styleStrPhone = styleStrPhone + propertyName + ':' + propertyValuePhone + ';'
                    } else {
                        if (propertyValueDesktop != 'initial') {
                            styleStrPhone = styleStrPhone + propertyName + ':' + propertyValueDesktop + ';'
                        }
                    }
                } else if (propertyValueDesktop != 'initial') {
                    styleStrPhone = styleStrPhone + propertyName + ':' + propertyValueDesktop + ';'
                }
            }
            for (let cnt = 0; cnt < child.attributes.length; cnt = cnt + 1) {
                if (child.attributes[cnt][1] != 'initial') {
                    newItemDesktop.setAttribute(child.attributes[cnt][0], child.attributes[cnt][1])
                    newItemPhone.setAttribute(child.attributes[cnt][0], child.attributes[cnt][1])
                }    
            }
        }
        if (styleStr != '') {
            newItemDesktop.setAttribute('style', styleStr)
        }
        newItemDesktop.innerText = child.text

        if (styleStrPhone != '') {
            newItemPhone.setAttribute('style', styleStrPhone)
        }
        newItemPhone.innerText = child.text
        
        return [newItemDesktop, newItemPhone]
    }

    remove (ref, child) {
        ref.refPreviewDesktop.removeChild(child.refPreviewDesktop)
        ref.refPreviewPhone.removeChild(child.refPreviewPhone)
    }
    
    childSelect (ref) {
        ref.refPreviewDesktop.classList.add('selected')
        ref.refPreviewPhone.classList.add('selected')
    }

    childUnselect (ref) {
        ref.refPreviewDesktop.classList.remove('selected')
        ref.refPreviewPhone.classList.remove('selected')
    }

    setText (ref, value) {
        ref.refPreviewDesktop.innerText = value
        ref.refPreviewPhone.innerText = value
    }

    setDescription (ref, value) {
        ref.refPreviewDesktop.setAttribute('data-desription', value)
        ref.refPreviewPhone.setAttribute('data-desription', value)
    }

    setVisualization (type) {

        if (type == 'phone' && this.visualization == 'desktop') {
            this.elmRoot.querySelector('div[name="content"]').classList.add('contentSizePhone')
            this.elmRoot.querySelector('div[name="contentDesktop"]').style.display = 'none'
            this.elmRoot.querySelector('div[name="contentPhone"]').style.display = 'block'
            this.elmRoot.querySelector('div[name="buttonPhone"]').classList.add('buttonSelected')
            this.elmRoot.querySelector('div[name="buttonDesktop"]').classList.remove('buttonSelected')
        }

        if (type == 'desktop' && this.visualization == 'phone') {
            this.elmRoot.querySelector('div[name="content"]').classList.remove('contentSizePhone')
            this.elmRoot.querySelector('div[name="contentDesktop"]').style.display = 'block'
            this.elmRoot.querySelector('div[name="contentPhone"]').style.display = 'none'
            this.elmRoot.querySelector('div[name="buttonPhone"]').classList.remove('buttonSelected')
            this.elmRoot.querySelector('div[name="buttonDesktop"]').classList.add('buttonSelected')
        }

        this.visualization = type
    }

    rebuild () {
        let refDesktop = this.elmRoot.querySelector('div[name="contentDesktop"]')
        let refPhone = this.elmRoot.querySelector('div[name="contentPhone"]')

        while (refDesktop.childNodes.length > 0) {
            refDesktop.removeChild(refDesktop.childNodes[0])
        }
        while (refPhone.childNodes.length > 0) {
            refPhone.removeChild(refPhone.childNodes[0])
        }

        this.rebuildItem(app.elementsRoot)
    }

    rebuildItem (refApp) {

        for (let cnt = 0; cnt < refApp.childs.length; cnt = cnt + 1) {
            let child = refApp.childs[cnt]
            let references = app.refPreview.childAdd(refApp, child)

            child.refPreviewDesktop = references[0]
            child.refPreviewPhone = references[1]

            if (child.childs.length > 0) {
                this.rebuildItem(child)
            }
        }
    }

    scrollToBottom () {
        let refContent = this.elmRoot.querySelector('div[name="content"]')
        refContent.scrollTop = refContent.scrollHeight
    }
}