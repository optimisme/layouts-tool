let appTypeNames = [
    'divAutocenter', 'div', 
    'divFlex', 'divStack',
    'divSticky', 'divMobile', 'divDesktop',
    'titleh1', 'titleh2', 'titleh3', 'text', 'textInline', 'textEllipsis', 'linkBox', 'linkInline',
    'image', 'imageBackground', 'divGrid',
    'formInputText', 'formInputTextarea', 'formButton',
    'carouselDots', 'carouselArrows', 'drawer', 'iconMaterial', 'mapGoogle'
]

let appTemplateNames = [
    'templateDivider000', 'templateDivider001', 'templateDivider002', 'templateDivider003', 'templateDivider004',
    'templateTitle000', 'templateTitle001', 
    'templateText000', 'templateText001', 'templateText002', 'templateText003', 'templateText004', 'templateText005', 'templateText006', 'templateText007',
    'templateImage000', 'templateImage001', 'templateImage002', 'templateImage003', 'templateImage004', 'templateImage005',
    'templatePro000', 'templatePro001', 'templatePro002', 'templatePro003', 'templatePro004', 'templatePro005',
    'templateGrid000', 'templateMenu000', 'templateMenu001', 'templateContact000', 'templateContact001', 'templateSite000'
]

class App {

    constructor () {
        this.handler = this.init.bind(this)
        window.addEventListener('load', this.handler)
    }

    async init () {
        customElements.define('sdw-tool-list', SdwToolList)
        customElements.define('sdw-tool-list-item', SdwToolListItem)
        customElements.define('sdw-tool-preview', SdwToolPreview)
        customElements.define('sdw-tool-settings', SdwToolSettings)
        customElements.define('sdw-tool-popup', SdwToolPopup)

        customElements.define('sdw-config', SdwConfig)
        customElements.define('sdw-config-select', SdwConfigSelect)
        customElements.define('sdw-config-select-costum', SdwConfigSelectCustom)
        customElements.define('sdw-config-padding', SdwConfigPadding)

        this.counter = 0
        this.styleNames = []
        this.refSelected = null
        this.refDrag = null

        this.refList = document.querySelector('sdw-tool-list')
        this.refPreview = document.querySelector('sdw-tool-preview')
        this.refSettings = document.querySelector('sdw-tool-settings')

        while (!app.refPreview.elmRoot.querySelector('iframe').contentWindow.frameLoaded) { await promiseWait(1) }
        this.refPreviewBody = app.refPreview.elmRoot.querySelector('iframe').contentDocument.body

        this.elementsRoot = new AppElement(null, 'body')
        this.elementsRoot.init()
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
            app.refPreview.scrollToBottom()
        }
    }

    addTemplate (type) {
        let obj = this.getNamedObject(type)
        if (this.refSelected != null) {
            for (let cnt = 0; cnt < obj.childs.length; cnt = cnt + 1) {
                this.refSelected.addTemplate(obj.childs[cnt])
            }
            app.refPreview.scrollToBottom()
        }
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

    moveAt (newParent, child) {
        let newPosition = 0
        let childPosition = child.getPosition()
        newParent.childs.splice(newPosition, 0, child.parent.childs[childPosition]) // Add to newParent
        child.parent.childs.splice(childPosition, 1) // Remove chid
        child.parent = newParent

        app.refList.rebuild()
        app.refPreview.rebuild()

        this.select(child)
    }

    canDrag (desiredParent) {
        if (desiredParent == this.refDrag.parent || desiredParent == this.refDrag || desiredParent.isChildOf(this.refDrag)) {
            return false
        }
        if (desiredParent.childsAllowed == 'all' && this.refDrag.typeName.indexOf('Child') == -1) {
            return true
        }
        if (desiredParent.childsAllowed == this.refDrag.typeName) {
            return true
        }
        return false
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

    uploadWebtemplate (file) {
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

    toSource () {
        let obj = new Source()
        let element = document.createElement('a');

        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(obj.toSource()));
        element.setAttribute('download', 'template.html');
      
        element.style.display = 'none';
        document.body.appendChild(element);
      
        element.click();
      
        document.body.removeChild(element);
    }
}

let app = null
window.addEventListener('DOMContentLoaded', () => { app = new App() })

