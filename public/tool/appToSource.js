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

        return this.getHTML(styleStr, scriptsStr, bodyStr)
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

        str = str + '\n' + ident + '<!-- ' + item.description + ' -->'
        str = str + '\n' + ident + '<' + item.tag + attributes + classStr + '>'

        for (let cnt = 0; cnt < item.childs.length; cnt = cnt + 1) {
            str = str + this.toSourceItem(item.childs[cnt])
        }

        if (item.text != '') {
            str = str + '\n  ' + ident + item.text
        }

        if (['body', 'div', 'a', 'h1', 'h2', 'h3', 'span', 'label', 'iframe', 'textarea'].indexOf(item.tag) >= 0) str = str + '\n' + ident + '</' + item.tag + '>'

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
body { background-color: #f2f4f7; font-family: 'Open Sans', sans-serif; margin: 0; padding: 0; }`

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

    getHTML (styleStr, scriptsStr, bodyStr) {

        return `<html>
<head>
    <meta charset="utf-8"/>
    <title>HTML tool</title>
    <meta name="viewport" content="width=device-width, user-scalable=no">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;800&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <script src="https://unpkg.com/ionicons@5.2.3/dist/ionicons.js"></script>
</head>
<style>${styleStr}
</style>
<script>${scriptsStr}
</script>
${bodyStr}
</html>`
    }
}