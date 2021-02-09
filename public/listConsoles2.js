window.addEventListener('load', init())

async function init () {
    loadData()
}

async function userIsValid() {



    if (typeof storageId != 'string' || typeof storageToken != 'string') return false
console.log(storageid, storageToken)
    let obj = {
        type: 'appLogInToken',
        id: storageId,
        token: storageToken
    }

    try {
        serverData = await queryServer('/query', obj)
    } catch (err) {
        console.error(err)
    }

    if (serverData.status == 'ok') {
        return true
    } else {
        localStorage.removeItem('id')
        localStorage.removeItem('token')
    }
}

async function loadData () {
    let refBoxUserError = document.getElementById('boxUserError')
    let refSpinner = document.getElementById('boxSpinner')
    let refList = document.getElementById('boxList')
    let serverData = {}
    let html = ''
    let template = `
    <div style='display: flex;'>
        <div style='max-width: 100px; margin-right: 16px;'>
            <img src='{{image}}' width='100%'/>
        </div>
        <div style='flex-grow: 1;'>
            <h2>{{name}}</h2>
            Release date: {{date}}
            <br/>
            Processor: {{processor}}
            <br/>
            Manufacturer: <b>{{manufacturer}}</b>
            <hr/>
        </div>
    </div>
    `
    let obj = {
        type: 'dbGetTableData',
        tableName: 'consoles',
        queryFilter: 'WHERE manufacturer = "Nintendo"',
        logInId: localStorage.getItem('id'),
        logInToken: localStorage.getItem('token')
    }

    refSpinner.style.display = 'flex'
    refList.style.display = 'none'

    await this.wait(500)
    try {
        serverData = await queryServer('/query', obj)
    } catch (err) {
        console.error(err)
    }

    if (serverData.status == 'ok') {
        let list = serverData.result
        for (let cnt = 0; cnt < list.length; cnt = cnt + 1) {
            let item = list[cnt]
            html = html + template  .replace('{{image}}', item.image)
                                    .replace('{{name}}', item.name)
                                    .replace('{{date}}', item.date)
                                    .replace('{{processor}}', item.processor)
                                    .replace('{{manufacturer}}', item.manufacturer)
        }
    } else {
        refBoxUserError.style.display = 'block'
    }

    refSpinner.style.display = 'none'
    refList.style.display = 'block'

    refList.innerHTML = html
}

/**
 * Queries the server with a 'POST' query
 * @param {url} server URL
 * @param {obj} data to send to the server
 */
async function queryServer (url, obj) {
    return new Promise((resolve, reject) => {
        let req = new XMLHttpRequest()
        req.onreadystatechange = (res) => {
            let responseObj = null
            if (req.readyState === 4) {
                try {
                    responseObj = JSON.parse(req.responseText)
                } catch (e) {
                    console.log(e, req.responseText)
                    return reject('Parsing response to JSON')
                }
                if (req.status >= 200 && req.status < 300) {
                    return resolve(responseObj)
                } else if (req.status >= 400) {
                    return reject('Unauthorized')
                } else {
                    return reject(responseObj)
                }
            }
        }
        req.open('POST', url, true)
        req.send(JSON.stringify(obj))
    })
}

/**
 * Wait a while
 * @param {utimerl} time to wait in milliseconds (1000 = 1s)
 */
async function wait (time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, time)
    })
}
