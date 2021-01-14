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
        .root > div[name="buttons"] > div[name="buttonPhone"] {
            margin: 0 4px;
        }
        .root > div[name="buttons"] > div[name="buttonTablet"] {
            margin: 0;
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
        .root > .contentSizeTablet {
            width: 769px !important;
        }
        .root > .contentSizeDesktop {
            width: calc(100% - 64px) !important;
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
        .buttonDrag {
            border: dashed 2px rgb(0, 150, 255)
        }
        .dragOver {
            background-color: darkgrey;
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
            buttonLoad.setAttribute('name', 'buttonLoad')
            buttonLoad.setAttribute('class', 'buttonDrag')
            buttonLoad.addEventListener('click', () => {
                document.getElementById('fileInput').click()
            })
            buttonLoad.addEventListener('dragover', (e) => {
                e.preventDefault()
                e.stopPropagation()
                this.elmRoot.querySelector(`div[name="buttonLoad"]`).classList.add('dragOver')
            })
            buttonLoad.addEventListener('dragleave', (e) => {
                e.preventDefault()
                e.stopPropagation()
                this.elmRoot.querySelector(`div[name="buttonLoad"]`).classList.remove('dragOver')
            })
            buttonLoad.addEventListener('drop', (e) => {
                e.preventDefault()
                e.stopPropagation()
                this.elmRoot.querySelector(`div[name="buttonLoad"]`).classList.remove('dragOver')
                if(e.dataTransfer.files[0]) {
                    app.uploadWebtemplate(e.dataTransfer.files[0])
                }
            })
            refButtons.appendChild(buttonLoad)
            
                let LoadIcon = document.createElement('ion-icon')
                LoadIcon.setAttribute('name', 'cloud-upload-outline')
                buttonLoad.appendChild(LoadIcon)

            let buttonCode = document.createElement('div')
            buttonCode.addEventListener('click', () => {
                app.toSource()
            })
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

            let buttonTablet = document.createElement('div')
            buttonTablet.setAttribute('name', 'buttonTablet')
            buttonTablet.addEventListener('click', () => {
                app.setVisualization('tablet')
            })
            refButtons.appendChild(buttonTablet)

                let tabletIcon = document.createElement('ion-icon')
                tabletIcon.setAttribute('name', 'tablet-landscape-outline')
                buttonTablet.appendChild(tabletIcon)

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
        refFrame.setAttribute('src', '/tool/appPreviewFrame.html')
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
        let classArr = []
        if (classStr != null) { classArr = classStr.split(' ') }

        let styleStr = child.getStyleString()
        if (styleStr.length > 0) {
            let newStyle = document.createElement('style')
            newStyle.setAttribute('id', 'css' + child.appId)
            newStyle.innerHTML = child.getStyleString()
            app.refPreviewBody.appendChild(newStyle)
            if (classArr == 0) {
                newItem.setAttribute('class', `css${child.appId} `)
            } else {
                newItem.setAttribute('class', `css${child.appId} ` + classArr.join(' '))
            }
        } else if (classArr > 0) {
            newItem.setAttribute('class', classArr.join(' '))
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

    setBackgroundColor (color) {
       this.elmRoot.querySelector('iframe[name="content"]').contentDocument.body.style.backgroundColor = color
    }

    setVisualization (type) {

        this.elmRoot.querySelector('iframe[name="content"]').classList.remove('contentSizePhone')
        this.elmRoot.querySelector('iframe[name="content"]').classList.remove('contentSizeTablet')
        this.elmRoot.querySelector('iframe[name="content"]').classList.remove('contentSizeDesktop')

        this.elmRoot.querySelector('div[name="buttonPhone"]').classList.remove('buttonSelected')
        this.elmRoot.querySelector('div[name="buttonTablet"]').classList.remove('buttonSelected')
        this.elmRoot.querySelector('div[name="buttonDesktop"]').classList.remove('buttonSelected')

        if (type == 'phone') {
            this.elmRoot.querySelector('iframe[name="content"]').classList.add('contentSizePhone')
            this.elmRoot.querySelector('div[name="buttonPhone"]').classList.add('buttonSelected')
        }

        if (type == 'tablet') {
            this.elmRoot.querySelector('iframe[name="content"]').classList.add('contentSizeTablet')
            this.elmRoot.querySelector('div[name="buttonTablet"]').classList.add('buttonSelected')
        }

        if (type == 'desktop') {
            this.elmRoot.querySelector('iframe[name="content"]').classList.add('contentSizeDesktop')
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

    setScript (value) {
        this.elmRoot.querySelector('iframe').contentWindow.eval(value)
    }
}