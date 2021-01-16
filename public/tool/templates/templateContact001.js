/**
 * Check if the form is valid
 * if it is valid: activates the button
 * if it isn't valid: disables the button
 */
async function checkForm () {
    let refFormName = document.getElementById('formName')
    let refFormMail = document.getElementById('formMail')
    let refFormDescription = document.getElementById('formDescription')
    let refFormButton = document.getElementById('formButton')

    let validName = refFormName.checkValidity()
    let validMail = refFormMail.checkValidity()
    let validDescription = true

    if (refFormName.value == '') validName = false
    if (refFormMail.value == '') validMail = false
    if (refFormDescription.value == '') validDescription = false

    if (validName && validMail && validDescription) {
        refFormButton.removeAttribute('disabled')
    } else {
        refFormButton.setAttribute('disabled', 'true')
    }
}

/**
 * Sends the data form the form to the server
 * with a query of type 'contact'
 */
async function queryContact () {
    let refFormName = document.getElementById('formName')
    let refFormMail = document.getElementById('formMail')
    let refFormDescription = document.getElementById('formDescription')
    let response = {}

    let obj = {
        type: 'contact',
        name: refFormName.value,
        mail: refFormMail.value,
        description: refFormDescription.value,
    }

    await hideElement('boxButton')
    await showElement('boxSpinner')

    await wait(1000)
    try {
        response = await queryServer('/query', obj)
    } catch (e) {
        console.log(e)
    }
    await hideElement('boxSpinner')

    if (response.status == 'ok') {
        refFormName.value = ''
        refFormMail.value = ''
        refFormDescription.value = ''
        checkForm()

        await showElement('boxOk')
        await wait(3500)
        await hideElement('boxOk')
    } else {
        await showElement('boxError')
        await wait(3500)
        await hideElement('boxError')
    }

    await showElement('boxButton')
}

/**
 * Hides an element
 * @param {id} id of the element to hide
 */
async function hideElement (id) {
    document.getElementById(id).style.display = 'none'
}

/**
 * Shows an element
 * @param {id} id of the element to show
 */
async function showElement (id) {
    document.getElementById(id).style.display = 'block'
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