let utilsLib = require('./server/utils.js')

let utils = new utilsLib()

function setSpaces (value, length) {
    let str = value.toString()
    let limit = 20
    let realLength = length > limit ? limit : length

    if (str.length < limit) {
        let spaces = ''
        for (cnt = str.length; cnt < realLength; cnt = cnt + 1) {
            spaces = spaces + ' '
        }
        str = str + spaces
    } else {
        str = str.substring(0, realLength - 3) + '...'
    }

    return str
}

async function main (args) {

    let rst = []
    let keys = []
    let lengths = []
    let table = []
    try {
        rst = await utils.query('SELECT * FROM ' + args[0])
    } catch (e) {
        console.log(e)
    }

    if (rst.length > 0) {
        keys = Object.keys(rst[0])
        let position = table.push([]) - 1
        for (let cntColumn = 0; cntColumn < keys.length; cntColumn = cntColumn + 1) {
            let key = keys[cntColumn]
            lengths.push(key.length)
            table[position].push(key)
        }
        for (let cnt = 0; cnt < rst.length; cnt = cnt + 1) {
            position = table.push([]) - 1
            for (let cntColumn = 0; cntColumn < table[cnt].length; cntColumn = cntColumn + 1) {
                let key = keys[cntColumn]
                let value = rst[cnt][key]
                let columnLength = value.length

                if (lengths[cntColumn] < columnLength) { lengths[cntColumn] = columnLength }
                (table[position]).push(value)
            }
        }
        for (let cnt = 0; cnt < table.length; cnt = cnt + 1) {
            let line = ''
            for (let cntColumn = 0; cntColumn < table[cnt].length; cntColumn = cntColumn + 1) {
                let columnLength = lengths[cntColumn]
                line = line + setSpaces(table[cnt][cntColumn], columnLength) + ' '
            }
            console.log(line)
        }
    }

    utils.db.close()
}

main(process.argv.slice(2))