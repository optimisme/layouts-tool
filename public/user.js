User = class {

    constructor () {
        this.handler = this.init.bind(this)
        window.addEventListener('load', this.handler)
        this.userData = {}
    }

    async init () {
        this.signInToken()
    }

    async checkFormSignIn () {
        let refFormMail = document.getElementById('formMail')
        let refFormPassword = document.getElementById('formPassword')
        let refFormButton = document.getElementById('formButton')

        let validMail = refFormMail.checkValidity()
        let validPassword = refFormPassword.checkValidity()

        if (refFormMail.value == '') validMail = false
        if (refFormPassword.value == '') validPassword = false

        if (validMail && validPassword) {
            refFormButton.removeAttribute('disabled')
        } else {
            refFormButton.setAttribute('disabled', 'true')
        }
    }

    async signIn () {
        let refFormMail = document.getElementById('formMail')
        let refFormPassword = document.getElementById('formPassword')
        let refBoxButton = document.getElementById('boxButton')
        let refBoxSpinner = document.getElementById('boxSpinner')
        let refBoxError = document.getElementById('boxError')
        let response = {}

        let obj = {
            type: 'signIn',
            email: refFormMail.value,
            password: refFormPassword.value
        }

        refBoxButton.style.display = 'none'
        refBoxSpinner.style.display = 'block'
        await this.wait(500)

        try {
            response = await this.queryServer('/query', obj)
        } catch (e) {
            console.log(e)
        }

        refBoxSpinner.style.display = 'none'

        if (response.status == 'ok') {
            refFormMail.value = ''
            refFormPassword.value = ''
            this.signedIn(true, response.result[0])
        } else {
            refBoxError.style.display = 'block'
            await this.wait(3000)
            refBoxError.style.display = 'none'

            this.signOut()
        }

        refBoxButton.style.display = 'block'
    }

    async signInToken () {

        let storageId = localStorage.getItem('loginId')
        let storageToken = localStorage.getItem('loginToken')
        let response = {}

        if (storageId == null || storageToken == null) return

        let obj = {
            type: 'signInToken',
            signInId: parseInt(storageId),
            signInToken: storageToken
        }

        try {
            response = await this.queryServer('/query', obj)
        } catch (e) {
            console.log(e)
        }

        if (response.status == 'ok') {
            this.signedIn(false,response.result[0])
        } else {
            this.signOut()
        }
    }

    async checkFormSignUp () {
        let refFormMail = document.getElementById('formMail')
        let refFormPassword = document.getElementById('formPassword')
        let refFormName = document.getElementById('formName')
        let refFormSurname = document.getElementById('formSurname')
        let refFormButton = document.getElementById('formButton')

        let validMail = refFormMail.checkValidity()
        let validPassword = refFormPassword.checkValidity()
        let validName = refFormName.checkValidity()
        let validSurname = refFormSurname.checkValidity()

        if (refFormMail.value == '') validMail = false
        if (refFormPassword.value == '') validPassword = false
        if (refFormName.value == '') validName = false
        if (refFormSurname.value == '') validSurname = false

        if (validMail && validPassword && validName && validSurname) {
            refFormButton.removeAttribute('disabled')
        } else {
            refFormButton.setAttribute('disabled', 'true')
        }
    }

    async signUp () {
        let refFormMail = document.getElementById('formMail')
        let refFormPassword = document.getElementById('formPassword')
        let refFormName = document.getElementById('formName')
        let refFormSurname = document.getElementById('formSurname')
        let refBoxButton = document.getElementById('boxButton')
        let refBoxSpinner = document.getElementById('boxSpinner')
        let refBoxError = document.getElementById('boxError')
        let response = {}

        let obj = {
            type: 'signUp',
            email: refFormMail.value,
            password: refFormPassword.value,
            name: refFormName.value,
            surname: refFormSurname.value
        }

        refBoxButton.style.display = 'none'
        refBoxSpinner.style.display = 'block'
        await this.wait(500)

        try {
            response = await this.queryServer('/query', obj)
        } catch (e) {
            console.log(e)
        }

        refBoxSpinner.style.display = 'none'

        if (response.status == 'ok') {
            refFormMail.value = ''
            refFormPassword.value = ''
            refFormName.value = ''
            refFormSurname.value = ''
            this.signedIn(true, response.result[0])
        } else {
            refBoxError.style.display = 'block'
            await this.wait(3000)
            refBoxError.style.display = 'none'

            this.signOut()
        }

        refBoxButton.style.display = 'block'
    }

    async signedIn (fromForm, userData) {
        let refBoxSignIn = document.getElementById('boxSignIn')
        let refBoxSignOut = document.getElementById('boxSignOut')
        let refSignedName = document.getElementById('textSignedName')

        this.userData = userData

        localStorage.setItem("loginId", userData.id)
        localStorage.setItem("loginToken", userData.tokens[0])

        try {
            refBoxSignIn.style.display = 'none'
            refBoxSignOut.style.display = 'block'
            refSignedName.textContent = userData.name
        } catch (err) {
            console.log(err)
        }

        if (fromForm) {
            setModal('modalSignUp', false)
            setModal('modalSignIn', false)
        }
    }

    async signOut () {

        let storageId = localStorage.getItem('loginId')
        let storageToken = localStorage.getItem('loginToken')
        let refBoxSignIn = document.getElementById('boxSignIn')
        let refBoxSignOut = document.getElementById('boxSignOut')
        let refSignedName = document.getElementById('textSignedName')
        let response = {}

        if (storageId == null || storageToken == null) return

        let obj = {
            type: 'signOut',
            signInId: parseInt(storageId),
            signInToken: storageToken
        }

        try {
            response = await this.queryServer('/query', obj)
        } catch (e) {
            console.log(e)
        }

        localStorage.removeItem('loginId')
        localStorage.removeItem('loginToken')

        try {
            refBoxSignIn.style.display = 'block'
            refBoxSignOut.style.display = 'none'
            refSignedName.textContent = 'Username'
        } catch (err) {
            console.log(err)
        }
    }

    async swapModal (modalId) {
        if (modalId == 'modalSignIn') {
            setModal('modalSignUp', false)
            await this.wait(250)
            setModal('modalSignIn', true)
        }
        if (modalId == 'modalSignUp') {
            setModal('modalSignIn', false)
            await this.wait(250)
            setModal('modalSignUp', true)
        }
    }

    async queryServer (url, obj) {
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

    async wait (time) {
        return new Promise((resolve, reject) => {
            setTimeout(() => { resolve() }, time)
        })
    }
}

user = new User()
// window.addEventListener('DOMContentLoaded', () => { user = new User() })