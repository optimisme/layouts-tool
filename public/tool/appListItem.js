class SdwToolListItem extends HTMLElement {

    constructor() {
        super()

        this.refApp = null
        this.ident = 0
        this.expanded = false

        this.shadow = this.attachShadow({ mode: 'open' })
    }

    attributeChangedCallback(name, oldValue, newValue) { }

    connectedCallback () {
        
        let identWidth = (this.ident * 16)

        this.elmStyle = document.createElement('style')
        this.elmStyle.textContent = `
        .root {
            overflow: hidden;
        }
        .main {
            align-items: center;
            cursor: pointer;
            display: flex;
            height: 30px;
            padding: 0 8px;
            width: 100%;
        }
        .main:hover {
            background-color: #ccc;
        }
        .selected {
            background-color: rgba(0, 125, 255, 0.2);
        }
        .main > div[name="ident"] {
            width: ${identWidth}px;
        }
        .main > div[name="arrow"] {
            display: none;
            transform: rotateZ(0deg);
            transition: transform 0.25s ease;
            width: 16px;
        }
        .expanded {
            transform: rotateZ(90deg) !important;
        }
        .main > div[name="description"] {
            flex-grow: 1;
            font-size: 0.75em;
            overflow: hidden; 
            text-overflow: ellipsis; 
            white-space: nowrap;
            max-width: calc(100% - ${identWidth + 24}px)
        }
        .childs {
            transition: height 0.25s ease;
        }
        .dragOver {
            background-color: grey;
        }`
        this.shadow.appendChild(this.elmStyle)

        this.elmRoot = document.createElement('div')
        this.elmRoot.setAttribute('class', `root`)

        if (this.refApp && this.refApp.parent != null) {
            this.elmRoot.setAttribute('draggable', `true`)
            this.elmRoot.addEventListener('dragstart', (e) => {
                e.stopPropagation()

                let cnv = document.createElement('canvas')
                cnv.setAttribute('height', '30')
                cnv.setAttribute('width', '150')
                let ctx = cnv.getContext("2d")
                ctx.fillStyle = 'white'
                ctx.fillRect(0, 0, 150, 30)
                ctx.fillStyle = 'grey'
                ctx.font = "12px 'Open Sans', Arial"
                let txt = this.refApp.description
                let width = ctx.measureText(txt).width
                let ellipsis = false
                while (width > 100) {
                    txt = txt.slice(0, -1)
                    width = ctx.measureText(txt).width
                    ellipsis = true
                }
                if (ellipsis) {
                    ctx.fillText(txt + '...', 25, 20)
                } else {
                    ctx.fillText(txt, 25, 20)
                }
                
                ctx.lineWidth = 2
                ctx.strokeStyle = 'lightgrey'
                ctx.strokeRect(0, 0, 150, 30)
                let img = new Image()
                img.src = cnv.toDataURL('image/jpeg', 1)

                e.dataTransfer.setDragImage(img, 10, 10)
                app.refDrag = this.refApp
            })
            this.elmRoot.addEventListener('dragend', (e) => {
                app.refDrag = null
            })
        }
        this.elmRoot.addEventListener('dragover', (e) => {
            e.preventDefault()
            e.stopPropagation()
            if (app.canDrag(this.refApp)) {
                this.elmRoot.classList.add('dragOver')
            }
        })
        this.elmRoot.addEventListener('dragleave', (e) => {
            e.preventDefault()
            e.stopPropagation()
            this.elmRoot.classList.remove('dragOver')
        })
        this.elmRoot.addEventListener('drop', (e) => {
            e.preventDefault()
            e.stopPropagation()
            this.elmRoot.classList.remove('dragOver')
            if (app.canDrag(this.refApp)) {
                app.moveAt(this.refApp, app.refDrag)
            }
        })

            let divMain = document.createElement('div')
            divMain.setAttribute('name', 'main')
            divMain.setAttribute('class', 'main')
            divMain.addEventListener('click', (evt) => { 
                evt.stopPropagation()
                if (app.refSelected != null && app.refSelected == this.refApp) {
                    app.unselect()
                } else {
                    app.select(this.refApp)
                }
            })
            this.elmRoot.appendChild(divMain)

                let divIdent = document.createElement('div')
                divIdent.setAttribute('name', 'ident')
                divMain.appendChild(divIdent)

                let divArrow = document.createElement('div')
                divArrow.setAttribute('name', 'arrow')
                divArrow.addEventListener('click', (evt) => { 
                    evt.stopPropagation()
                    if (this.expanded) {
                        this.colapse()
                    } else {
                        this.expand()
                    }
                })
                divMain.appendChild(divArrow)

                    let arrowIcon = document.createElement('ion-icon')
                    arrowIcon.setAttribute('name', 'chevron-forward-outline')
                    divArrow.appendChild(arrowIcon)

                let divText = document.createElement('div')
                divText.setAttribute('name', 'description')
                divMain.appendChild(divText)

                    if (!app.elementsRoot  || app.elementsRoot.refList == null) {
                        divText.innerText = 'Body'
                    } else {
                        divText.innerText = this.refApp.description
                    }

            let divChilds = document.createElement('div')
            divChilds.setAttribute('name', 'childs')
            divChilds.setAttribute('class', 'childs')
            this.elmRoot.appendChild(divChilds)

        this.shadow.appendChild(this.elmRoot)
        this.innerHTML = ''
    }

    add (ref) {
        let newItem = document.createElement('sdw-tool-list-item')
        newItem.refApp = ref
        newItem.ident = this.ident + 1

        this.elmRoot.querySelector('div[name="childs"]').appendChild(newItem)
        this.elmRoot.querySelector('div[name="arrow"]').style.display = 'initial'
        this.expand()

        return newItem
    }

    remove (child) {
        this.elmRoot.querySelector('div[name="childs"]').removeChild(child)
        if (this.refApp.childs.length == 1) {
            this.colapse()
            this.elmRoot.querySelector('div[name="arrow"]').style.display = 'none'
        }
    }

    select () {
        this.elmRoot.querySelector('div[name="main"]').classList.add('selected')
    }

    unselect () {
        this.elmRoot.querySelector('div[name="main"]').classList.remove('selected')
    }

    expand () {
        this.expanded = true
        this.elmRoot.querySelector('div[name="arrow"]').classList.add('expanded')
        this.setChildsHeight()
    }

    colapse () {
        this.expanded = false
        this.elmRoot.querySelector('div[name="arrow"]').classList.remove('expanded')
        this.elmRoot.querySelector('div[name="childs"]').style.height = '0'
        if (this.refApp.parent !== null) {
            this.refApp.parent.refList.setChildsHeight()
        }
        // TODO: unselect child if selected
    }

    setChildsHeight () {
        let numChilds = this.getNumberOfExpandedChilds()
        this.elmRoot.querySelector('div[name="childs"]').style.height = (numChilds * 30) + 'px'
        if (this.refApp.parent !== null) {
            this.refApp.parent.refList.setChildsHeight()
        }
    }

    getNumberOfExpandedChilds () {
        let rst = 0
        let child = null

        if (this.expanded) {
            for (let cnt = 0; cnt < this.refApp.childs.length; cnt = cnt + 1) {
                rst = rst + 1
                child = this.refApp.childs[cnt]
                if (child.refList != null) {
                    rst = rst + child.refList.getNumberOfExpandedChilds()
                }
            }
        }

        return rst
    }

    setDescription (value) {

        this.description = value
        this.elmRoot.querySelector('div[name="description"]').textContent = value
    }
}