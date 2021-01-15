let appTypeNames = [
    'divAutocenter', 'div', 
    'divFlex', 'divStack',
    'divSticky', 'divMobile', 'divDesktop',
    'titleh1', 'titleh2', 'titleh3', 'text', 'textInline', 'textEllipsis', 'linkBox', 'linkInline',
    'image', 'imageBackground', 'divGrid',
    'formInputText', 'formInputTextarea', 'formInputSelect', 'formInputCheckbox', 'formInputRadio', 'formInputRange', 'formButton', 
    'waitSpinner', 'waitProgressUnknown',
    'carouselDots', 'carouselArrows', 'drawer', 'iconMaterial', 'mapGoogle'
]

let appTemplates = {
    templateDivider000: 'Divider 64px empty',
    templateDivider001: 'Divider 32px empty',
    templateDivider002: 'Divider 64px lined',
    templateDivider003: 'Divider 64px text',
    templateDivider004: 'Divider 64px shadow',
    templateTitle000: 'Title with subtitle',
    templateTitle001: 'Title with subtitle in flex',
    templateText000: 'Text sized in flex',
    templateText001: 'Text sized in flex with background',
    templateText002: 'Left title, right text',
    templateText003: 'Left title, text and right hint',
    templateText004: 'Text and right hint',
    templateText005: '50% texts with title',
    templateText006: '25% texts with title, flex-start',
    templateText007: '25% texts with title, stretch',
    templateImage000: 'Image full size',
    templateImage001: 'Text and Polaroid picture',
    templateImage002: 'Text and vintage picture',
    templateImage003: 'Picture and text',
    templateImage004: 'Picture and text with background',
    templateImage005: 'Columns: Image, H3 and text',
    templateCards000: 'Cards',
    templatePro000: 'Background image, with centered texts',
    templatePro001: 'Background fixed image, centered texts',
    templatePro002: 'Background image, right boxed texts',
    templatePro003: 'Background image, left boxed texts',
    templatePro004: 'Background image, bottom boxed texts',
    templatePro005: 'Carousel images with texts',
    templateGrid000: 'Grid',
    templateMenu000: 'Menu with mobile drawer',
    templateMenu001: 'Menu sticky with mobile drawer',
    templateFooter000: 'Footer',
    templateForm000: 'Form with script',
    templateContact000: 'Contact with map',
    templateContact001: 'Contact with form',
    templateSite000: 'Site example',
}

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

        this.siteName = 'template'
        this.backgroundColor = 'white'
        this.googleFonts = []
        this.scripts = []

        this.refList = document.querySelector('sdw-tool-list')
        this.refPreview = document.querySelector('sdw-tool-preview')
        this.refSettings = document.querySelector('sdw-tool-settings')

        while (!app.refPreview.elmRoot.querySelector('iframe').contentWindow.frameLoaded) { await promiseWait(1) }
        this.refPreviewBody = app.refPreview.elmRoot.querySelector('iframe').contentDocument.body

        this.elementsRoot = new AppElement(null, 'body')
        this.elementsRoot.init()

        this.addFont('Dancing Script') // As an example
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
            if (this.refSelected.parent == null) {
                app.refPreview.scrollToBottom()
            }
        }
    }

    loadJson (file) {
        return new Promise((resolve, reject) => {
            let xhttp = new XMLHttpRequest()
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    try {
                        resolve(JSON.parse(xhttp.responseText))
                    } catch (e) {
                        console.error(e)
                    }
                    
                }
            };
            xhttp.open("GET", file, true)
            xhttp.send()
        })
    }

    async addTemplate (type) {
        let obj = await app.loadJson('/tool/templates/' + type + '.json')
       
        for (let cnt = 0; cnt < obj.elementsRoot.childs.length; cnt = cnt + 1) {
            this.elementsRoot.addTemplate(obj.elementsRoot.childs[cnt])
        }

        for (let cnt = 0; cnt < obj.settings.googleFonts.length; cnt = cnt + 1) {
            app.addFont(obj.settings.googleFonts[cnt])
        }

        if (obj.settings.scripts) {
            for (let cnt = 0; cnt < obj.settings.scripts.length; cnt = cnt + 1) {
                app.addScript(obj.settings.scripts[cnt])
            }
        }

        app.refPreview.scrollToBottom()
    }

    duplicate () {
        if (this.refSelected != null) {
            this.refSelected.parent.addTemplate(JSON.parse(this.refSelected.toString()))
            let position = this.refSelected.getPosition()
            let lastChild = this.refSelected.parent.childs.length - 1
            this.moveAt(this.refSelected.parent, this.refSelected.parent.childs[lastChild], position + 1)
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

    moveAt (newParent, child, parentPosition) {
        let childPosition = child.getPosition()
        let tmp = child
        child.parent.childs.splice(childPosition, 1) // Remove chid
        newParent.childs.splice(parentPosition, 0, tmp) // Add to newParent
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
        let obj = {
            settings: {
                appVersion: 1.0,
                siteName: app.siteName,
                backgroundColor: app.backgroundColor,
                googleFonts: app.googleFonts,
                scripts: app.scripts
            },
            elementsRoot: JSON.parse(app.elementsRoot.toString())
        }

        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(obj, null, 2)));
        element.setAttribute('download', app.siteName + '.json');
      
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

                for (let cnt = 0; cnt < obj.elementsRoot.childs.length; cnt = cnt + 1) {
                    this.elementsRoot.addTemplate(obj.elementsRoot.childs[cnt])
                }

                app.siteName = obj.settings.siteName
                app.backgroundColor = obj.settings.backgroundColor

                this.refPreview.setBackgroundColor(obj.settings.backgroundColor)

                for (let cnt = 0; cnt < obj.settings.googleFonts.length; cnt = cnt + 1) {
                    app.addFont(obj.settings.googleFonts[cnt])
                }

                if (obj.settings.scripts) {
                    for (let cnt = 0; cnt < obj.settings.scripts.length; cnt = cnt + 1) {
                        app.addScript(obj.settings.scripts[cnt])
                    }
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
        element.setAttribute('download', app.siteName + '.html');
      
        element.style.display = 'none';
        document.body.appendChild(element);
      
        element.click();
      
        document.body.removeChild(element);
    }

    addFont (name) {

        if (this.googleFonts.indexOf(name) == -1) {

            this.googleFonts.push(name)

            let linkTool = document.createElement('link')
            linkTool.setAttribute('href', `https://fonts.googleapis.com/css2?family=${name.replaceAll(' ', '+')}:wght@300;400;600;800&display=swap`)
            linkTool.setAttribute('rel', 'stylesheet')
            linkTool.setAttribute('type', 'text/css')
            linkTool.setAttribute('media', 'all')
            document.querySelector('head').appendChild(linkTool)

            let linkPreview = document.createElement('link')
            linkPreview.setAttribute('href', `https://fonts.googleapis.com/css2?family=${name.replaceAll(' ', '+')}:wght@300;400;600;800&display=swap`)
            linkPreview.setAttribute('rel', 'stylesheet')
            linkPreview.setAttribute('type', 'text/css')
            linkPreview.setAttribute('media', 'all')
            app.refPreview.shadow.querySelector('iframe').contentDocument.head.appendChild(linkPreview)

            selectableSettings['font-family'].push(`"${name}"`)
        }

        app.refSettings.setSettings(this.elementsRoot)
    }

    deleteFont (name) {
        
        this.googleFonts.splice(this.googleFonts.indexOf(name), 1)
        selectableSettings['font-family'].splice(selectableSettings['font-family'].indexOf(`"${name}"`), 1)
        app.elementsRoot.deleteFont(`"${name}"`)
        app.refSettings.setSettings(this.elementsRoot)
    }

    addScript (value) {

        if (this.scripts.indexOf(value) == -1) {

            this.scripts.push(value)

            let srcScript = document.createElement('script')
            srcScript.setAttribute('src', value)
            srcScript.setAttribute('type', 'text/javascript')
            app.refPreview.shadow.querySelector('iframe').contentDocument.head.appendChild(srcScript)
        }

        app.refSettings.setSettings(this.elementsRoot)
    }

    deleteScript (value) {
        
        this.scripts.splice(this.scripts.indexOf(value), 1)
        app.refSettings.setSettings(this.elementsRoot)
    }

    reloadScript (value) {

        let srcScript = document.createElement('script')
        srcScript.setAttribute('src', value + '?' + parseInt(Math.random() * 1000000000))
        srcScript.setAttribute('type', 'text/javascript')
        app.refPreview.shadow.querySelector('iframe').contentDocument.head.appendChild(srcScript)

        app.refSettings.setSettings(this.elementsRoot)
    }

    capitalize (s) {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }
}

let app = null
window.addEventListener('DOMContentLoaded', () => { app = new App() })

