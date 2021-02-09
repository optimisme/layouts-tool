async function checkForm () {
    let refFormMail = document.getElementById('formMail')
    let refFormPwd = document.getElementById('formPassword')
    let refFormButton = document.getElementById('formButton')

    let validMail = refFormMail.checkValidity()
    let validPwd = refFormPwd.checkValidity()

    if (refFormMail.value == '') validMail = false
    if (refFormPwd.value == '') validPwd = false

    if (refFormMail && refFormPwd) {
        refFormButton.removeAttribute('disabled')
    } else {
        refFormButton.setAttribute('disabled', 'true')
    }
}

async function queryLogIn () {
    let refFormMail = document.getElementById('formMail')
    let refFormPwd = document.getElementById('formPassword')
    let refBoxButton = document.getElementById('boxButton')
    let refBoxSpinner = document.getElementById('boxSpinner')
    let refBoxError = document.getElementById('boxError')
    let response = {}

    let obj = {
        type: 'appLogIn',
        mail: refFormMail.value,
        contrasenya: refFormPwd.value
    }

    refBoxButton.style.display = 'none'
    refBoxSpinner.style.display = 'block'

    await wait(1000)
    try {
        response = await queryServer('/query', obj)
    } catch (e) {
        console.log(e)
    }
    refBoxSpinner.style.display = 'none'

    if (response.status == 'ok') {
        refFormMail.value = ''
        refFormPwd.value = ''
        checkForm()
        localStorage.setItem('id', response.result.id)
        localStorage.setItem('token', response.result.token) // Guardar al 'local storage' del navegador
        history.back() // Tornar a la pàgina anterior (que ha cridat a login)
    } else {
        refBoxError.style.display = 'block'
        await wait(3000)
        refBoxError.style.display = 'none'
    }

    refBoxButton.style.display = 'block'
}

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

async function wait (time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, time)
    })
}