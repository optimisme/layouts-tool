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

        let fontsStr = ''

        for (let cnt = 0; cnt < app.googleFonts.length; cnt = cnt + 1) {
            fontsStr = fontsStr + `\n    <link href="https://fonts.googleapis.com/css2?family=${app.googleFonts[cnt].replaceAll(' ', '+')}:wght@300;400;600;800&display=swap" rel="stylesheet">`
        }

        return this.getHTML(fontsStr, styleStr, scriptsStr, bodyStr)
    }

    toSourceItem (item) {

        let str = ''
        let ident = this.getSourceIdent(item.refList.ident)
        let attributes = this.getSourceAttributes(item)
        let classStr = ''
        
        let typeClassName = 'def' + this.capitalize(item.typeName)
        let itemClassName = 'elm' + item.appId
        let typeClassStr = ''
        let itemClassStr = ''
        let attrClassStr = this.getItemAttribute(item, 'class')

        let attributeId = this.getItemAttribute(item, 'id') 
        if (attributeId != '' && attributeId != 'initial') {
            itemClassName = 'elm' + this.capitalize(attributeId)
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

        str = str + '\n' + ident + '<' + item.tag + attributes + classStr + '>' + '<!-- ' + item.description + ' -->'

        for (let cnt = 0; cnt < item.childs.length; cnt = cnt + 1) {
            str = str + this.toSourceItem(item.childs[cnt])
        }

        if (item.text != '') {
            str = str + '\n  ' + ident + item.text
        }

        if (['textarea'].indexOf(item.tag) >= 0) str = str + '</' + item.tag + '>'
        if (['body', 'div', 'a', 'h1', 'h2', 'h3', 'span', 'label', 'iframe', 'select', 'option'].indexOf(item.tag) >= 0) str = str + '\n' + ident + '</' + item.tag + '>'

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

    capitalize (s) {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
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

        if (bodyStr.indexOf('formInputText') >= 0) {
            str = str + `
.formInputText { padding: 15px 0 0; position: relative; }
.formInputText > input { background: transparent; border: 0; border-bottom: 1px solid #d2d2d2; color: #212121; font-family: inherit; font-size: 16px; outline: 0; padding: 7px 0; transition: border-color 0.2s; width: 100%; }
.formInputText > input::placeholder { color: transparent; }
.formInputText > input:placeholder-shown ~ label { cursor: text; font-size: 16px; top: 20px; }
.formInputText > label, 
.formInputText > input:focus ~ label { color: #9b9b9b; display: block; font-size: 12px; position: absolute; top: 0; transition: 0.2s; }
.formInputText > input:focus ~ label { color: rgb(0, 125, 255); }
.formInputText > input:focus { border-bottom: 2px solid rgb(0, 125, 255); padding-bottom: 6px; }
.formInputText > input:valid ~ span { color: transparent; }
.formInputText > input:invalid ~ span { color: red; }`
        }

        if (bodyStr.indexOf('formInputTextarea') >= 0) {
            str = str + `
.formInputTextarea { padding: 15px 0 0; position: relative; }
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
.formSelect:after { border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid rgba(0, 0, 0, 0.12); content: ''; height: 0; padding: 0; pointer-events: none; position: absolute; right: 10px; top: 28px; width: 0; }
.formSelect > select { appearance: none; -webkit-appearance:none; background-color: transparent; border: none; border-bottom: 1px solid rgba(0,0,0, 0.12); border-radius: 0; font-family: inherit; padding: 0px 10px 10px 0; padding-top: 20px; position: relative; font-size: 18px; width: 100%; }
.formSelect > select:focus { border-bottom: 1px solid rgba(0,0,0, 0);  outline: none; }
.formSelect > label { color: rgba(0,0,0, 0.26); font-size: 18px; font-weight: normal; left: 0; position: absolute; pointer-events: none; top: 15px; transition: 0.2s ease all; }
.formSelect > select:focus ~ label, .formSelect > select:valid ~ label {  color: #2F80ED; top: 0px; transition: 0.2s ease all; }
.formSelect > span:nth-child(2) { height: 60%; left: 0; opacity: 0.5; pointer-events: none; position: absolute; top: 25%; width: 100px; }
.formSelect > span:nth-child(3) { display: block; position: relative; width: 100%; }
.formSelect > span:nth-child(3):before, .formSelect > span:nth-child(3):after { background: #2F80ED; bottom: 1px; content: ''; height: 2px; position: absolute; transition: 0.2s ease all; width: 0; }
.formSelect > span:nth-child(3):before { left: 50%; }
.formSelect > span:nth-child(3):after { right: 50%; }
.formSelect > select:focus ~ span:nth-child(3):before, .formSelect > select:focus ~ span:nth-child(3):after { width: 50%; }`
        }

        return str
    }

    getPredefinedScripts (bodyStr) {

        let str = ''

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
async function setDrawer (event, id, show) {
    let refBody = document.getElementsByTagName('body')[0]
    let refDrawer = document.getElementById(id)

    if (typeof event !== 'undefined' && typeof event.stopPropagation === 'function') {
        if (event.cancelable) event.preventDefault()
        event.stopPropagation()
        target = event.target
        if (target.className != 'drawer') return
    }

    if (show) {
        refBody.style.overflow = 'hidden'
        refDrawer.style.display = 'flex'
        await promiseWaitUntilPropertyValue(refDrawer, 'display', 'flex')  
        refDrawer.style.opacity = '1'
        refDrawer.querySelector('.drawerSide').style.transform = 'translate3d(0px, 0, 0)'
    } else {
        refDrawer.style.opacity = '0'
        refDrawer.querySelector('.drawerSide').style.transform = 'translate3d(-250px, 0, 0)'
        await promiseTransitionEnd(refDrawer)
        refBody.style.overflow = 'initial'
        refDrawer.style.display = 'none'
    }
}
async function promiseWait (time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, time)
    })
}
function promiseWaitUntilPropertyValue (ref, property, value) {
    return new Promise(async (resolve, reject) => {
        let style = window.getComputedStyle(ref)
        let now = style.getPropertyValue(property)

        if (now === value) {
            resolve()
        } else {
            await promiseWait(1)
            await promiseWaitUntilPropertyValue(ref, property, value)
        }
    }) 
}
function promiseTransitionEnd (ref) {
    return new Promise(async (resolve, reject) => {
        ref.addEventListener('transitionend', () => {
            resolve()
        })
    })  
}`
        }

        if (bodyStr.indexOf('') >= 0) {
            str = str + ``
        }

        return str
    }

    getHTML (fontsStr, styleStr, scriptsStr, bodyStr) {

        return `<html>
<head>
    <meta charset="utf-8"/>
    <title>${this.capitalize(app.siteName)}</title>
    <meta name="viewport" content="width=device-width, user-scalable=no">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;800&display=swap" rel="stylesheet">${fontsStr}
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<style>${styleStr}
</style>
<script>${scriptsStr}
</script>
${bodyStr}
</html>`
    }
}