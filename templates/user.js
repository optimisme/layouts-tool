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
        let refFormMail = document.getElementById('formSignInMail')
        let refFormPassword = document.getElementById('formSignInPassword')
        let refFormButton = document.getElementById('formSignInButton')

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
        let refFormMail = document.getElementById('formSignInMail')
        let refFormPassword = document.getElementById('formSignInPassword')
        let refBoxButton = document.getElementById('boxSignInButton')
        let refBoxSpinner = document.getElementById('boxSignInSpinner')
        let refBoxError = document.getElementById('boxSignInError')
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
        let refFormMail = document.getElementById('formSignUpMail')
        let refFormPassword = document.getElementById('formSignUpPassword')
        let refFormName = document.getElementById('formSignUpName')
        let refFormSurname = document.getElementById('formSignUpSurname')
        let refFormButton = document.getElementById('formSignUpButton')

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
        let refFormMail = document.getElementById('formSignUpMail')
        let refFormPassword = document.getElementById('formSignUpPassword')
        let refFormName = document.getElementById('formSignUpName')
        let refFormSurname = document.getElementById('formSignUpSurname')
        let refBoxButton = document.getElementById('boxSignUpButton')
        let refBoxSpinner = document.getElementById('boxSignUpSpinner')
        let refBoxError = document.getElementById('boxSignUpError')
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

        try {
            let refFormMail = document.getElementById('formUserEditMail')
            let refFormPassword = document.getElementById('formUserEditPassword')
            let refFormName = document.getElementById('formUserEditName')
            let refFormSurname = document.getElementById('formUserEditSurname')

            refFormMail.value = this.userData.email
            refFormPassword.value = ''
            refFormName.value = this.userData.name
            refFormSurname.value = this.userData.surname

            let refBoxUserMessage = document.getElementById('boxEditUserMessage')
            let refBoxUserForm = document.getElementById('boxEditUserForm')

            refBoxUserMessage.style.display = 'none'
            refBoxUserForm.style.display = 'block'

        } catch (err) {
            console.log(err)
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

        try {
            let refFormMail = document.getElementById('formUserEditMail')
            let refFormPassword = document.getElementById('formUserEditPassword')
            let refFormName = document.getElementById('formUserEditName')
            let refFormSurname = document.getElementById('formUserEditSurname')

            refFormMail.value = ''
            refFormPassword.value = ''
            refFormName.value = ''
            refFormSurname.value = ''

            let refBoxUserMessage = document.getElementById('boxEditUserMessage')
            let refBoxUserForm = document.getElementById('boxEditUserForm')

            refBoxUserMessage.style.display = 'block'
            refBoxUserForm.style.display = 'none'

        } catch (err) {
            console.log(err)
        }
    }

    async checkFormUserEdit () {
        let refFormMail = document.getElementById('formUserEditMail')
        let refFormPassword = document.getElementById('formUserEditPassword')
        let refFormName = document.getElementById('formUserEditName')
        let refFormSurname = document.getElementById('formUserEditSurname')
        let refFormButton = document.getElementById('formUserEditButton')

        let validMail = refFormMail.checkValidity()
        let validPassword = refFormPassword.checkValidity()
        let validName = refFormName.checkValidity()
        let validSurname = refFormSurname.checkValidity()

        if (refFormMail.value == '') validMail = false
        if (refFormName.value == '') validName = false
        if (refFormSurname.value == '') validSurname = false

        if (validMail && validPassword && validName && validSurname) {
            refFormButton.removeAttribute('disabled')
        } else {
            refFormButton.setAttribute('disabled', 'true')
        }
    }

    async userEdit () {
        let storageId = localStorage.getItem('loginId')
        let storageToken = localStorage.getItem('loginToken')
        let refFormMail = document.getElementById('formUserEditMail')
        let refFormPassword = document.getElementById('formUserEditPassword')
        let refFormName = document.getElementById('formUserEditName')
        let refFormSurname = document.getElementById('formUserEditSurname')
        let refBoxButton = document.getElementById('boxUserEditButton')
        let refBoxSpinner = document.getElementById('boxUserEditSpinner')
        let refBoxError = document.getElementById('boxUserEditError')
        let response = {}

        let obj = {
            type: 'userEdit',
            signInId: parseInt(storageId),
            signInToken: storageToken,
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
        }

        refBoxButton.style.display = 'block'
    }

    async swapModal (modalId) {
        if (modalId != 'modalSignIn') await setModal('modalSignIn', false)
        if (modalId != 'modalSignUp') await setModal('modalSignUp', false)
        await setModal(modalId, true)
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