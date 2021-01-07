class SdwToolPreview extends HTMLElement {

    constructor() {
        super()

        this.shadow = this.attachShadow({ mode: 'open' })
        this.ids = []

        this.visualization = 'desktop'
    }

    attributeChangedCallback(name, oldValue, newValue) { }

    async connectedCallback () {

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
            user-select: unset;
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
        .root > iframe[name="content"] {
            background-color: white;
            border: none;
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

        let refFrame = document.createElement('iframe')
        refFrame.setAttribute('name', 'content')
        refFrame.setAttribute('scrolling', 'true')
        refFrame.setAttribute('src', '/tool/appPreviewFrame.html');
        this.elmRoot.appendChild(refFrame)

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

        let newItem = document.createElement(child.tag)
        parent.refPreview.appendChild(newItem)

        for (let cnt = 0; cnt < child.attributes.length; cnt = cnt + 1) {
            if (child.attributes[cnt][1] != 'initial') {
                newItem.setAttribute(child.attributes[cnt][0], child.attributes[cnt][1])
            }    
        }

        let classStr = newItem.getAttribute('class')
        if (classStr != null) {
            newItem.setAttribute('class', classStr)
        } else {
            let styleStr = child.getStyleString()
            if (styleStr.length > 0) {
                let newStyle = document.createElement('style')
                newStyle.setAttribute('id', 'css' + child.appId)
                newStyle.innerHTML = child.getStyleString()
                app.refPreviewBody.appendChild(newStyle)
                newItem.setAttribute('class', `css${child.appId}`)
            }
        }

        let newComment = document.createComment(child.description)
        newItem.appendChild(newComment)

        let newText = document.createTextNode(child.text)
        newItem.appendChild(newText)
        
        return newItem
    }

    remove (ref, child) {

        for (let cnt = 0; cnt < child.childs.length; cnt = cnt + 1) {
            app.refPreview.remove(child, child.childs[cnt])
        }

        let classStr = child.refPreview.getAttribute('class')
        if (classStr != null && classStr.indexOf('css') == 0) {
            let classArr = classStr.split(' ')
            classStr = classArr[0]
            app.refPreviewBody.removeChild(app.refPreviewBody.querySelector(`style[id="${classStr}"]`))
        }

        ref.refPreview.removeChild(child.refPreview)
    }
    
    childSelect (ref) {
        ref.refPreview.classList.add('selected')
    }

    childUnselect (ref) {
        ref.refPreview.classList.remove('selected')
    }

    setText (ref, value) {
        ref.refPreview.innerText = value
    }

    setDescription (ref, value) {
        ref.refPreview.setAttribute('data-desription', value)
    }

    setVisualization (type) {

        if (type == 'phone' && this.visualization == 'desktop') {
            this.elmRoot.querySelector('iframe[name="content"]').classList.add('contentSizePhone')
            this.elmRoot.querySelector('div[name="buttonPhone"]').classList.add('buttonSelected')
            this.elmRoot.querySelector('div[name="buttonDesktop"]').classList.remove('buttonSelected')
        }

        if (type == 'desktop' && this.visualization == 'phone') {
            this.elmRoot.querySelector('iframe[name="content"]').classList.remove('contentSizePhone')
            this.elmRoot.querySelector('div[name="buttonPhone"]').classList.remove('buttonSelected')
            this.elmRoot.querySelector('div[name="buttonDesktop"]').classList.add('buttonSelected')
        }

        this.visualization = type
    }

    rebuild () {
        let refPreview = this.elmRoot.querySelector('iframe').contentDocument.body

        while (refPreview.childNodes.length > 0) {
            refPreview.removeChild(refPreview.childNodes[0])
        }

        this.rebuildItem(app.elementsRoot)
    }

    rebuildItem (refApp) {

        for (let cnt = 0; cnt < refApp.childs.length; cnt = cnt + 1) {
            let child = refApp.childs[cnt]
            let references = app.refPreview.childAdd(refApp, child)

            child.refPreview = references

            if (child.childs.length > 0) {
                this.rebuildItem(child)
            }
        }
    }

    scrollToBottom () {
        this.elmRoot.querySelector('iframe').contentWindow.scrollToBottom()
    }
}