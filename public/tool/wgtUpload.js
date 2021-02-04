let cssWgtUpload=`
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
[data-ref='msgDone'] { background-position: center; background-repeat: no-repeat; background-size: cover; background-image: unset; }
`
let htmlWgtUpload=`
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
</div>`
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
            this.refMsgDone.style.backgroundImage = `url("${this.value}")`
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
            if (this.showing != 'msgAdd') return
            this.refInput.click()
        })

        this.refRoot.addEventListener('dragover', (event) => {
            event.preventDefault()
            if (this.showing != 'msgAdd') return
            this.refRoot.classList.add('dragOver')
        })
        this.refRoot.addEventListener('dragleave', (event) => {
            if (this.showing != 'msgAdd') return
            this.refRoot.classList.remove('dragOver')
        })
        this.refRoot.addEventListener('drop', (event) => {
            event.preventDefault()
            event.stopPropagation()
            if (this.showing != 'msgAdd') return
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
            eval(`this.ref${this.upperCase(name)} = this.refRoot.querySelector('[data-ref="${name}"]')`)
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
            this.refMsgDone.style.backgroundImage = `unset`
            this.refInput.value = ''
        } else {
            this.refRoot.removeAttribute('data-add')
        }

        if (ref == 'msgDone') {
            this.refMsgDone.style.backgroundImage = `url("${this.value}")`
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
            chunk: await this.bytesToBase64(new Uint8Array(part.chunk))
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
            fileName: fileName
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
            fileName: fileName
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
            fileName: fileName
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
customElements.define("wgt-upload", WgtUpload)