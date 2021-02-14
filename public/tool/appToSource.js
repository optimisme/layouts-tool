class Source {

    constructor () {
        this.classes = {}
    }

    toSource () {

        let bodyStr = this.toSourceItem(app.elementsRoot)

        let styleNames = (Object.keys(this.classes)).sort((a, b) => { return a.toLowerCase().localeCompare(b.toLowerCase()) })
        let styleStr = this.getPredefinedStyles(bodyStr)
        let scriptsStr = this.getPredefinedScripts(bodyStr)

        for (let cnt = 0; cnt < styleNames.length; cnt = cnt + 1) {
            if (this.classes[styleNames[cnt]] != '') {
                styleStr = styleStr + '\n' + this.classes[styleNames[cnt]].replaceAll('CLASSNAME', styleNames[cnt])
            }
        }

        let fontsList = ''
        for (let cnt = 0; cnt < app.googleFonts.length; cnt = cnt + 1) {
            fontsList = fontsList + `\n    <link href="https://fonts.googleapis.com/css2?family=${app.googleFonts[cnt].replaceAll(' ', '+')}:wght@300;400;600;800&display=swap" rel="stylesheet">`
        }

        let scriptsList = ''
        for (let cnt = 0; cnt < app.scripts.length; cnt = cnt + 1) {
            scriptsList = scriptsList + `\n    <script src="${app.scripts[cnt]}"></script>`
        }

        return this.getHTML(fontsList, scriptsList, styleStr, scriptsStr, bodyStr)
    }

    toSourceItem (item) {

        let str = ''
        let ident = this.getSourceIdent(item.refList.ident)
        let attributes = this.getSourceAttributes(item)
        let classStr = ''
        
        let typeClassName = 'def' + app.capitalize(item.typeName)
        let itemClassName = 'elm' + item.appId
        let typeClassStr = ''
        let itemClassStr = ''
        let attrClassStr = this.getItemAttribute(item, 'class')

        let attributeId = this.getItemAttribute(item, 'id') 
        if (attributeId != '' && attributeId != 'initial') {
            itemClassName = 'elm' + app.capitalize(attributeId)
        }

        if (typeof this.classes[typeClassName] == 'undefined') {
            let obj = app.getNamedObject(item.typeName)
            typeClassStr = this.getClassText(obj.style, obj.phone, typeClassName)
            this.classes[typeClassName] = typeClassStr
        }

        itemClassStr = this.getClassText(item.style, item.phone, item.appId)

        if (this.classes[typeClassName] != '') {
            classStr = typeClassName
        }
        if (itemClassStr != this.classes[typeClassName]) {
            this.classes[itemClassName] = itemClassStr
            if (classStr != '') classStr = classStr + ' '
            classStr = classStr + itemClassName
        }
        if (attrClassStr != '') {
            if (classStr != '') classStr = classStr + ' '
            classStr = classStr + attrClassStr
        }
        if (classStr != '') {
            classStr = ' class="' + classStr + '"'
        }

        if (item.tag != 'textarea' && item.tag != 'a' && item.tag != 'circle') {
            str = str + '\n' + ident + '<' + item.tag + attributes + classStr + '>' + '<!-- ' + item.description + ' -->'
        } else if (item.tag == 'circle') {
            str = str + '\n' + ident + '<' + item.tag + attributes + classStr + '/>'
        } else {
            str = str + '\n' + ident + '<' + item.tag + attributes + classStr + '>'
        }

        for (let cnt = 0; cnt < item.childs.length; cnt = cnt + 1) {
            str = str + this.toSourceItem(item.childs[cnt])
        }

        if (item.text != '') {
            str = str + '\n  ' + ident + item.text
        }

        if (['textarea'].indexOf(item.tag) >= 0) str = str + '</' + item.tag + '>'
        if (['body', 'div', 'a', 'h1', 'h2', 'h3', 'span', 'label', 'iframe', 'select', 'option', 'button', 'svg', 'form'].indexOf(item.tag) >= 0) str = str + '\n' + ident + '</' + item.tag + '>'

        return str
    }

    getClassText (style, phone, name) {
        let styleStr = ''
        let styleStrPhone = ''

        for (let cnt = 0; cnt < style.length; cnt = cnt + 1) {
            let propertyName = style[cnt][0]
            let propertyValueDesktop = style[cnt][1]
            if (style[cnt][1] != 'initial') {
                if (propertyValueDesktop != 'initial') {
                    styleStr = styleStr + propertyName + ':' + style[cnt][1] + '; '
                }
            }

            let phonePropretyPosition = app.getPropertyPosition(phone, propertyName)
            if (phonePropretyPosition >= 0) {
                let propertyValuePhone = phone[phonePropretyPosition][1]
                if (propertyValuePhone != 'initial') {
                    styleStrPhone = styleStrPhone + propertyName + ':' + propertyValuePhone + '; '
                }
            }
        }
        if (styleStr.length > 0) {
            styleStr = `.CLASSNAME { ${styleStr}}`
        }
        if (styleStrPhone.length > 0) {
            styleStr += `\n@media only screen and (max-width: 768px) { .CLASSNAME { ${styleStrPhone}} }`
        }

        return styleStr
    }

    getSourceIdent (num) {
        let arr = new Array(num)
        return arr.join('  ')
    }

    getItemAttribute (item, attributeName) {
        for (let cnt = 0; cnt < item.attributes.length; cnt = cnt + 1) {
            if (item.attributes[cnt][0] == attributeName) {
                return item.attributes[cnt][1]
            }
        }
        return ''
    }

    getSourceAttributes (item) {
        let str = ''

        for (let cnt = 0; cnt < item.attributes.length; cnt = cnt + 1) {
            let attribute = item.attributes[cnt]
            if (attribute[0] != 'class' && attribute[1] != 'initial') str = str + ' ' + attribute[0] + '="' + attribute[1].replaceAll('"', '&quot;') + '"'
        }

        return str
    }

    getPredefinedStyles (bodyStr) {

        let str = `
body { background-color: ${app.backgroundColor}; font-family: 'Open Sans', sans-serif; margin: 0; padding: 0; }`

        if (bodyStr.indexOf('carouselDots') >= 0) {
            str = str + `
.carouselDots { align-items: center; box-sizing: border-box; display: flex; flex-direction:column; margin: 0; width: 100%; }
.carouselDots > div:first-child { overflow: hidden; width: 100%; }
.carouselDots > div:first-child > div { display: flex; height: 100%; transform: translate(0px); transition: transform 0.3s ease; will-change: transform; }
.carouselDots > div:first-child > div > div { background-color: darkgray; background-repeat: no-repeat; background-position: center; background-size: cover; height: 100%; min-width: 100%; }
.carouselDots > div:last-child { margin-top: 16px; }
.carouselDots > div:last-child > div { border: solid 2px lightgrey; border-radius: 100%; cursor: pointer; display: inline-block; height: 10px; margin: 0 15px 0 15px; width: 10px; }
.carouselDots > div:last-child > div:first-child { background-color: lightgrey; }
.carouselDotsSelected { background-color: lightgrey !important; }
.carouselDotsUnselected { background-color: initial !important; }`
        }

        if (bodyStr.indexOf('carouselArrows') >= 0) {
            str = str + `
.carouselArrows { align-items: center; box-sizing: border-box; display: flex; flex-direction:column; margin: 0; position: relative; width: 100%; }
.carouselArrows > div:first-child { height: 500px; overflow: hidden; width: 100%; }
.carouselArrows > div:first-child > div { display: flex; height: 100%; transform: translate(0px); transition: transform 0.3s ease; will-change: transform; }
.carouselArrows > div:first-child > div > div { background-color: darkgray; background-repeat: no-repeat; background-position: center; background-size: cover; height: 100%; min-width: 100%; }
.carouselArrows .carouselArrow { align-items: center; bottom: 0; display: flex; left: 0; position: absolute; top: 0; }
.carouselArrows .carouselArrow > div { border-top: solid 4px #fff; border-right: solid 4px #fff; cursor: pointer; height: 15px; margin: 15px; opacity: 0.75; transform: rotateZ(-135deg); width: 15px; }
.carouselArrows .carouselArrow > div:hover { opacity: 1; }
.carouselArrows .carouselArrowRight { left: unset; right: 0; }
.carouselArrows .carouselArrowRight > div { transform: rotateZ(45deg); }`
        }

        if (bodyStr.indexOf('drawer') >= 0) {
            str = str + `
.drawer { display: none; background-color: rgb(100, 100, 100, 0.75); backdrop-filter: blur(2px) saturate(200%); bottom: 0; filter: blud(3px) saturate(200%); left: 0; opacity: 0; position: fixed; right: 0; top: 0; transition: opacity 0.3s ease; z-index: 10000; }
.drawer > .drawerSide { background-color: white; height: 100%; overflow-x: hidden; overflow-y: auto; transform: translate3d(-251px, 0, 0); transition: transform 0.3s ease; width: 250px; }`
        }

        if (bodyStr.indexOf('modal') >= 0) {
            str = str + `
.modal { align-items: center; display: none; background-color: rgb(100, 100, 100, 0.75); backdrop-filter: blur(2px) saturate(200%); bottom: 0; filter: blud(3px) saturate(200%); justify-content: center; left: 0; opacity: 0; position: fixed; right: 0; top: 0; transition: opacity 0.3s ease; z-index: 10000; }
.modal > .modalWindow { background-color: white; border-radius: 5px; height: max-content; overflow-x: hidden; overflow-y: auto; padding: 8px; transform: translateY(-100vh); transition: transform 0.3s ease; width: max-content; }`
        }

        if (bodyStr.indexOf('formInputText') >= 0) {
            str = str + `
.formInputText { padding: 15px 0 0; position: relative; width: 100%; }
.formInputText > input { background: transparent; border: 0; border-bottom: 1px solid #d2d2d2; color: #212121; font-family: inherit; font-size: 16px; outline: 0; padding: 7px 0; transition: border-color 0.2s; width: 100%; }
.formInputText > input::placeholder { color: transparent; }
.formInputText > input:placeholder-shown ~ label { cursor: text; font-size: 16px; top: 20px; }
.formInputText > label { pointer-events: none; }
.formInputText > label, 
.formInputText > input:focus ~ label { color: #9b9b9b; display: block; font-size: 12px; position: absolute; top: 0; transition: 0.2s; }
.formInputText > input:focus ~ label { color: rgb(0, 125, 255); }
.formInputText > input:focus { border-bottom: 2px solid rgb(0, 125, 255); padding-bottom: 6px; }
.formInputText > input:valid ~ span { color: transparent; }
.formInputText > input:invalid ~ span { color: red; }`
        }

        if (bodyStr.indexOf('formInputTextarea') >= 0) {
            str = str + `
.formInputTextarea { padding: 15px 0 0; position: relative; width: 100%; }
.formInputTextarea > textarea { background: transparent; border: 0; border-bottom: 1px solid #d2d2d2; color: #212121; font-family: inherit; font-size: 16px; outline: 0; padding: 7px 0; resize: none; transition: border-color 0.2s; width: 100%; }
.formInputTextarea > textarea::placeholder { color: transparent; }
.formInputTextarea > textarea:placeholder-shown ~ label { cursor: text; font-size: 16px; top: 20px; }
.formInputTextarea > label, 
.formInputTextarea > textarea:focus ~ label { color: #9b9b9b; display: block; font-size: 12px; position: absolute; top: 0; transition: 0.2s; }
.formInputTextarea > textarea:focus ~ label { color: rgb(0, 125, 255); }
.formInputTextarea > textarea:focus { border-bottom: 2px solid rgb(0, 125, 255); padding-bottom: 6px; }
.formInputTextarea > textarea:valid ~ span { color: transparent; }
.formInputTextarea > textarea:invalid ~ span { color: red; }`
        }

        if (bodyStr.indexOf('formButton') >= 0) {
            str = str + `
.formButton             { background-color: rgb(0, 125, 255); border: none; border-radius: 4px; box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12); color: white; cursor: pointer; font-weight: 800; height: 36px; margin: 0; min-width: 64px; outline: none; padding: 0 16px; position: relative; text-align: center; text-transform: uppercase; transition: box-shadow 0.2s; }
.formButton:hover,
.formButton:focus       { background-color: rgb(50, 150, 255); box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12); }
.formButton:active      { box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12); }
.formButton:disabled    { color: #eee; background-color: #aaa; box-shadow: none; cursor: initial; }`
        }

        if (bodyStr.indexOf('formSelect') >= 0) {
            str = str + `
.formSelect { position: relative; width: 100%; }
.formSelect:after { border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid rgba(0, 0, 0, 0.12); content: ''; height: 0; padding: 0; pointer-events: none; position: absolute; right: 10px; top: 22px; width: 0; }
.formSelect > select { appearance: none; -webkit-appearance:none; background-color: transparent; border: none; border-bottom: 1px solid rgba(0,0,0, 0.12); border-radius: 0; font-family: inherit; padding: 15px 10px 10px 0; position: relative; font-size: 18px; width: 100%; }
.formSelect > select:focus { border-bottom: 1px solid rgba(0,0,0, 0); outline: none; }
.formSelect > label { color: rgba(0,0,0, 0.26); font-size: 18px; font-weight: normal; left: 0; position: absolute; pointer-events: none; top: 12px; transition: 0.2s ease all; }
.formSelect > select:focus ~ label, .formSelect > select:valid ~ label {  color: #2F80ED; font-size: 12px; top: 0px; transition: 0.2s ease all; }
.formSelect > span:nth-child(2) { height: 60%; left: 0; opacity: 0.5; pointer-events: none; position: absolute; top: 25%; width: 100px; }
.formSelect > span:nth-child(3) { display: block; position: relative; width: 100%; }
.formSelect > span:nth-child(3):before, .formSelect > span:nth-child(3):after { background: #2F80ED; bottom: 1px; content: ''; height: 2px; position: absolute; transition: 0.2s ease all; width: 0; }
.formSelect > span:nth-child(3):before { left: 50%; }
.formSelect > span:nth-child(3):after { right: 50%; }
.formSelect > select:focus ~ span:nth-child(3):before, .formSelect > select:focus ~ span:nth-child(3):after { width: 50%; }`
        }

        if (bodyStr.indexOf('formCheckbox') >= 0) {
            str =str + `
.formCheckbox { color: rgba(0, 0, 0, 0.87); display: block; font-size: 16px; line-height: 1.5; position: relative; z-index: 0; }
.formCheckbox > input { appearance: none; background-color: rgba(0, 0, 0, 0.6); border-radius: 50%; box-shadow: none; display: block; height: 40px; left: -10px; margin: 0; opacity: 0; outline: none; pointer-events: none; position: absolute; top: -8px; transition: opacity 0.3s, transform 0.2s; transform: scale(1); width: 40px; z-index: -1; }
.formCheckbox > span { cursor: pointer; display: inline-block; width: 100%; }
.formCheckbox > span::before { border: solid 2px; border-color: rgba(0, 0, 0, 0.6); border-radius: 2px; box-sizing: border-box; content: ""; display: inline-block; height: 18px; margin: 3px 11px 3px 1px; transition: border-color 0.2s, background-color 0.2s; vertical-align: top; width: 18px; }
.formCheckbox > span::after { border: solid 2px transparent; border-right: none; border-top: none; content: ""; display: block; height: 5px; left: 1px; position: absolute; top: 3px; transform: translate(3px, 4px) rotate(-45deg); width: 10px; }
.formCheckbox > input:checked,
.formCheckbox > input:indeterminate { background-color: rgb(33, 150, 243) }
.formCheckbox > input:checked + span::before,
.formCheckbox > input:indeterminate + span::before { background-color: rgb(33, 150, 243); border-color: rgb(33, 150, 243); }
.formCheckbox > input:checked + span::after,
.formCheckbox > input:indeterminate + span::after { border-color: rgb(255, 255, 255); }
.formCheckbox > input:indeterminate + span::after { border-left: none; transform: translate(4px, 3px); }
.formCheckbox:hover > input { opacity: 0.04; }
.formCheckbox > input:focus {   opacity: 0.12;  }
.formCheckbox:hover > input:focus { opacity: 0.16;  }
.formCheckbox > input:active { opacity: 1; transform: scale(0); transition: transform 0s, opacity 0s; }
.formCheckbox > input:active + span::before { border-color: rgb(33, 150, 243); }
.formCheckbox > input:checked:active + span::before { background-color: rgba(0, 0, 0, 0.6); border-color: transparent; }
.formCheckbox > input:disabled { opacity: 0; }
.formCheckbox > input:disabled + span { color: rgba(0, 0, 0, 0.38); cursor: initial; }
.formCheckbox > input:disabled + span::before { border-color: currentColor; }
.formCheckbox > input:checked:disabled + span::before,
.formCheckbox > input:indeterminate:disabled + span::before { background-color: currentColor; border-color: transparent; }`
        }

        if (bodyStr.indexOf('formRadio') >= 0) {
            str =str + `
.formRadio { color: rgba(0, 0, 0, 0.87); display: block; font-size: 16px; line-height: 1.5; position: relative; z-index: 0; }
.formRadio > input { appearance: none; background-color: rgba(0, 0, 0, 0.6); border-radius: 50%; display: block; height: 40px; left: -10px; margin: 0; opacity: 0; outline: none; pointer-events: none; position: absolute; top: -8px; transform: scale(1); transition: opacity 0.3s, transform 0.2s; width: 40px; z-index: -1; }
.formRadio > span { cursor: pointer; display: inline-block; width: 100%; }
.formRadio > span::before { border: solid 2px; border-color: rgba(0, 0, 0, 0, 0.6); border-radius: 50%; box-sizing: border-box; content: ""; display: inline-block; height: 20px; margin: 2px 10px 2px 0; transition: border-color 0.2s; vertical-align: top; width: 20px; }
.formRadio > span::after { background-color: rgb(033, 150, 243); border-radius: 50%; content: ""; display: block; height: 10px; left: 0; position: absolute; top: 2px; transform: translate(5px, 5px) scale(0); transition: transform 0.2s; width: 10px; }
.formRadio > input:checked { background-color: rgb(0, 33, 150, 243); }
.formRadio > input:checked + span::before { border-color: rgb(33, 150, 243); }
.formRadio > input:checked + span::after { transform: translate(5px, 5px) scale(1); }
.formRadio:hover > input { opacity: 0.04; }
.formRadio > input:focus { opacity: 0.12; }
.formRadio:hover > input:focus { opacity: 0.16; }
.formRadio > input:active { opacity: 1; transform: scale(0); transition: transform 0s, opacity 0s; }
.formRadio > input:active + span::before { border-color: rgb(var(--pure-material-primary-rgb, 33, 150, 243)); }
.formRadio > input:disabled { opacity: 0; }
.formRadio > input:disabled + span { color: rgba(var(--pure-material-onsurface-rgb, 0, 0, 0), 0.38); cursor: initial; }
.formRadio > input:disabled + span::before { border-color: currentColor; }
.formRadio > input:disabled + span::after { background-color: currentColor; }`
        }

        if (bodyStr.indexOf('formRange') >= 0) {
            str =str + `
.formRange { display: inline-block; color: rgba(0, 0, 0, 0.87); font-family: inherit; font-size: 16px; line-height: 1.5; width: 100%; }
.formRange > input { appearance: none; -webkit-appearance: none; background-color: transparent; cursor: pointer; display: block; height: 36px; margin: 0 0 -36px; position: relative; top: 24px; width: 100%; }
.formRange > input:last-child { margin: 0; position: static; }
.formRange > span { color: #9b9b9b; display: inline-block; font-size: 12px; margin-bottom: 36px; }
.formRange > input:focus { outline: none; }
.formRange > input:focus ~ span { color: rgb(33, 150, 243); }
.formRange > input:disabled { cursor: default; opacity: 0.38; }
.formRange > input:disabled + span { color: rgba(0, 0, 0, 0.38); }
.formRange > input::-webkit-slider-runnable-track { background-color: rgba(33, 150, 243, 0.24); border-radius: 1px; height: 2px; margin: 17px 0; width: 100%; }
.formRange > input::-webkit-slider-thumb { appearance: none; -webkit-appearance: none; background-color: rgb(33, 150, 243); border: none; border-radius: 50%; height: 2px; transform: scale(6, 6); transition: box-shadow 0.2s; width: 2px; }
.formRange:hover > input::-webkit-slider-thumb { box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.04); }
.formRange > input:focus::-webkit-slider-thumb { box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.12); }
.formRange:hover > input:focus::-webkit-slider-thumb { box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.16); }
.formRange > input:active::-webkit-slider-thumb { box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.24) !important; }
.formRange > input:disabled::-webkit-slider-runnable-track { background-color: rgba(0, 0, 0, 0.38); }
.formRange > input:disabled::-webkit-slider-thumb { background-color: rgb(var(--pure-material-onsurface-rgb, 0, 0, 0)); box-shadow: 0 0 0 1px rgb(var(--pure-material-surface-rgb, 255, 255, 255)) !important; color: rgb(var(--pure-material-surface-rgb, 255, 255, 255)); transform: scale(4, 4); }
.formRange > input::-moz-range-track { background-color: rgba(33, 150, 243, 0.24); border-radius: 1px; margin: 17px 0; height: 2px; width: 100%; }
.formRange > input::-moz-range-thumb { appearance: none; -moz-appearance: none; background-color: rgb(33, 150, 243); border: none; border-radius: 50%; height: 2px; transform: scale(6, 6); transition: box-shadow 0.2s; width: 2px; }
.formRange > input::-moz-range-progress { background-color: rgb(33, 150, 243); border-radius: 1px; height: 2px; }
.formRange:hover > input:hover::-moz-range-thumb { box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.04); }
.formRange > input:focus::-moz-range-thumb { box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.12); }
.formRange:hover > input:focus::-moz-range-thumb { box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.16); }
.formRange > input:active::-moz-range-thumb { box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.24) !important; }
.formRange > input:disabled::-moz-range-track { background-color: rgba(0, 0, 0, 0.38); }
.formRange > input:disabled::-moz-range-progress { background-color: rgba(0, 0, 0, 0.87); }
.formRange > input:disabled::-moz-range-thumb { background-color: rgb(0, 0, 0); box-shadow: 0 0 0 1px rgb(255, 255, 255) !important; transform: scale(4, 4); }
.formRange > input::-moz-focus-outer { border: none; }`
        }

        if (bodyStr.indexOf('waitSpinner') >= 0) {
            str =str + `
.waitSpinner { height: 100%; overflow: hidden; width: 100%; }
.waitSpinner svg { animation: spinnerRotate 1.5s linear infinite; height: 100%; width: 100%; }
.waitSpinner circle { animation: spinnerDash 1.5s ease-in-out infinite 0s, spinnerColor 6s ease-in-out infinite -0.75s; stroke-dasharray: 1,200; stroke-dashoffset: 0; stroke-linecap: round; fill: none; stroke-width: 5; }
@keyframes spinnerRotate { 100% { -webkit-transform: rotate(360deg); transform: rotate(360deg); } }
@keyframes spinnerDash { 0% { stroke-dasharray: 1,200; stroke-dashoffset: 0; } 50% { stroke-dasharray: 89,200; stroke-dashoffset: -45; } 100% { stroke-dasharray: 89,200; stroke-dashoffset: -124; } }
@keyframes spinnerColor { 100%, 0% { stroke: #4285F4; } 25% {  stroke: #DE3E35; } 50% { stroke: #F7C223; } 75% { stroke: #1DA760; } }`
        }

        return str
    }

    getPredefinedScripts (bodyStr) {

        let str = ''

        if (bodyStr.indexOf('wgt-upload') >= 0) {
            str = str + this.getWidgetUploadStr()
        }

        if (bodyStr.indexOf('setCarouselDots') >= 0) {
            str = str + `
function setCarouselDots(ref) {
    let cnt = 0
    let obj = ref.parentNode.parentNode
    let refImages = obj.querySelector('div[data-name="images"]')
    let refIndicators = obj.querySelectorAll('div[data-name="indicator"]')

    for (cnt = 0; cnt < refIndicators.length; cnt = cnt + 1) {
        if (refIndicators[cnt] == ref) {
            refImages.style.transform = 'translateX(-' + (cnt * 100) + '%)'
            refIndicators[cnt].classList.add('carouselDotsSelected')
            refIndicators[cnt].classList.remove('carouselDotsUnselected')
        } else {
            refIndicators[cnt].classList.remove('carouselDotsSelected')
            refIndicators[cnt].classList.add('carouselDotsUnselected')
        }
    }
}`
        }

        if (bodyStr.indexOf('setCarouselArrows') >= 0) {
            str = str + `
function setCarouselArrows(ref, direction) {
    let num = 0
    let obj = ref.parentNode.parentNode
    let refImages = obj.querySelector('div[data-name="images"]')
    let numImages = (refImages.querySelectorAll('div[data-name="carouselImage"]')).length

    if (refImages.style.transform != '') {
        num = -1 * (parseInt((refImages.style.transform.replace('translateX(', '')).replace('%)', '')) / 100)
    }

    if (direction == 'left') { num = num - 1; } else { num = num + 1; }
    if (num < 0) { num = numImages - 1; } 
    if (num >= numImages) { num = 0; }

    refImages.style.transform = 'translateX(-' + (num * 100) + '%)'
}`
        }

        if (bodyStr.indexOf('setDrawer') >= 0) {
            str = str + `
async function setDrawer (id, show, event) {
    let refBody = document.getElementsByTagName('body')[0]
    let refDrawer = document.getElementById(id)
    let performAction = false

    if (typeof event == 'undefined' || (event.target && event.target.getAttribute('id') == id)) {
        if (show) {
            refBody.style.overflow = 'hidden'
            refDrawer.style.display = 'flex'
            await promiseWaitUntilPropertyValue(refDrawer, 'display', 'flex')  
            refDrawer.style.opacity = '1'
            refDrawer.querySelector('.drawerSide').style.transform = 'translate3d(0px, 0, 0)'
        } else {
            refDrawer.style.opacity = '0'
            refDrawer.querySelector('.drawerSide').style.transform = 'translate3d(-250px, 0, 0)'
            await promiseWait(300)
            refBody.style.overflow = 'initial'
            refDrawer.style.display = 'none'
        }
    }
}`
        }

        if (bodyStr.indexOf('setModal') >= 0) {
            str = str + `
async function setModal (id, show, event) {
    let refBody = document.getElementsByTagName('body')[0]
    let refModal = document.getElementById(id)
    let performAction = false

    if (typeof event == 'undefined' || (event.target && event.target.getAttribute('id') == id)) {
        if (show) {
            refBody.style.overflow = 'hidden'
            refModal.style.display = 'flex'
            await promiseWaitUntilPropertyValue(refModal, 'display', 'flex')  
            refModal.style.opacity = '1'
            refModal.querySelector('.modalWindow').style.transform = 'translateY(0)'
        } else {
            refModal.style.opacity = '0'
            refModal.querySelector('.modalWindow').style.transform = 'translateY(-100vh)'
            await promiseWait(300)
            refBody.style.overflow = 'initial'
            refModal.style.display = 'none'
        }
    }
}`
        }

        if (bodyStr.indexOf('setDrawer') >= 0 || bodyStr.indexOf('setModal') >= 0) {
            str = str + `
async function promiseWait (time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, time)
    })
}
async function promiseWaitUntilPropertyValue (ref, property, value) {
    let style = window.getComputedStyle(ref)
    let now = style.getPropertyValue(property)
    if (now != value) {
        await this.promiseWait(1)
        await this.promiseWaitUntilPropertyValue(ref, property, value)
    }
}`
        }

        if (bodyStr.indexOf('form') >= 0) {
            str = str + `
function getForm (id) {
    let ref = document.getElementById(id)
    let type = (ref.tagName).toLowerCase()
    if (type == 'input') {
        type = (ref.getAttribute('type')).toLowerCase()
    }
    switch (type) {
    case 'text':
    case 'textarea':
    case 'range':
        return ref.value
    case 'checkbox':
    case 'radio':
        return ref.checked
    case 'select':
        // ref.options[ref.selectedIndex].text
        return ref.value
    }
}

function setForm (id, value) {
    let ref = document.getElementById(id)
    let type = (ref.tagName).toLowerCase()
    if (type == 'input') {
        type = (ref.getAttribute('type')).toLowerCase()
    }
    switch (type) {
    case 'text':
    case 'textarea':
    case 'range':
    case 'select':
        ref.value = value
        break
    case 'checkbox':
    case 'radio':
        ref.checked = value
        break
    }
}`
        }

        if (bodyStr.indexOf('') >= 0) {
            str = str + ``
        }

        return str
    }

    getHTML (fontsList, scriptsList, styleStr, scriptsStr, bodyStr) {

        return `<html>
<head>
    <meta charset="utf-8"/>
    <title>${app.capitalize(app.siteName)}</title>
    <meta name="viewport" content="width=device-width, user-scalable=no">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;800&display=swap" rel="stylesheet">${fontsList}
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">${scriptsList}
</head>
<style>${styleStr}
</style>
<script>${scriptsStr}
</script>
${bodyStr}
</html>`
    }
    getWidgetUploadStr () {
    return `
let cssWgtUpload=\`
.root { --accent: rgb(0, 155, 255); --accent-over: rgb(25, 180, 255); --accent-background: #e8f6fe; border: solid 2px grey; border-radius: 10px; box-sizing: border-box; height: 100%; padding: 8px; position: relative; user-select: none; width: 100%; }
.root[data-add="true"]:hover { background-color: var(--accent-background); border: solid 2px var(--accent); color: var(--accent); cursor: pointer; }
.dragOver { background-color: var(--accent-background); border: solid 2px var(--accent); }
.hide { display: none !important; }
.root > div { align-items: center; box-sizing: border-box; display: flex; flex-direction: column; height: 100%; justify-content: center; text-align: center; width: 100%; }
[data-ref='uploadingTitle'] { color: grey; font-size: 12px; }
[data-ref='uploadingBox'] { background-color: lightgrey; border-radius: 5px; height: 5px; width: 100%; }
[data-ref='uploadingProgressBar'] { background-color: var(--accent); border-radius: 5px; height: 5px; min-width: 5%; width: 0; }
[data-ref='uploadingProgressValue'] { display: inline-block; min-width: 48px; text-align: right; }
[data-ref='uploadingName'] { color: black; font-size: 14px;  overflow: hidden; max-width: 100%; min-height: 19px; text-overflow: ellipsis; white-space: nowrap; }
[data-ref='cancel'] { background-color: #f0f0f0; border-radius: 5px; position: absolute; bottom: 5px; }
[data-ref='cancel']:hover { background-color: #f5f5f5; }
[data-ref='msgDone'] { background-position: center; background-repeat: no-repeat; background-size: contain; background-image: unset; }
\`
let htmlWgtUpload=\`
<div class='root'>
    <input data-ref='input' type="file" style="display:none;" accept="image/*"/>
    <div data-ref='msgAdd' class='hide'>
        <br>Add images
    </div>
    <div data-ref='uploading'>
        <div data-ref='uploadingTitle'>Uploading... <div data-ref='uploadingProgressValue'></div></div>
        <div data-ref='uploadingBox'>
            <div data-ref='uploadingProgressBar'></div>
        </div>
        <div data-ref='uploadingName'></div>
        <wgt-clickable data-ref='cancel'>
            Cancel upload
        </wgt-clickable>
    </div>
    <div data-ref='msgCancel' class='hide'>Upload cancelled</div>
    <div data-ref='msgError' class='hide'>Error, could not upload file</div>
    <div data-ref='msgDone' class='hide'></div>
</div>\`
class WgtUpload extends HTMLElement {

    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })

        this.showing = ''
        this.cancel = false
        this.isUploading = false
        this._value = ''
    }

    set value (value) {
        this._value = value
        if (value == '') {
            this.showElement('msgAdd')
        } else {
            this.refMsgDone.style.backgroundImage = \`url("\${this.value}")\`
        }
    }

    get value () {
        return this._value
    }

    async connectedCallback () {

        this.shadow.innerHTML = htmlWgtUpload
        this.elmStyle = document.createElement('style')
        this.elmStyle.textContent = cssWgtUpload
        this.shadow.appendChild(this.elmStyle)
        
        this.refRoot = this.shadow.querySelector('.root')
        this.innerHTML = ''

        this.setReferences()

        this.refInput.addEventListener('change', () => {
            this.fileUpload(this.refInput.files[0])
        })
        
        this.refRoot.addEventListener('click', (event) => {
            if (this.showing != 'msgAdd' && this.showing != 'msgDone') return
            this.refInput.click()
        })
        this.refRoot.addEventListener('dragover', (event) => {
            event.preventDefault()
            if (this.showing != 'msgAdd' && this.showing != 'msgDone') return
            this.refRoot.classList.add('dragOver')
        })
        this.refRoot.addEventListener('dragleave', (event) => {
            if (this.showing != 'msgAdd' && this.showing != 'msgDone') return
            this.refRoot.classList.remove('dragOver')
        })
        this.refRoot.addEventListener('drop', (event) => {
            event.preventDefault()
            event.stopPropagation()
            if (this.showing != 'msgAdd' && this.showing != 'msgDone') return
            this.refRoot.classList.remove('dragOver')
            if(event.dataTransfer.files[0]) {
                this.fileUpload(event.dataTransfer.files[0])
            }
        })

        this.refCancel.addEventListener('click', (event) => {
            event.stopPropagation()
            this.cancelUploading()
        })

        this.showElement('msgAdd')
    }

    setReferences () {
        this.refRoot = this.shadow.querySelector('.root')
        let elements = this.refRoot.querySelectorAll('[data-ref]')
        for (let cnt  = 0; cnt < elements.length; cnt = cnt + 1) {
            let element = elements[cnt]
            let name = element.getAttribute('data-ref')
            eval(\`this.ref\${this.upperCase(name)} = this.refRoot.querySelector('[data-ref="\${name}"]')\`)
        }
    }

    async fileUpload(file) {
        if (file) {
            try {
                await this.cancelUploading()
                this.showElement('uploading')
                await this.parseFileReadBlock(0, file, async (offset, size, data) => {
                    await this.uploadChunk({ name: file.name, offset: offset, size: size, chunk: data })
                })
                await this.setLoaded(file.name)
                this.value = '/images/' + file.name
                this.showElement('msgDone')
            } catch (err) {
                if (err == 'cancelled') {
                    this.setCancel(file.name)
                } else {
                    this.setError(file.name) 
                }
            }
        }
    }

    showElement (ref) {

        this.showing = ref

        if (ref != 'msgAdd')    this.refMsgAdd.classList.add('hide')
        if (ref != 'uploading') this.refUploading.classList.add('hide')
        if (ref != 'msgCancel') this.refMsgCancel.classList.add('hide')
        if (ref != 'msgError')  this.refMsgError.classList.add('hide')
        if (ref != 'msgDone')  this.refMsgDone.classList.add('hide')

        if (ref == 'msgAdd')    this.refMsgAdd.classList.remove('hide')
        if (ref == 'uploading') this.refUploading.classList.remove('hide')
        if (ref == 'msgCancel') this.refMsgCancel.classList.remove('hide')
        if (ref == 'msgError')  this.refMsgError.classList.remove('hide')
        if (ref == 'msgDone')  this.refMsgDone.classList.remove('hide')

        if (ref == 'msgAdd') {
            this.refRoot.setAttribute('data-add', 'true')
            this.refMsgDone.style.backgroundImage = 'unset'
            this.refInput.value = ''
        } else {
            this.refRoot.removeAttribute('data-add')
        }

        if (ref == 'msgDone') {
            this.refMsgDone.style.backgroundImage = \`url("\${this.value}")\`
        }
    }

    wait (time) {
        return new Promise((resolve, reject) => {
            setTimeout(() => { resolve() }, time)
        })
    }

    async bytesToBase64(bytes) {
        let result = ''
        let i = 0
        let preventBlocking = 100000
        let length = bytes.length

        let base64abc = [
            "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
            "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
            "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
            "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
            "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "/"
        ]
        for (i = 2; i < length; i += 3) {
            result += base64abc[bytes[i - 2] >> 2]
            result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)]
            result += base64abc[((bytes[i - 1] & 0x0F) << 2) | (bytes[i] >> 6)]
            result += base64abc[bytes[i] & 0x3F]
            if ((i % preventBlocking) == 0) { await this.wait(2) }
        }
        if (i === length + 1) {
            result += base64abc[bytes[i - 2] >> 2]
            result += base64abc[(bytes[i - 2] & 0x03) << 4]
            result += "==";
        }
        if (i === length) {
            result += base64abc[bytes[i - 2] >> 2]
            result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)]
            result += base64abc[(bytes[i - 1] & 0x0F) << 2]
            result += "="
        }
        return result
    }

    async cancelUploading () {
        this.cancel = true
        while (this.isUploading) await this.wait(1)
    }

    async parseFileReadBlock (offset, file, onRead) {
        if (offset == 0) {
            this.cancel = false
            this.isUploading = true
        }
        return new Promise((resolve, reject) => {
            let chunkSize = 256 * 1024
            let reader = new FileReader()
            var blob = file.slice(offset, chunkSize + offset)
            reader.addEventListener('load', async (event) => {
                if (event.target.error) {
                    this.isUploading = false
                    reject(event.target.error)
                } else {
                    try {
                        await onRead(offset, file.size, event.target.result)
                        offset += event.target.result.byteLength
                        if (offset >= file.size) {
                            this.isUploading = false
                            resolve()
                        } else {
                            if (this.cancel) {
                                this.isUploading = false
                                reject('cancelled')
                            } else {
                                try {
                                    await this.wait(1)
                                    await this.parseFileReadBlock(offset, file, onRead)
                                    this.isUploading = false
                                    resolve()
                                } catch (err) {
                                    this.isUploading = false
                                    return reject(err)
                                }
                                
                            }
                        } 
                    } catch (err) {
                        reject(err)
                    }
                }
            })
            reader.addEventListener('error', (err) => {
                reject(err)
            })
            reader.readAsArrayBuffer(blob)
        })
    }

    async uploadChunk (part) {
        let percentage = parseFloat(parseFloat((part.offset * 100) / part.size).toFixed(1))

        let obj = {
            type: 'uploadFileChunk',
            fileName: part.name,
            offset: part.offset,
            chunk: await this.bytesToBase64(new Uint8Array(part.chunk)),
            logInId: localStorage.getItem('id'),
            logInToken: localStorage.getItem('token')
        }
        let response = {}
        try {
            response = JSON.parse(await this.callServer('POST', '/query', obj))
        } catch (e) {
            throw(e) 
        }

        this.setLoading(part.name, percentage)
    }

    setLoading (fileName, percentage) {
        this.refUploadingProgressBar.style.width = percentage + '%'
        this.refUploadingProgressValue.innerHTML = percentage + '%'
        this.refUploadingName.innerHTML = fileName
    }

    async setLoaded (fileName) {
        let obj = {
            type: 'uploadFileDone',
            fileName: fileName,
            logInId: localStorage.getItem('id'),
            logInToken: localStorage.getItem('token')
        }
        this.setLoading(fileName, 100)
        let response = {}
        try {
            response = JSON.parse(await this.callServer('POST', '/query', obj))
        } catch (e) {
            console.log(e)
        }
        await this.wait(500)
        if (response.status == 'ok') {
            this.showElement('msgAdd')
        } else {
            this.setError(fileName)
        }
    }

    async setCancel (fileName) {
        let obj = {
            type: 'uploadFileError',
            fileName: fileName,
            logInId: localStorage.getItem('id'),
            logInToken: localStorage.getItem('token')
        }
        let response = {}
        try {
            response = JSON.parse(await this.callServer('POST', '/query', obj))
        } catch (e) {
            console.log(e)
        }
        this.showElement('msgCancel')
        await this.wait(1500)
        this.showElement('msgAdd')
    } 

    async setError (fileName) {
        let obj = {
            type: 'uploadFileError',
            fileName: fileName,
            logInId: localStorage.getItem('id'),
            logInToken: localStorage.getItem('token')
        }
        let response = {}
        try {
            response = JSON.parse(await this.callServer('POST', '/query', obj))
        } catch (e) {
            console.log(e)
        }
        this.showElement('msgError')
        await this.wait(1500)
        this.showElement('msgAdd')
    }

    upperCase (str) {
        return str.charAt(0).toUpperCase() + str.substring(1)
    }

    async callServer (method, url, obj, onProgressCall) {
        return new Promise((resolve, reject) => {
            let req = new XMLHttpRequest()
            req.onreadystatechange = (res) => {
                let response = null
                if (req.readyState === 4) {
                    response = req.responseText
                    if (req.status >= 200 && req.status < 300) {
                        return resolve(response)
                    } else {
                        return reject(response)
                    }
                }
            }
            if (onProgressCall) {
                req.onprogress = (event) => {
                    onProgressCall(event.loaded, event.total)
                }
            }
            req.open(method, url, true)
            req.send(JSON.stringify(obj))
        })
    }
}
customElements.define("wgt-upload", WgtUpload)`
    }
}
