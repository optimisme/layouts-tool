async function restore () {
    let refButton = document.getElementById('boxButtonGetData')
    let refSpinner = document.getElementById('boxSpinner')
    let refList = document.getElementById('boxList')

    refButton.style.display = 'flex'
    refSpinner.style.display = 'none'
    refList.style.display = 'none'
    refList.innerHTML = ''
}

async function loadData () {
    let refButton = document.getElementById('boxButtonGetData')
    let refSpinner = document.getElementById('boxSpinner')
    let refList = document.getElementById('boxList')
    let serverData = {}
    let html = ''
    let template = `
    <div style='display: flex;'>
        <div style='max-width: 100px; margin-right: 16px;'>
            <img src='{{imatge}}' width='100%'/>
        </div>
        <div style='flex-grow: 1;'>
            <h2>{{nom}}</h2>
            Data de venda al públic: {{data}}
            <br/>
            Processador: {{processador}}
            <br/>
            Fabricant: <b>{{fabricant}}</b>
            <hr/>
        </div>
    </div>
    `
    let obj = {
        type: 'dbGetTableData',
        tableName: 'consoles',
        queryFilter: 'WHERE fabricant = "Nintendo"'
    }

    refButton.style.display = 'none'
    refSpinner.style.display = 'flex'

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
            html = html + template  .replace('{{imatge}}', item.imatge)
                                    .replace('{{nom}}', item.nom)
                                    .replace('{{data}}', item.data)
                                    .replace('{{processador}}', item.processador)
                                    .replace('{{fabricant}}', item.fabricant)
        }
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
        {
            "nom": "Xbox Series X",
            "data": "2020-11-10",
            "processador": "8-Core AMD Zen 2",
            "velocitat": 3.8,
            "fabricant": "Microsoft",
            "color": "negre",
            "venudes": 0,
            "imatge": "/images/consoles/microsoft-sx.png"
        },
        {
            "nom": "Playstation 5",
            "data": "2020-11-12",
            "processador": "8-Core AMD Zen 2",
            "velocitat": 3.5,
            "fabricant": "Sony",
            "color": "blanc",
            "venudes": 0,
            "imatge": "/images/consoles/sony-ps5.png"
        },
        {
            "nom": "Nintendo Switch",
            "data": "2017-3-3",
            "processador": "4xARM Cortex-A57",
            "velocitat": 1.02,
            "fabricant": "Nintendo",
            "color": "negre",
            "venudes": 70000000,
            "imatge": "/images/consoles/nintendo-switch.png"
        },
        {
            "nom": "Xbox One",
            "data": "2013-11-22",
            "processador": "Custom 8-core AMD",
            "velocitat": 1.75,
            "fabricant": "Microsoft",
            "color": "negre",
            "venudes": 50000000,
            "imatge": "/images/consoles/microsoft-xboxone.png"
        },
        {
            "nom": "Playstation 4",
            "data": "2013-11-15",
            "processador": "Semi-custom 8-core AMD",
            "velocitat": 1.6,
            "fabricant": "Sony",
            "color": "negre",
            "venudes": 112000000,
            "imatge": "/images/consoles/sony-ps4.png"
        },
        {
            "nom": "Wii U",
            "data": "2012-11-18",
            "processador": "IBM PowerPC 750",
            "velocitat": 1.24,
            "fabricant": "Nintendo",
            "color": "negre",
            "venudes": 14000000,
            "imatge": "/images/consoles/nintendo-wiiu.png"
        },
        {
            "nom": "Wii",
            "data": "2006-11-19",
            "processador": "IBM PowerPC 750",
            "velocitat": 0.72,
            "fabricant": "Nintendo",
            "color": "blanc",
            "venudes": 101000000,
            "imatge": "/images/consoles/nintendo-wii.png"
        },
        {
            "nom": "Playstation 3",
            "data": "2006-11-11",
            "processador": "IBM PowerPC Cell",
            "velocitat": 3.2,
            "fabricant": "Sony",
            "color": "negre",
            "venudes": 87000000,
            "imatge": "/images/consoles/sony-ps3.png"
        },
        {
            "nom": "Xbox 360",
            "data": "2005-11-22",
            "processador": "IBM PowerPC Tri-core Xenon",
            "velocitat": 3.2,
            "fabricant": "Microsoft",
            "color": "blanc",
            "venudes": 84000000,
            "imatge": "/images/consoles/microsoft-360.png"
        },
        {
            "nom": "Xbox",
            "data": "2001-11-15",
            "processador": "Intel Pentium III",
            "velocitat": 0.733,
            "fabricant": "Microsoft",
            "color": "negre",
            "venudes": 24000000,
            "imatge": "/images/consoles/microsoft-xbox.png"
        },
        {
            "nom": "GameCube",
            "data": "2001-11-14",
            "processador": "IBM PowerPC Gekko",
            "velocitat": 0.486,
            "fabricant": "Nintendo",
            "color": "lila",
            "venudes": 22000000,
            "imatge": "/images/consoles/nintendo-gamecube.png"
        },
        {
            "nom": "Playstation 2",
            "data": "2000-3-4",
            "processador": "Emotion engine",
            "velocitat": 0.294,
            "fabricant": "Sony",
            "color": "negre",
            "venudes": 155000000,
            "imatge": "/images/consoles/sony-ps2.png"
        },
        {
            "nom": "Dreamcast",
            "data": "1998-11-27",
            "processador": "Hitachi SH-4",
            "velocitat": 0.2,
            "fabricant": "Sega",
            "color": "blanc",
            "venudes": 9000000,
            "imatge": "/images/consoles/sega-dreamcast.png"
        },
        {
            "nom": "Nintendo 64",
            "data": "1996-6-23",
            "processador": "NEC VR4300",
            "velocitat": 0.093,
            "fabricant": "Nintendo",
            "color": "negre",
            "venudes": 33000000,
            "imatge": "/images/consoles/nintendo-64.png"
        },
        {
            "nom": "Apple Bandai",
            "data": "1993-3-28",
            "processador": "PowerPC 630",
            "velocitat": 0.066,
            "fabricant": "Apple",
            "color": "blanc",
            "venudes": 42000,
            "imatge": "/images/consoles/apple-bandai.png"
        },
        {
            "nom": "Playstation",
            "data": "1994-12-3",
            "processador": "R3000",
            "velocitat": 0.033,
            "fabricant": "Sony",
            "color": "gris",
            "venudes": 102000000,
            "imatge": "/images/consoles/sony-playstation.png"
        },
        {
            "nom": "Sega Saturn",
            "data": "1994-11-22",
            "processador": "2x Hitachi SH2",
            "velocitat": 0.028,
            "fabricant": "Sega",
            "color": "negre",
            "venudes": 9000000,
            "imatge": "/images/consoles/sega-saturn.png"
        },
        {
            "nom": "Amiga",
            "data": "1993-9-17",
            "processador": "Motorola 68EC020",
            "velocitat": 0.014,
            "fabricant": "Commodore",
            "color": "negre",
            "venudes": 4000000,
            "imatge": "/images/consoles/commodore-amiga.png"
        },
        {
            "nom": "Sega 32X",
            "data": "1994-11-21",
            "processador": "2x SH-2",
            "velocitat": 0.023,
            "fabricant": "Sega",
            "color": "negre",
            "venudes": 650000,
            "imatge": "/images/consoles/sega-32x.png"
        },
        {
            "nom": "Mega Drive",
            "data": "1988-11-29",
            "processador": "Motorola 68000",
            "velocitat": 0.00358,
            "fabricant": "Sega",
            "color": "negre",
            "venudes": 30000000,
            "imatge": "/images/consoles/sega-md.png"
        },
        {
            "nom": "Super Nintendo",
            "data": "1990-11-21",
            "processador": "Ricoh 5A22",
            "velocitat": 0.00358,
            "fabricant": "Nintendo",
            "color": "gris",
            "venudes": 50000000,
            "imatge": "/images/consoles/nintendo-sn.png"
        },
        {
            "nom": "NES",
            "data": "1983-6-15",
            "processador": "Ricoh 2A03",
            "velocitat": 0.00179,
            "fabricant": "Nintendo",
            "color": "blanc",
            "venudes": 62000000,
            "imatge": "/images/consoles/nintendo-nes.png"
        },
        {
            "nom": "Master System",
            "data": "1985-10-20",
            "processador": "Zilog Z80",
            "velocitat": 0.004,
            "fabricant": "Sega",
            "color": "negre",
            "venudes": 12000000,
            "imatge": "/images/consoles/sega-ms.png"
        },
        {
            "nom": "Atari 7800",
            "data": "1986-5-1",
            "processador": "6502C",
            "velocitat": 0.00179,
            "fabricant": "Atari",
            "color": "negre",
            "venudes": 4000000,
            "imatge": "/images/consoles/atari-7800.png"
        }
    ]

    obj = { type: 'dbDelTable', tableName: 'consoles' }
    await queryServer('/query', obj)

    obj = { type: 'dbAddTable', tableName: 'consoles' }
    await queryServer('/query', obj)

    obj = { type: 'dbAddColumn', tableName: 'consoles', columnName: 'nom', columnType: 'TEXT' }
    await queryServer('/query', obj)

    obj = { type: 'dbAddColumn', tableName: 'consoles', columnName: 'processador', columnType: 'TEXT' }
    await queryServer('/query', obj)

    obj = { type: 'dbAddColumn', tableName: 'consoles', columnName: 'data', columnType: 'TEXT' }
    await queryServer('/query', obj)

    obj = { type: 'dbAddColumn', tableName: 'consoles', columnName: 'fabricant', columnType: 'TEXT' }
    await queryServer('/query', obj)

    obj = { type: 'dbAddColumn', tableName: 'consoles', columnName: 'color', columnType: 'TEXT' }
    await queryServer('/query', obj)

    obj = { type: 'dbAddColumn', tableName: 'consoles', columnName: 'imatge', columnType: 'TEXT' }
    await queryServer('/query', obj)

    obj = { type: 'dbAddColumn', tableName: 'consoles', columnName: 'venudes', columnType: 'INTEGER' }
    await queryServer('/query', obj)

    obj = { type: 'dbAddColumn', tableName: 'consoles', columnName: 'velocitat', columnType: 'REAL' }
    await queryServer('/query', obj)

    for (let cnt = 0; cnt < dadesConsoles.length; cnt = cnt + 1) {
        obj = {
            type: 'dbAddRow',
            tableName: 'consoles',
            columns: {
                nom: dadesConsoles[cnt].nom,
                processador: dadesConsoles[cnt].processador,
                data: dadesConsoles[cnt].data,
                fabricant: dadesConsoles[cnt].fabricant,
                color: dadesConsoles[cnt].color,
                imatge: dadesConsoles[cnt].imatge,
                venudes: dadesConsoles[cnt].venudes,
                velocitat: dadesConsoles[cnt].velocitat
            }
        }
        await queryServer('/query', obj)
    }
}