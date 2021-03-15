window.addEventListener('load', () => { init() })

async function init () {
    console.log('abc')
    loadData()
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
        queryFilter: 'row.manufacturer == "Nintendo"',
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

async function addConsoles () {
    let obj = {}
    let dadesConsoles = [
        { "name": "Xbox Series X", "date": "2020-11-10", "processor": "8-Core AMD Zen 2", "speed": 3.8, "manufacturer": "Microsoft", "color": "black", "units": 0, "image": "/images/consoles/microsoft-sx.png" },
        { "name": "Playstation 5", "date": "2020-11-12", "processor": "8-Core AMD Zen 2", "speed": 3.5, "manufacturer": "Sony", "color": "white", "units": 0, "image": "/images/consoles/sony-ps5.png" },
        { "name": "Nintendo Switch", "date": "2017-3-3", "processor": "4xARM Cortex-A57", "speed": 1.02, "manufacturer": "Nintendo", "color": "black", "units": 70000000, "image": "/images/consoles/nintendo-switch.png" },
        { "name": "Xbox One", "date": "2013-11-22", "processor": "Custom 8-core AMD", "speed": 1.75, "manufacturer": "Microsoft", "color": "black", "units": 50000000, "image": "/images/consoles/microsoft-xboxone.png" },
        { "name": "Playstation 4", "date": "2013-11-15", "processor": "Semi-custom 8-core AMD", "speed": 1.6, "manufacturer": "Sony", "color": "black", "units": 112000000, "image": "/images/consoles/sony-ps4.png" },
        { "name": "Wii U", "date": "2012-11-18", "processor": "IBM PowerPC 750", "speed": 1.24, "manufacturer": "Nintendo", "color": "black", "units": 14000000, "image": "/images/consoles/nintendo-wiiu.png" },
        { "name": "Wii", "date": "2006-11-19", "processor": "IBM PowerPC 750", "speed": 0.72, "manufacturer": "Nintendo", "color": "white", "units": 101000000, "image": "/images/consoles/nintendo-wii.png" },
        { "name": "Playstation 3", "date": "2006-11-11", "processor": "IBM PowerPC Cell", "speed": 3.2, "manufacturer": "Sony", "color": "black", "units": 87000000, "image": "/images/consoles/sony-ps3.png" },
        { "name": "Xbox 360", "date": "2005-11-22", "processor": "IBM PowerPC Tri-core Xenon", "speed": 3.2, "manufacturer": "Microsoft", "color": "white", "units": 84000000, "image": "/images/consoles/microsoft-360.png" },
        { "name": "Xbox", "date": "2001-11-15", "processor": "Intel Pentium III", "speed": 0.733, "manufacturer": "Microsoft", "color": "black", "units": 24000000, "image": "/images/consoles/microsoft-xbox.png" },
        { "name": "GameCube", "date": "2001-11-14", "processor": "IBM PowerPC Gekko", "speed": 0.486, "manufacturer": "Nintendo", "color": "purple", "units": 22000000, "image": "/images/consoles/nintendo-gamecube.png" },
        { "name": "Playstation 2", "date": "2000-3-4", "processor": "Emotion engine", "speed": 0.294, "manufacturer": "Sony", "color": "black", "units": 155000000, "image": "/images/consoles/sony-ps2.png" },
        { "name": "Dreamcast", "date": "1998-11-27", "processor": "Hitachi SH-4", "speed": 0.2, "manufacturer": "Sega", "color": "white", "units": 9000000, "image": "/images/consoles/sega-dreamcast.png" },
        { "name": "Nintendo 64", "date": "1996-6-23", "processor": "NEC VR4300", "speed": 0.093, "manufacturer": "Nintendo", "color": "black", "units": 33000000, "image": "/images/consoles/nintendo-64.png" },
        { "name": "Apple Bandai", "date": "1993-3-28", "processor": "PowerPC 630", "speed": 0.066, "manufacturer": "Apple", "color": "white", "units": 42000, "image": "/images/consoles/apple-bandai.png" },
        { "name": "Playstation", "date": "1994-12-3", "processor": "R3000", "speed": 0.033, "manufacturer": "Sony", "color": "grey", "units": 102000000, "image": "/images/consoles/sony-playstation.png" },
        { "name": "Sega Saturn", "date": "1994-11-22", "processor": "2x Hitachi SH2", "speed": 0.028, "manufacturer": "Sega", "color": "black", "units": 9000000, "image": "/images/consoles/sega-saturn.png" },
        { "name": "Amiga", "date": "1993-9-17", "processor": "Motorola 68EC020", "speed": 0.014, "manufacturer": "Commodore", "color": "black", "units": 4000000, "image": "/images/consoles/commodore-amiga.png" },
        { "name": "Sega 32X", "date": "1994-11-21", "processor": "2x SH-2", "speed": 0.023, "manufacturer": "Sega", "color": "black", "units": 650000, "image": "/images/consoles/sega-32x.png" },
        { "name": "Mega Drive", "date": "1988-11-29", "processor": "Motorola 68000", "speed": 0.00358, "manufacturer": "Sega", "color": "black", "units": 30000000, "image": "/images/consoles/sega-md.png" },
        { "name": "Super Nintendo", "date": "1990-11-21", "processor": "Ricoh 5A22", "speed": 0.00358, "manufacturer": "Nintendo", "color": "grey", "units": 50000000, "image": "/images/consoles/nintendo-sn.png" },
        { "name": "NES", "date": "1983-6-15", "processor": "Ricoh 2A03", "speed": 0.00179, "manufacturer": "Nintendo", "color": "white", "units": 62000000, "image": "/images/consoles/nintendo-nes.png" },
        { "name": "Master System", "date": "1985-10-20", "processor": "Zilog Z80", "speed": 0.004, "manufacturer": "Sega", "color": "black", "units": 12000000, "image": "/images/consoles/sega-ms.png" },
        { "name": "Atari 7800", "date": "1986-5-1", "processor": "6502C", "speed": 0.00179, "manufacturer": "Atari", "color": "black", "units": 4000000, "image": "/images/consoles/atari-7800.png" }
    ]

    obj = { type: 'dbDelTable', tableName: 'consoles', logInId: localStorage.getItem('id'), logInToken: localStorage.getItem('token') }
    await queryServer('/query', obj)

    obj = { type: 'dbAddTable', tableName: 'consoles', logInId: localStorage.getItem('id'), logInToken: localStorage.getItem('token') }
    await queryServer('/query', obj)

    obj = { type: 'dbAddColumn', tableName: 'consoles', columnName: 'name', columnType: 'string', logInId: localStorage.getItem('id'), logInToken: localStorage.getItem('token') }
    await queryServer('/query', obj)

    obj = { type: 'dbAddColumn', tableName: 'consoles', columnName: 'processor', columnType: 'string', logInId: localStorage.getItem('id'), logInToken: localStorage.getItem('token') }
    await queryServer('/query', obj)

    obj = { type: 'dbAddColumn', tableName: 'consoles', columnName: 'date', columnType: 'string', logInId: localStorage.getItem('id'), logInToken: localStorage.getItem('token') }
    await queryServer('/query', obj)

    obj = { type: 'dbAddColumn', tableName: 'consoles', columnName: 'manufacturer', columnType: 'string', logInId: localStorage.getItem('id'), logInToken: localStorage.getItem('token') }
    await queryServer('/query', obj)

    obj = { type: 'dbAddColumn', tableName: 'consoles', columnName: 'color', columnType: 'string', logInId: localStorage.getItem('id'), logInToken: localStorage.getItem('token') }
    await queryServer('/query', obj)

    obj = { type: 'dbAddColumn', tableName: 'consoles', columnName: 'image', columnType: 'string', logInId: localStorage.getItem('id'), logInToken: localStorage.getItem('token') }
    await queryServer('/query', obj)

    obj = { type: 'dbAddColumn', tableName: 'consoles', columnName: 'units', columnType: 'number', logInId: localStorage.getItem('id'), logInToken: localStorage.getItem('token') }
    await queryServer('/query', obj)

    obj = { type: 'dbAddColumn', tableName: 'consoles', columnName: 'speed', columnType: 'number', logInId: localStorage.getItem('id'), logInToken: localStorage.getItem('token') }
    await queryServer('/query', obj)

    for (let cnt = 0; cnt < dadesConsoles.length; cnt = cnt + 1) {
        obj = {
            type: 'dbAddRow',
            tableName: 'consoles',
            columns: dadesConsoles[cnt], 
            logInId: localStorage.getItem('id'), 
            logInToken: localStorage.getItem('token')
        }
        await queryServer('/query', obj)
    }
}