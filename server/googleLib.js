/*
    1 - Activar l'accés a google Sheets des de la web

            https://developers.google.com/sheets/api/quickstart/nodejs

    2 - Configurar amb tipus 'Desktop app'

    3 - Descarregar la configuració de client i posar-la a la carpeta 'server' amb el nom 'googleCredentials.json'

            './server/googleCredentials.json'

    4 - Executar 'node ./server/google.js' i navegar a la direcció que diu, donar permisos i ignorar l'error de la redirecció

    5 - Copiar el codi de la pàgina web, i enganxar-lo al terminal
*/

const fs = require('fs')
const readline = require('readline')
const {google} = require('googleapis')

class Obj {

    constructor () {
        this.SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
        this.TOKEN_PATH = './server/googleToken.json'
        this.auth = null
    }

    googleAuthorize () {
        return new Promise((resolve, reject) => {
            fs.readFile('./server/googleCredentials.json', (err, content) => {
                if (err) return reject(err)
                this.authorize(JSON.parse(content), (auth) => { this.auth = auth; return resolve() })
            })
        })
    }

    authorize(credentials, callback) {
        const {client_secret, client_id, redirect_uris} = credentials.installed
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0])
        
        fs.readFile(this.TOKEN_PATH, (err, token) => {
            if (err) return this.getNewToken(oAuth2Client, callback)
            oAuth2Client.setCredentials(JSON.parse(token))
            callback(oAuth2Client)
        })
    }

    getNewToken(oAuth2Client, callback) {
        const authUrl = oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: this.SCOPES, })
        console.log('Authorize this app by visiting this url:', authUrl)
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout, })
        rl.question('Enter the code from that page here: ', (code) => {
          rl.close()
          oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error while trying to retrieve access token', err)
            oAuth2Client.setCredentials(token)
            fs.writeFile(this.TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err)
                console.log('Token stored to', this.TOKEN_PATH)
            })
            callback(oAuth2Client)
          })
        })
    }

    async get (spreadsheetId, range) {
        let auth = this.auth
        const sheets = google.sheets({ version: 'v4', auth })
        const request = { spreadsheetId: spreadsheetId, range: range }
        try {
            const response = (await sheets.spreadsheets.values.get(request)).data
            return response.values
        } catch (err) {
            console.error(err)
        }
    }

    async update (spreadsheetId, range, values) {
        let auth = this.auth
        const sheets = google.sheets({ version: 'v4', auth })
        const request = { spreadsheetId: spreadsheetId, range: range, valueInputOption: 'USER_ENTERED', resource: { values } }
        try {
            (await sheets.spreadsheets.values.update(request)).data
        } catch (err) {
            throw (err)
        }
    }
//=QUERY('Full 1'!$A$2:$Z$100; "select * where (B<>40)")
    async append (spreadsheetId, range, values) {
        let auth = this.auth
        const sheets = google.sheets({ version: 'v4', auth })
        const request = { spreadsheetId: spreadsheetId, range: range, valueInputOption: 'USER_ENTERED', resource: { values } }
        try {
            (await sheets.spreadsheets.values.append(request)).data
        } catch (err) {
            throw (err)
        }
    }
}

module.exports = Obj