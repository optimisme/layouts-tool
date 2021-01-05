let appTypeNames = [
    'divAutocenter', 'div', 
    'divFlex', 'divStack',
    'divSticky', 'divMobile', 'divDesktop',
    'titleh1', 'titleh2', 'titleh3', 'text', 'textInline', 'textEllipsis', 'linkBox', 'linkInline',
    'image', 'imageBackground', 
]

let appTemplateNames = [
    'templateSeparator000', 'templateSeparator001', 'templateSeparator002', 'templateSeparator003', 'templateSeparator004',
    'templateTitle000', 'templateTitle001', 
    'templateText000', 'templateText001', 'templateText002', 'templateText003', 'templateText004', 'templateText005', 'templateText006', 'templateText007',
    'templateImage000', 'templateImage001', 'templateImage002', 'templateImage003', 'templateImage004', 'templateImage005',
    'templatePro000', 'templatePro001', 'templatePro002', 'templatePro003', 'templatePro004'
]

class App {

    constructor () {
        this.handler = this.init.bind(this)
        window.addEventListener('load', this.handler)
    }

    init () {
        customElements.define('sdw-tool-list', SdwToolList)
        customElements.define('sdw-tool-list-item', SdwToolListItem)
        customElements.define('sdw-tool-preview', SdwToolPreview)
        customElements.define('sdw-tool-settings', SdwToolSettings)
        customElements.define('sdw-tool-popup', SdwToolPopup)

        customElements.define('sdw-config', SdwConfig)
        customElements.define('sdw-config-select', SdwConfigSelect)
        customElements.define('sdw-config-select-costum', SdwConfigSelectCustom)

        this.styleNames = []
        this.refSelected = null

        this.refList = document.querySelector('sdw-tool-list')
        this.refPreview = document.querySelector('sdw-tool-preview')
        this.refSettings = document.querySelector('sdw-tool-settings')

        this.elementsRoot = new AppElement(null, 'body')
        this.select(this.elementsRoot)
    }

    wait (time) {
        return new Promise((resolve, reject) => {
            setTimeout(() => { resolve() }, time)
        })
    }

    setSettings () {

    }

    getNamedObject (name) {

        return eval(name)
    }

    add (type) {
        let obj = this.getNamedObject(type)
        if (this.refSelected != null) {
            this.refSelected.add(obj)
        }
        app.refPreview.scrollToBottom()
    }

    addTemplate (type) {
        let obj = this.getNamedObject(type)
        if (this.refSelected != null) {
            this.refSelected.addTemplate(obj.childs[0])
        }
        app.refPreview.scrollToBottom()
    }

    duplicate () {
        if (this.refSelected != null) {
            this.refSelected.parent.addTemplate(JSON.parse(this.refSelected.toString()))
        }
    }

    remove () {
        if (this.refSelected != null && this.refSelected.parent !== null) {
            this.refSelected.parent.remove(this.refSelected)
            this.unselect()
        }
    }

    moveUp () {
        if (this.refSelected != null) {
            this.refSelected.parent.moveUp(this.refSelected)
        } 
    }

    moveDown () {
        if (this.refSelected != null) {
            this.refSelected.parent.moveDown(this.refSelected)
        } 
    }

    select (ref) {
        let position = -1;
        let limit = 0

        if (this.refSelected != null) {
            this.refSelected.unselect()
        }
        this.refSelected = ref
        this.refSelected.select()

        if (this.refSelected.parent != null) {
            position = this.refSelected.getPosition()
            limit = this.refSelected.parent.childs.length - 1
        }

        if (this.refSelected.childsAllowed != 'none') {
            this.refList.setButtonAdd(true)
        } else {
            this.refList.setButtonAdd(false)
        }
        if (this.refSelected.parent != null) {
            this.refList.setButtonDuplicate(true)
        } else {
            this.refList.setButtonDuplicate(false)
        }

        if (this.refSelected.parent == null) {
            this.refList.setButtonTemplates(true)
        } else {
            this.refList.setButtonTemplates(false)
        }

        if (this.refSelected.parent != null && position > 0) {
            this.refList.setButtonUp(true)
        } else {
            this.refList.setButtonUp(false)
        }
        if (this.refSelected.parent != null && position < limit) {
            this.refList.setButtonDown(true)
        } else {
            this.refList.setButtonDown(false)
        }
        if (this.refSelected.parent != null) { 
            this.refList.setButtonDelete(true)
        } else {
            this.refList.setButtonDelete(false)
        }

        this.refSettings.setSettings(this.refSelected)
    }

    unselect () {
        if (this.refSelected != null) {
            this.refSelected.unselect()
        }
        this.refSelected = null
        this.refList.setButtonAdd(false)
        this.refList.setButtonDuplicate(false)
        this.refList.setButtonTemplates(false)
        this.refList.setButtonUp(false)
        this.refList.setButtonDown(false)
        this.refList.setButtonDelete(false)

        this.refSettings.emptySettings()
    }

    setVisualization (type) {
        this.refPreview.setVisualization(type)
    }

    styleNameExists (name) {
        return (this.styleNames.indexOf(name) >= 0)
    }

    getRandomStyleName () {
        let name = 'happyFox'
        let adjectives = ['able', 'bad', 'best', 'better', 'big', 'black', 'certain', 'clear', 'different', 'early', 'easy', 'economic', 'federal', 'free', 'full', 'good', 'great', 'hard', 'high', 'human', 'important', 'international', 'large', 'late', 'little', 'local', 'long', 'low', 'major', 'national', 'new', 'old', 'only', 'other', 'political', 'possible', 'public', 'real', 'recent', 'right', 'small', 'social', 'special', 'strong', 'sure', 'true', 'white', 'whole', 'young']
        let animals = ['Monkey', 'Panda', 'Shark', 'Zebra', 'Gorilla', 'Walrus', 'Leopard', 'Wolf', 'Antelope', 'Eagle', 'Jellyfish', 'Crab', 'Giraffe', 'Woodpecker', 'Camel', 'Starfish', 'Koala', 'Alligator', 'Owl', 'Tiger', 'Bear', 'Whale', 'Coyote', 'Chimpanzee', 'Raccoon', 'Lion', 'Wolf', 'Crocodile', 'Dolphin', 'Elephant', 'Squirrel', 'Snake', 'Kangaroo', 'Hippopotamus', 'Elk', 'Rabbit', 'Fox', 'Gorilla', 'Bat', 'Hare', 'Toad', 'Frog', 'Deer', 'Rat', 'Badger', 'Lizard', 'Mole', 'Hedgehog', 'Otter', 'Reindeer']

        while (this.styleNameExists(name)) {
            name = adjectives[parseInt(Math.random() * (adjectives.length - 1))] + animals[parseInt(Math.random() * (animals.length - 1))]
        }
        this.styleNames.push(name)
        return name
    }

    getPropertyPosition (arr, name) {
        let position = -1

        for (let cnt = 0; cnt < arr.length; cnt = cnt + 1) {
            if (arr[cnt][0] == name) {
                position = cnt
                break
            }
        }

        return position
    }

    downloadWebtemplate () {
        let element = document.createElement('a');

        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(app.elementsRoot.toString()));
        element.setAttribute('download', 'webtemplate.json');
      
        element.style.display = 'none';
        document.body.appendChild(element);
      
        element.click();
      
        document.body.removeChild(element);
    }

    uploadWebtemplate (ref) {
        let file = ref.files[0]
        let reader = new FileReader()

        if (!file) { return }

        reader.onload = (e) => {
            try {
                let obj = JSON.parse(e.target.result)

                while (this.elementsRoot.childs.length > 0) {
                    this.elementsRoot.remove(this.elementsRoot.childs[0])
                }

                for (let cnt = 0; cnt < obj.childs.length; cnt = cnt + 1) {
                    this.elementsRoot.addTemplate(obj.childs[cnt])
                }
                this.select(this.elementsRoot)

            } catch (e) {
                console.error('Could not parse file')
                console.log(e)
            }
        }
        
        reader.readAsText(file)
    }
}

let app = null
window.addEventListener('DOMContentLoaded', () => { app = new App() })

class AppElement {

    constructor(parent) {

        this.selected = false
        this.parent = parent

        this.typeName = ''
        this.description = ''
        this.styleName = ''
        this.childsAllowed = 'all'

        this.tag = 'div'
        this.style = []
        this.phone = []
        this.attributes = []
        this.text = ''
        this.script = ``
        this.childs = []

        this.refList = null
        this.refPreviewDestop = null
        this.refPreviewPhone = null

        if (parent == null) {
            this.childsAllowed = 'all'
            this.refList = app.refList.shadow.querySelector('sdw-tool-list-item')
            this.refList.refApp = this
            this.refPreviewDesktop = app.refPreview.shadow.querySelector('div[name="contentDesktop"]')
            this.refPreviewPhone = app.refPreview.shadow.querySelector('div[name="contentPhone"]')
        }
    }

    toString () {

        return JSON.stringify({
            typeName: this.typeName,
            description: this.description,
            styleName: this.styleName,
            childsAllowed: this.childsAllowed,
            tag: this.tag,
            style: JSON.parse(JSON.stringify(this.style.filter((x) => { return x[1] != 'initial' && x[2] != false }))),
            phone: JSON.parse(JSON.stringify(this.phone.filter((x) => { return x[1] != 'initial' && x[2] != false }))),
            attributes: JSON.parse(JSON.stringify(this.attributes.filter((x) => { return x[1] != 'initial' && x[2] != false }))),
            childs: this.childs.map((x)=>{ return JSON.parse(x.toString()) }),
            text: this.text,
            script: this.srcript
        })
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
        child.script = obj.script
        child.text = obj.text

        child.refList = this.refList.add(child)

        let references = app.refPreview.childAdd(this, child)

        child.refPreviewDesktop = references[0]
        child.refPreviewPhone = references[1]

        child.refPreviewDesktop.setAttribute('data-desription', child.description)
        child.refPreviewPhone.setAttribute('data-desription', child.description)

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
        child.script = obj.script
        child.text = obj.text

        child.refList = this.refList.add(child)

        let references = app.refPreview.childAdd(this, child)

        child.refPreviewDesktop = references[0]
        child.refPreviewPhone = references[1]

        child.refPreviewDesktop.setAttribute('data-desription', child.description)
        child.refPreviewPhone.setAttribute('data-desription', child.description)

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
        let positionPhone = -1

        positionDestop = app.getPropertyPosition(this.style, name)
        positionPhone = app.getPropertyPosition(this.phone, name)

        this.style[positionDestop][1] = value
        this.refPreviewDesktop.style[name] = this.style[positionDestop][1]

        if (positionPhone >= 0) {
            if (this.phone[positionPhone][1] == 'initial') {
                this.refPreviewPhone.style[name] = this.style[positionDestop][1]
            } else {
                this.refPreviewPhone.style[name] = this.phone[positionPhone][1]
            }
        } else {
            this.refPreviewPhone.style[name] = this.style[positionDestop][1]
        }
    }

    setStylePhone (name, value) {

        let positionDestop = -1
        let positionPhone = -1

        positionDestop = app.getPropertyPosition(this.style, name)
        positionPhone = app.getPropertyPosition(this.phone, name)

        this.phone[positionPhone][1] = value

        if (this.phone[positionPhone][1] == 'initial') {
            this.refPreviewPhone.style[name] = this.style[positionDestop][1]
        } else {
            this.refPreviewPhone.style[name] = this.phone[positionPhone][1]
        }
    }

    setAttribute (name, value) {

        let position = app.getPropertyPosition(this.attributes, name)

        this.attributes[position][1] = value

        if (value != 'initial') {
            this.refPreviewDesktop.setAttribute(name, value)
            this.refPreviewPhone.setAttribute(name, value)
        } else {
            this.refPreviewDesktop.removeAttribute(name)
            this.refPreviewPhone.removeAttribute(name)
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
        for (let cnt = 0; cnt < this.parent.childs.length; cnt = cnt + 1) {
            let child = this.parent.childs[cnt]
            if (child == this) {
                return cnt
            }
        }
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
}