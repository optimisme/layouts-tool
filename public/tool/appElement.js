class AppElement {

    constructor (parent) {

        this.selected = false
        this.parent = parent

        this.appId = app.counter++
        this.typeName = ''
        this.description = ''
        this.styleName = ''
        this.childsAllowed = 'all'

        this.tag = 'div'
        this.text = ''
        this.style = []
        this.phone = []
        this.attributes = []
        this.childs = []

        this.refList = null
        this.expanded = false
        this.refPreview = null
    }

    async init () {

        if (parent == null) {
            this.typeName = 'body'
            this.tag = 'body'
            this.description = 'Body'
            this.childsAllowed = 'all'
            this.refList = app.refList.shadow.querySelector('sdw-tool-list-item')
            this.refList.refApp = this
            this.refPreview = app.refPreviewBody
        }
    }

    toString () {

        let obj = {
            typeName: this.typeName,
            description: this.description,
            styleName: this.styleName,
            childsAllowed: this.childsAllowed,
            tag: this.tag,
            text: this.text,
            style: JSON.parse(JSON.stringify(this.style.filter((x) => { return x[1] != 'initial' && x[2] != false }))),
            phone: JSON.parse(JSON.stringify(this.phone.filter((x) => { return x[1] != 'initial' && x[2] != false }))),
            attributes: JSON.parse(JSON.stringify(this.attributes.filter((x) => { return x[1] != 'initial' && x[2] != false }))),
            childs: this.childs.map((x)=>{ return JSON.parse(x.toString()) })
        }

        return JSON.stringify(obj)
    }

    add (obj) {
        let pos = this.childs.push(new AppElement(this)) - 1
        let child = this.childs[pos]

        child.typeName = obj.typeName
        child.description = obj.description
        child.styleName = obj.styleName
        child.childsAllowed = obj.childsAllowed
        child.tag = obj.tag
        child.style = JSON.parse(JSON.stringify(obj.style))
        child.phone = JSON.parse(JSON.stringify(obj.phone))
        child.attributes = JSON.parse(JSON.stringify(obj.attributes))
        child.text = obj.text

        child.refList = this.refList.add(child)
        child.refPreview = app.refPreview.childAdd(this, child)

        if (obj.childs.length > 0) {
            for (let cnt = 0; cnt < obj.childs.length; cnt = cnt + 1) {
                child.add(obj.childs[cnt])
            }
        }
    }

    addTemplate (obj) {
        let pos = this.childs.push(new AppElement(this)) - 1
        let child = this.childs[pos]
        let base = app.getNamedObject(obj.typeName)

        let arrStyle = this.mixArrays(base.style, obj.style)
        let arrPhone =  this.mixArrays(base.phone, obj.phone)
        let arrAttributes = this.mixArrays(base.attributes, obj.attributes)

        child.typeName = obj.typeName
        child.description = obj.description
        child.styleName = obj.styleName
        child.childsAllowed = obj.childsAllowed
        child.tag = obj.tag
        child.style = arrStyle
        child.phone = arrPhone
        child.attributes = arrAttributes
        child.text = obj.text

        child.refList = this.refList.add(child)

        child.refPreview = app.refPreview.childAdd(this, child)

        if (obj.childs.length > 0) {
            for (let cnt = 0; cnt < obj.childs.length; cnt = cnt + 1) {
                child.addTemplate(obj.childs[cnt])
            }
        }
    }

    remove (child) {
        this.refList.remove(child.refList)
        app.refPreview.remove(this, child)
        this.childs.splice(this.childs.indexOf(child), 1)
        this.refList.setChildsHeight()
    }

    select () {
        this.selected = true
        this.refList.select()

        app.refPreview.childSelect(this)
    }

    unselect () {
        this.selected = false
        this.refList.unselect()
        app.refPreview.childUnselect(this)
    }

    setText (value) {
        this.text = value
        app.refPreview.setText(this, value)
    }

    setDescription (value) {

        this.description = value

        this.refList.setDescription(value)
        app.refPreview.setDescription(this, value)
    }

    setStyle (name, value) {

        let positionDestop = -1

        positionDestop = app.getPropertyPosition(this.style, name)

        this.style[positionDestop][1] = value

        let classStr = (this.refPreview.getAttribute('class'))
        let classArr = classStr.split(' ')
        let refStyle = app.refPreviewBody.querySelector(`style[id="${classArr[0]}"]`)
        if (refStyle == null) {
            refStyle = document.createElement('style')
            refStyle.setAttribute('id', 'css' + this.appId)
            refStyle.innerHTML = this.getStyleString()
            app.refPreviewBody.appendChild(refStyle)
            console.log('<', classArr)
            this.refPreview.setAttribute('class', `css${this.appId} ` + classArr.join(' '))
        } else {
            refStyle.innerHTML = this.getStyleString()
        }
    }

    setStylePhone (name, value) {

        let positionPhone = -1

        positionPhone = app.getPropertyPosition(this.phone, name)

        this.phone[positionPhone][1] = value

        let classStr = (this.refPreview.getAttribute('class'))
        let classArr = classStr.split(' ')
        let refStyle = app.refPreviewBody.querySelector(`style[id="${classArr[0]}"]`)
        if (refStyle == null) {
            refStyle = document.createElement('style')
            refStyle.setAttribute('id', 'css' + this.appId)
            refStyle.innerHTML = this.getStyleString()
            app.refPreviewBody.appendChild(refStyle)
            this.refPreview.setAttribute('class', `css${this.appId} ` + classArr.join(' '))
        } else {
            refStyle.innerHTML = this.getStyleString()
        }
    }

    getStyleString () {
        let styleStr = ''
        let styleStrPhone = ''

        for (let cnt = 0; cnt < this.style.length; cnt = cnt + 1) {
            let propertyName = this.style[cnt][0]
            let propertyValueDesktop = this.style[cnt][1]
            if (this.style[cnt][1] != 'initial') {
                if (propertyValueDesktop != 'initial') {
                    styleStr = styleStr + propertyName + ':' + this.style[cnt][1] + ';'
                }
            }

            let phonePropretyPosition = app.getPropertyPosition(this.phone, propertyName)
            if (phonePropretyPosition >= 0) {
                let propertyValuePhone = this.phone[phonePropretyPosition][1]
                if (propertyValuePhone != 'initial') {
                    styleStrPhone = styleStrPhone + propertyName + ':' + propertyValuePhone + ';'
                }
            }
        }
        if (styleStr.length > 0) {
            styleStr = `.css${this.appId} { ${styleStr} }`
        }
        if (styleStrPhone.length > 0) {
            styleStr += `\n@media only screen and (max-width: 768px) { .css${this.appId} { ${styleStrPhone} } }`
        }

        return styleStr
    }

    setAttribute (name, value) {

        let position = app.getPropertyPosition(this.attributes, name)

        this.attributes[position][1] = value

        if (value != 'initial') {
            this.refPreview.setAttribute(name, value)
        } else {
            this.refPreview.removeAttribute(name)
        }
    }

    moveUp (child) {
        let position = child.getPosition()

        let tmp = this.childs[position - 1]
        this.childs[position - 1] = this.childs[position]
        this.childs[position] = tmp

        app.refList.rebuild()
        app.refPreview.rebuild()

        app.select(this.childs[position - 1])
    }

    moveDown (child) {
        let position = child.getPosition()
        let tmp = this.childs[position + 1]
        this.childs[position + 1] = this.childs[position]
        this.childs[position] = tmp

        app.refList.rebuild()
        app.refPreview.rebuild()

        app.select(this.childs[position + 1])
    }

    getPosition () {
        return this.parent.childs.indexOf(this)
    }


    isChildOf (ref) {
        if (this.parent == null) {
            return false
        }
        if (this == ref) {
            return true
        }
        return this.parent.isChildOf(ref)
    }

    mixArrays (arrBase, arrValues) {
        let arr = JSON.parse(JSON.stringify(arrBase))

        for (let cnt = 0; cnt < arr.length; cnt = cnt + 1) {
            let property = arr[cnt][0]
            let newValue = this.mixarraysGetValue(arrValues, property)
            if (newValue != 'initial') {
                arr[cnt][1] = newValue
            }
        }

        return arr
    }

    mixarraysGetValue (arrValues, property) {
        let arrFiltered = arrValues.filter((x) => { return x[0] == property })

        if (arrFiltered.length == 1) {
            return arrFiltered[0][1]
        } else {
            return 'initial'
        }
    }

    deleteFont (name) {

        for (let cnt = 0; cnt < this.style.length; cnt = cnt + 1) {
            if (this.style[cnt][0] == 'font-family' && this.style[cnt][1] == name) {
                this.setStyle('font-family', 'initial')
            }
        }

        for (let cnt = 0; cnt < this.phone.length; cnt = cnt + 1) {
            if (this.phone[cnt][0] == 'font-family' && this.phone[cnt][1] == name) {
                this.setStylePhone('font-family', 'initial')
            }
        }

        for (let cnt = 0; cnt < this.childs.length; cnt = cnt + 1) {
            this.childs[cnt].deleteFont(name)
        }
    }
}