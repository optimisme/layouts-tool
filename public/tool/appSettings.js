// https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction

let selectableSettings = {
    'align-content': ['initial', 'start', 'flex-start', 'center', 'stretch', 'space-between', 'space-around', 'space-evenly', 'end', 'flex-end'],
    'align-self': ['initial', 'auto', 'start', 'flex-start', 'center', 'stretch', 'baseline', 'stretch', 'end', 'flex-end'],
    'align-items': ['initial', 'start', 'flex-start', 'center', 'stretch', 'baseline', 'end', 'flex-end'],
    'backdrop-filter': ['initial', 'custom', 'saturate(200%)', 'grayscale(25%) sepia(50%)', 'blur(3px)', 'brightness(50%)', 'contrast(50%)', 'grayscale(100%)', 'hue-rotate(-50deg)', 'hue-rotate(120deg)', 'invert(50%)', 'opacity(20%)', 'sepia(90%)', 'saturate(200%)  blur(3px)'],
    'background': ['initial', 'custom', 'white', 'black', 'lightgrey', 'darkgrey', '#abc', '#a5b6c7', 'rgb(50, 100, 150)', 'rgba(255, 255, 255, 0.5)', 'rgba(0, 0, 0, 0.5)'],
    'background-attachment': ['initial', 'fixed', 'local', 'scroll'],
    'background-color': ['initial', 'custom', 'white', 'black', 'lightgrey', 'darkgrey', '#abc', '#a5b6c7', 'rgb(50, 100, 150)', 'rgba(0, 0, 0, 0.5)'],
    'background-position': ['initial', 'custom', 'top', 'bottom', 'left', 'center', 'right', '0 0', '25% 75%', 'bottom 10px right 20px', 'bottom 10px right', 'top right 10px'],
    'background-repeat': ['initial', 'repeat-x', 'repeat-y', 'repeat', 'space', 'round', 'no-repeat', 'inherit', 'unset'],
    'background-size': ['initial', 'custom', 'cover', 'contain', '50%', '100px', 'auto', '50% auto', '12px 25%', 'auto 6px', 'auto auto', 'auto, auto', '50%, 25%'],
    'border': ['initial', 'custom', 'solid 1px lightgrey', 'dashed 1px grey', 'dotted 1px grey'],
    'border-bottom': ['initial', 'custom', 'solid 1px lightgrey', 'dashed 1px grey', 'dotted 1px grey'],
    'border-left': ['initial', 'custom', 'solid 1px lightgrey', 'dashed 1px grey', 'dotted 1px grey'],
    'border-right': ['initial', 'custom', 'solid 1px lightgrey', 'dashed 1px grey', 'dotted 1px grey'],
    'border-top': ['initial', 'custom', 'solid 1px lightgrey', 'dashed 1px grey', 'dotted 1px grey'],
    'border-radius': ['initial', 'custom', '0', '5px', '15px', '100%'],
    'box-shadow': ['initial', 'custom', '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)', '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)', '0 10px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)'],
    'box-sizing': ['initial', 'content-box', 'border-box'],
    'color': ['initial', 'custom', 'white', 'black', 'lightgrey', 'darkgrey', '#abc', '#a5b6c7', 'rgb(0, 150, 255)', 'rgba(0, 0, 0, 0.5)'],
    'column-gap': ['initial', 'custom', '4px', '8px'],
    'cursor': ['initial', 'auto', 'pointer', 'default', 'none', 'context-menu', 'help', 'progress', 'wait', 'cell', 'crosshair', 'text', 'vertical-text', 'alias', 'copy', 'move', 'no-drop', 'not-allowed', 'grab', 'grabbing', 'all-scroll', 'col-resize', 'row-resize', 'n-resize', 'e-resize', 's-resize', 'w-resize', 'ne-resize', 'nw-resize', 'se-resize', 'sw-resize', 'ew-resize', 'ns-resize', 'nesw-resize', 'nwse-resize', 'zoom-in', 'zoom-out'],
    'display': ['initial', 'custom', 'none', 'unset'],
    'filter': ['initial', 'custom', 'saturate(200%)', 'grayscale(25%) sepia(50%)', 'blur(3px)', 'brightness(50%)', 'contrast(50%)', 'grayscale(100%)', 'hue-rotate(-50deg)', 'hue-rotate(120deg)', 'invert(50%)', 'opacity(20%)', 'sepia(90%)', 'saturate(200%)  blur(3px)'],
    'flex-direction': ['initial', 'row', 'row-reverse', 'column', 'column-reverse', 'unset'],
    'flex-grow': ['initial', 'custom', '1', '2'],
    'flex-wrap': ['initial', 'nowrap', 'wrap', 'wrap-reverse'],
    // 'font-family': ['initial', 'custom', 'Arial', 'Verdana', 'Helvetica', 'Tahoma', '"Courier New"', '"Open Sans"', '"Roboto"', '"Raleway"', '"Montserrat"', '"Oswald"', '"Lato"', '"Lora"', '"Cormorant"', '"BioRhyme"', '"Inknut Antiqua"', '"Libre Baskerville"', '"IBM Plex Sans"', '"Anonymous Pro"'],
    'font-family': ['initial', 'custom', 'Arial', 'Verdana', 'Helvetica', 'Tahoma', '"Courier New"', '"Open Sans"'],
    'font-size': ['initial', 'custom', '0.95em', '1em', '2em'],
    'font-style': ['initial', 'custom', 'normal', 'italic', 'oblique', 'oblique 10deg'],
    'font-weight': ['initial', 'lighter', 'normal', 'bold', 'bolder', '100', '200', '300', '400', '500', '600', '700', '800', '900', 'inherit'],
    'grid-auto-flow': ['initial', 'row', 'column', 'row dense', 'column dense'],
    'grid-template-areas': ['initial', 'custom'],
    'grid-template-columns': ['initial', 'custom', '25% 25% 25% 25%'],
    'grid-template-rows': ['initial', 'custom', '10% 10% 10%'],
    'height': ['initial', 'custom', 'min-content', 'max-content', '48px', '100px', '250px', '500px', '50%', '75%', '100%', 'calc(100% - 16px)'],
    'justify-items': ['initial', 'start', 'center', 'stretch', 'end'],
    'justify-content': ['initial', 'start', 'flex-start', 'center', 'stretch', 'space-between', 'space-around', 'space-evenly', 'end', 'flex-end'],
    'justify-self': ['initial', 'start', 'center', 'stretch', 'end'],
    'margin': ['initial', 'custom', '0', '16px 0', '8px 16px', '8px 16px 8px 0'],
    'min-height': ['initial', 'custom', 'min-content', 'max-content', '100px', '250px', '25%', '50%', '75%', '100%', 'calc(100% - 32px)'],
    'min-width': ['initial', 'custom', 'min-content', 'max-content', '100px', '250px', '25%', '50%', '75%', '100%', 'calc(100% - 16px)'],
    'max-height': ['initial', 'custom', 'min-content', 'max-content', '100px', '250px', '25%', '50%', '75%', '100%', 'calc(100% - 32px)'],
    'max-width': ['initial', 'custom', 'min-content', 'max-content', '100px', '250px', '25%', '50%', '75%', '100%', 'calc(100% - 16px)'],
    'object-fit': ['initial', 'contain', 'cover', 'fill', 'none', 'scale-down'],
    'opacity': ['initial', 'custom', '0', '0.25', '0.5', '0.75', '1'],
    'overflow': ['initial', 'custom', 'visible', 'hidden', 'clip', 'scroll', 'auto', 'unset'],
    'overflow-x': ['initial', 'visible', 'hidden', 'clip', 'scroll', 'auto', 'unset'],
    'overflow-y': ['initial', 'visible', 'hidden', 'clip', 'scroll', 'auto', 'unset'],
    'padding': ['initial', 'custom', '0'],
    'position': ['initial', 'static', 'relative', 'absolute', 'fixed', 'sticky'],
    'row-gap': ['initial', 'custom', '4px', '8px'],
    'text-align': ['initial', 'left', 'center', 'justify', 'right', 'inherit'],
    'text-decoration': ['initial', 'none', 'overline', 'underline', 'line-through'],
    'text-transform': ['initial', 'none', 'capitalize', 'uppercase', 'lowercase', 'full-width', 'full-size-kana'],
    'transform': ['initial', 'custom', 'translateX(-25px)', 'scaleX(0.5)', 'scaleY(2)', 'rotateZ(-2deg)', 'skewX(30deg)', 'perspective(500px) rotateY(50deg)', 'translate3d(12px, 50%, 3em)', 'matrix(1.0, 2.0, 3.0, 4.0, 5.0, 6.0)', 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)'],
    'transition': ['initial', 'custom', 'opacity 0.3s ease', 'transform 0.3s ease'],
    'width': ['initial', 'custom', 'min-content', 'max-content', '48px', '100px', '250px', '25%', '50%', '75%', '100%', 'calc(100% - 32px)'],
    'writing-mode': ['initial', 'horizontal-tb', 'vertical-rl', 'vertical-lr', 'inherit', 'unset'],
    'z-index': ['initial', 'custom', '0', '1', '2', '10', '50', '1000'],
}

class SdwToolSettings extends HTMLElement {

    constructor() {
        super()

        this.shadow = this.attachShadow({ mode: 'open' })
        this.showEmpty = true
    }

    attributeChangedCallback(name, oldValue, newValue) { }

    connectedCallback () {

        this.elmStyle = document.createElement('style')
        this.elmStyle.textContent = `
        .root {
            background-color: #fafafa;
            border-left: solid 1px gray;
            box-sizing: border-box;
            height: 100%;
            overflow-x: hidden;
            overflow-y: auto;
            padding: 8px;
            position: absolute;
            right: 0;
            top: 0;
            width: 250px;
        }
        .root > .row {
            margin: 8px 0;
            width: 100%;
        }
        .root > .row > textarea, .root > .row > input {
            resize: vertical;
            width: 100%;
        }
        .root > .rowGrow {
            flex-grow: 1;
        }
        .root > .rowRandom {
            display: flex;
            justify-content: flex-end;
            margin: 8px 0;
            width: 100%;
        }
        .root > .rowRandom > button {
            margin-left: 4px;
        }
        .root > .rowAction {
            display: flex;
            margin: 8px 0;
            width: 100%;
        }
        .root > .rowAction > div:first-child {
            align-items: center;
            font-size: 0.9em; 
            flex-grow: 1;
            padding-right: 8px;
            overflow: hidden;
            text-align: right;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 100%;
        }
        .root > .rowAction > .itemText {
            font-size: 0.8em !important; 
        }
        .root > .rowAction > input {
            font-size: 0.8em;
            width: 100%;
        }
        .root > .rowAction > div:last-child {
            align-items: center;
            display: flex;
            flex-grow: 1;
            justify-content: center;
        }
        .root > .rowAction > div > .refreshIcon {
            animation: refreshRotate 0.5s linear normal;
            cursor: pointer;
            font-size: 1.1em;
        }
        .root > .rowAction > div:last-child > ion-icon {
            cursor: pointer;
            font-size: 1.2em;
        }
        @keyframes refreshRotate { 100% { -webkit-transform: rotate(360deg); transform: rotate(360deg); } }`
        this.shadow.appendChild(this.elmStyle)

        this.elmRoot = document.createElement('div')
        this.elmRoot.setAttribute('name', `root`)
        this.elmRoot.setAttribute('class', `root`)

        this.shadow.appendChild(this.elmRoot)
        this.innerHTML = ''
    }

    emptySettings (ref) {
       
        this.showEmpty = true
        this.elmRoot.textContent = ''
    }

    async setSettings (ref) {

        this.showEmpty = false
        while (this.elmRoot.firstChild) { 
            this.elmRoot.removeChild(this.elmRoot.lastChild) 
        }

        if (ref.parent == null) {
            await this.getSettingsBody()
        } else {
            await this.getSettingsElement(ref)
        }
    }

    async getSettingsBody () {

        let titleName = document.createElement('div')
        titleName.setAttribute('class', 'title')
        titleName.innerText = 'Site name:'
        this.elmRoot.appendChild(titleName)

        let divRow0 = document.createElement('div')
        divRow0.setAttribute('class', 'row')
        this.elmRoot.appendChild(divRow0)

            let inputName = document.createElement('input')
            inputName.setAttribute('name', 'siteName')
            inputName.value = app.siteName
            inputName.addEventListener('change', (evt) => {
                evt.preventDefault()
                let value = this.elmRoot.querySelector('input[name="siteName"]').value
                if (value == '') { value = 'template'; this.elmRoot.querySelector('input[name="siteName"]').value = value }
                app.siteName = value
            })
            divRow0.appendChild(inputName)

        let titleColor = document.createElement('div')
        titleColor.setAttribute('class', 'title')
        titleColor.innerText = 'Background color:'
        this.elmRoot.appendChild(titleColor)
    
        let divRow1 = document.createElement('div')
        divRow1.setAttribute('class', 'row')
        this.elmRoot.appendChild(divRow1)

            let inputColor = document.createElement('input')
            inputColor.setAttribute('name', 'siteColor')
            inputColor.value = app.backgroundColor
            inputColor.addEventListener('change', (evt) => {
                evt.preventDefault()
                let value = this.elmRoot.querySelector('input[name="siteColor"]').value
                if (value == '') { value = 'white'; this.elmRoot.querySelector('input[name="siteColor"]').value = value }
                app.backgroundColor = value
                app.refPreview.setBackgroundColor(value)
            })
            divRow1.appendChild(inputColor)

        let titleScript = document.createElement('div')
        titleScript.setAttribute('class', 'title')
        titleScript.innerText = 'Scripts:'
        this.elmRoot.appendChild(titleScript)

        for (let cnt = 0; cnt < app.scripts.length; cnt = cnt + 1) {
            let scriptRow = document.createElement('div')
            scriptRow.setAttribute('class', 'rowAction')
            this.elmRoot.appendChild(scriptRow)

                let scriptName = document.createElement('div')
                scriptName.setAttribute('class', 'itemText')
                scriptName.innerText = app.scripts[cnt]
                scriptRow.appendChild(scriptName)

                let divTmp0 = document.createElement('div')
                scriptRow.appendChild(divTmp0)

                    let scriptRefresh = document.createElement('ion-icon')
                    scriptRefresh.setAttribute('name', 'refresh-outline')
                    scriptRefresh.setAttribute('class', 'refreshIcon')
                    scriptRefresh.innerText = app.scripts[cnt]
                    scriptRefresh.addEventListener('click', (evt) => {
                        evt.preventDefault()
                        evt.stopPropagation()
                        app.reloadScript(app.scripts[cnt])
                    })
                    divTmp0.appendChild(scriptRefresh)

                let divTmp1 = document.createElement('div')
                scriptRow.appendChild(divTmp1)

                    let scriptDelete = document.createElement('ion-icon')
                    scriptDelete.setAttribute('name', 'close-outline')
                    scriptDelete.innerText = app.scripts[cnt]
                    scriptDelete.addEventListener('click', (evt) => {
                        evt.preventDefault()
                        evt.stopPropagation()
                        app.deleteScript(app.scripts[cnt])
                    })
                    divTmp1.appendChild(scriptDelete)
        }

        let divRow2 = document.createElement('div')
        divRow2.setAttribute('class', 'rowAction')
        this.elmRoot.appendChild(divRow2)

            let inputScript = document.createElement('input')
            inputScript.setAttribute('name', 'siteScript')
            inputScript.setAttribute('placeholder', 'Script location, ex: /script.js')
            inputScript.value = ''
            inputScript.addEventListener('change', (evt) => {
                evt.preventDefault()
                let value = this.elmRoot.querySelector('input[name="siteScript"]').value
                if (value != '') { 
                    app.addScript(value)
                }
            })
            divRow2.appendChild(inputScript)
        
            let divScript = document.createElement('div')
            divRow2.appendChild(divScript)

                let inputButtonScript = document.createElement('ion-icon')
                inputButtonScript.setAttribute('name', 'add-outline')
                inputButtonScript.addEventListener('click', (evt) => {
                    evt.preventDefault()
                    let value = this.elmRoot.querySelector('input[name="siteScript"]').value
                    if (value != '') { 
                        app.addScript(value)
                    }
                })
                divScript.appendChild(inputButtonScript)

        let titleFonts = document.createElement('div')
        titleFonts.setAttribute('class', 'title')
        titleFonts.innerText = 'Google fonts:'
        this.elmRoot.appendChild(titleFonts)

        for (let cnt = 0; cnt < app.googleFonts.length; cnt = cnt + 1) {
            let fontRow = document.createElement('div')
            fontRow.setAttribute('class', 'rowAction')
            this.elmRoot.appendChild(fontRow)

                let fontType = document.createElement('div')
                fontType.setAttribute('style', 'font-family:"' + app.googleFonts[cnt] + '";')
                fontType.innerText = app.googleFonts[cnt]
                fontRow.appendChild(fontType)

                let divTmp = document.createElement('div')
                fontRow.appendChild(divTmp)

                    let fontDelete = document.createElement('ion-icon')
                    fontDelete.setAttribute('name', 'close-outline')
                    fontDelete.innerText = app.googleFonts[cnt]
                    fontDelete.addEventListener('click', (evt) => {
                        evt.preventDefault()
                        evt.stopPropagation()
                        app.deleteFont(app.googleFonts[cnt])
                    })
                    divTmp.appendChild(fontDelete)
        }

        let divRow3 = document.createElement('div')
        divRow3.setAttribute('class', 'rowAction')
        this.elmRoot.appendChild(divRow3)

            let inputFont = document.createElement('input')
            inputFont.setAttribute('name', 'siteFont')
            inputFont.setAttribute('placeholder', 'Type the name, ex: Dancing Script')
            inputFont.value = ''
            inputFont.addEventListener('change', (evt) => {
                evt.preventDefault()
                let value = this.elmRoot.querySelector('input[name="siteFont"]').value
                if (value != '') { 
                    app.addFont(value)
                }
            })
            divRow3.appendChild(inputFont)

            let divFont = document.createElement('div')
            divRow3.appendChild(divFont)

                let inputButtonFont = document.createElement('ion-icon')
                inputButtonFont.setAttribute('name', 'add-outline')
                inputButtonFont.addEventListener('click', (evt) => {
                    evt.preventDefault()
                    let value = this.elmRoot.querySelector('input[name="siteFont"]').value
                    if (value != '') { 
                        app.addFont(value)
                    }
                })
                divFont.appendChild(inputButtonFont)
    }

    async getSettingsElement (ref) {

        let titleDescription = document.createElement('div')
        titleDescription.setAttribute('class', 'title')
        titleDescription.innerText = 'Description:'
        this.elmRoot.appendChild(titleDescription)

        let divRow0 = document.createElement('div')
        divRow0.setAttribute('class', 'row')
        this.elmRoot.appendChild(divRow0)

            let textDescription = document.createElement('input')
            textDescription.setAttribute('name', 'description')
            textDescription.value = ref.description
            textDescription.addEventListener('keyup', (evt) => {
                evt.preventDefault()
                let value = this.elmRoot.querySelector('input[name="description"]').value
                if (value == '') { value = app.getNamedObject(ref.typeName).description }
                ref.setDescription(value)
            })
            textDescription.addEventListener('change', (evt) => {
                evt.preventDefault()
                let value = this.elmRoot.querySelector('input[name="description"]').value
                if (value == '') { value = app.getNamedObject(ref.typeName).description; this.elmRoot.querySelector('input[name="description"]').value = value }
                ref.setDescription(value)
            })
            divRow0.appendChild(textDescription)

        if (ref.text != '') {
            let titleText = document.createElement('div')
            titleText.setAttribute('class', 'title')
            titleText.innerText = 'Text:'
            this.elmRoot.appendChild(titleText)

            let divRow1 = document.createElement('div')
            divRow1.setAttribute('class', 'row')
            this.elmRoot.appendChild(divRow1)

                let textArea = document.createElement('textarea')
                textArea.value = ref.text
                textArea.setAttribute('style', 'min-height: 100px;')
                textArea.addEventListener('keyup', (evt) => {
                    evt.preventDefault()
                    let value = this.elmRoot.querySelector('textarea').value
                    if (value == '') { value = '{{text}}' }
                    ref.setText(value)
                })
                textArea.addEventListener('change', (evt) => {
                    evt.preventDefault()
                    let value = this.elmRoot.querySelector('textarea').value
                    if (value == '') { value = '{{text}}'; this.elmRoot.querySelector('textarea').value = value }
                    ref.setText(value)
                })
                divRow1.appendChild(textArea)

            let divRowRandomText = document.createElement('div')
            divRowRandomText.setAttribute('class', 'rowRandom')
            this.elmRoot.appendChild(divRowRandomText)

                let randomWord = document.createElement('button')
                randomWord.textContent = 'Word'
                randomWord.addEventListener('click', (evt) => {
                    evt.preventDefault()
                    let value = this.getRandomWord()
                    this.elmRoot.querySelector('textarea').value = value
                    ref.setText(value)
                })
                divRowRandomText.appendChild(randomWord)

                let randomTitle = document.createElement('button')
                randomTitle.textContent = 'Title'
                randomTitle.addEventListener('click', (evt) => {
                    evt.preventDefault()
                    let value = this.getRandomTitle()
                    this.elmRoot.querySelector('textarea').value = value
                    ref.setText(value)
                })
                divRowRandomText.appendChild(randomTitle)

                let randomShort = document.createElement('button')
                randomShort.textContent = 'Short'
                randomShort.addEventListener('click', (evt) => {
                    evt.preventDefault()
                    let value = this.getRandomShort()
                    this.elmRoot.querySelector('textarea').value = value
                    ref.setText(value)
                })
                divRowRandomText.appendChild(randomShort)

                let randomText = document.createElement('button')
                randomText.textContent = 'Text'
                randomText.addEventListener('click', (evt) => {
                    evt.preventDefault()
                    let value = this.getRandomText()
                    this.elmRoot.querySelector('textarea').value = value
                    ref.setText(value)
                })
                divRowRandomText.appendChild(randomText)
        }

        if (ref.attributes.length > 0) {
            let titleAttributes = document.createElement('div')
            titleAttributes.setAttribute('class', 'title')
            titleAttributes.innerText = 'Attributes:'
            this.elmRoot.appendChild(titleAttributes)
        }

        for (let cnt = 0; cnt < ref.attributes.length; cnt = cnt + 1) {
            let name = ref.attributes[cnt][0]
            this.elmRoot.appendChild(SdwConfig.getObject(name, ref.attributes[cnt][1], true, (name, value) => { ref.setAttribute(name, value) }))

            // Prevent interface blocking (and keep building if must be empty)
            await app.wait(1); if (this.showEmpty) { this.emptySettings(); return }
        }

        if (ref.style.length > 0) {
            let titleCSS = document.createElement('div')
            titleCSS.setAttribute('class', 'title')
            titleCSS.innerText = 'CSS Style:'
            this.elmRoot.appendChild(titleCSS)
        }
    
        for (let cnt = 0; cnt < ref.style.length; cnt = cnt + 1) {
            let name = ref.style[cnt][0]
            if (typeof selectableSettings[name] == 'object') {
                if (name == 'padding') {
                    this.elmRoot.appendChild(SdwConfigPadding.getObject(name, ref.style[cnt][1], ref.style[cnt][2], selectableSettings[name], (name, value) => { ref.setStyle(name, value) }))
                } else if (selectableSettings[name].indexOf('custom') >= 0) {
                    this.elmRoot.appendChild(SdwConfigSelectCustom.getObject(name, ref.style[cnt][1], ref.style[cnt][2], selectableSettings[name], (name, value) => { ref.setStyle(name, value) }))
                } else {
                    this.elmRoot.appendChild(SdwConfigSelect.getObject(name, ref.style[cnt][1], ref.style[cnt][2], selectableSettings[name], (name, value) => { ref.setStyle(name, value) }))
                }
            } else {
                this.elmRoot.appendChild(SdwConfig.getObject(name, ref.style[cnt][1], ref.style[cnt][2], (name, value) => { ref.setStyle(name, value) }))
            }

            // Prevent interface blocking (and keep building if must be empty)
            await app.wait(1); if (this.showEmpty) { this.emptySettings(); return }
        }

        if (ref.phone.length > 0) {
            let titlePhone = document.createElement('div')
            titlePhone.setAttribute('class', 'title')
            titlePhone.innerText = 'Mobile style:'
            this.elmRoot.appendChild(titlePhone)
        }

        for (let cnt = 0; cnt < ref.phone.length; cnt = cnt + 1) {
            let name = ref.phone[cnt][0]
            if (selectableSettings[name] != undefined) {
                if (name == 'padding') {
                    this.elmRoot.appendChild(SdwConfigPadding.getObject(name, ref.phone[cnt][1], ref.phone[cnt][2], selectableSettings[name], (name, value) => { ref.setStylePhone(name, value) }))
                } else if (selectableSettings[name].indexOf('custom') >= 0) {
                    this.elmRoot.appendChild(SdwConfigSelectCustom.getObject(name, ref.phone[cnt][1], ref.phone[cnt][2], selectableSettings[name], (name, value) => { ref.setStylePhone(name, value) }))
                } else {
                    this.elmRoot.appendChild(SdwConfigSelect.getObject(name, ref.phone[cnt][1], ref.phone[cnt][2], selectableSettings[name], (name, value) => { ref.setStylePhone(name, value) }))
                }
            } else {
                this.elmRoot.appendChild(SdwConfig.getObject(name, ref.phone[cnt][1], ref.phone[cnt][2], (name, value) => { ref.setStylePhone(name, value) }))
            }

            // Prevent interface blocking (and keep building if must be empty)
            await app.wait(1); if (this.showEmpty) { this.emptySettings(); return }
        }
    }

    getRandomWord () {
        let texts = [
            'Frog', 'Toad', 'Scorpion', 'Spider', 'Albatross', 'Blackbird', 'Canary', 'Crow', 'Cuckoo', 'Pigeon', 'Duck', 'Eagle', 'Falcon', 'Finch', 'Flamingo', 'Goose', 'Owl', 'Parrot', 'Peacock', 'Pelican', 'Penguin', 'Sparrow', 'Swan', 'Swift', 'Turkey', 'Silkworm', 'Crab', 'Goldfish', 'Haddock', 'Jellyfish', 'Lobster', 'Salmon', 'Sawfish', 'Shark', 'Ant', 'Bee', 'Beetle', 'Bumblebee', 'Dragonfly', 'Larva' ,'Wasp', 'Armadillo', 'Bat', 'Camel', 'Chimpanzee', 'Daschund', 'Dolphin', 'Elephant', 'Fox', 'Gaselle', 'Giraffe', 'Goat', 'Hamster', 'Bear', 'Hedgehog', 'Horse', 'Hyena', 'Lion', 'Mammoth', 'Marmot', 'Mouse', 'Panda', 'Pony', 'Puma', 'Rat', 'Tiger', 'Weasel', 'Whale', 'Zebra', 'Snail', 'Chameleon', 'Crocodile', 'Gecko', 'Iguana', 'Tortoise', 'Earthworm'
        ]
        return texts[parseInt(Math.random() * (texts.length - 1))]
    }

    getRandomTitle () {
        let texts = [
            'To the infinity and beyond',
            'What makes it great',
            'The magic inside',
            'Innovation at its best',
            'Where the oportunities find solutions',
            'Change the world from home',
            'Small improvements that makes it great',
            'Where innovation meets humans',
            'Transform the way you care about your customers',
            'Grow your business the way you need',
            'Enjoy teamworking',
            'There are no boundaries',
            'Boundaries are just conventions',
            'Investing in your clients',
            'Success stories from real world',
            'Achieving your goals',
            'Time to grow with your business'
        ]
        return texts[parseInt(Math.random() * (texts.length - 1))]
    }

    getRandomShort () {
        return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }

    getRandomText () {
        return 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.'
    }
}