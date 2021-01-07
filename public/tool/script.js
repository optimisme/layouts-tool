async function promiseCallServer (method, url, obj) {

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

        req.open(method, url, true)
        req.send(JSON.stringify(obj))
    })
}

async function promiseWait (time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, time)
    })
}


/*
function setCarouselDots(ref) {
    let cnt = 0
    let obj = ref.parentNode.parentNode
    let refImages = obj.querySelector('div[data-name="images"]')
    let refIndicators = obj.querySelectorAll('div[data-name="indicator"]')

    for (cnt = 0; cnt < refIndicators.length; cnt = cnt + 1) {
        if (refIndicators[cnt] == ref) {
            refImages.style.transform = 'translateX(-' + (cnt * 100) + '%)'
            refIndicators[cnt].classList.add('carouselDotsSelected')
            refIndicators[cnt].classList.remove('carouselDotsUnselected')
        } else {
            refIndicators[cnt].classList.remove('carouselDotsSelected')
            refIndicators[cnt].classList.add('carouselDotsUnselected')
        }
    }
}

function setCarouselArrows(ref, direction) {
    let num = 0
    let obj = ref.parentNode.parentNode
    let refImages = obj.querySelector('div[data-name="images"]')
    let numImages = (refImages.querySelectorAll('div[data-name="carouselImage"]')).length

    if (refImages.style.transform != '') {
        num = -1 * (parseInt((refImages.style.transform.replace('translateX(', '')).replace('%)', '')) / 100)
    }

    if (direction == 'left') { num = num - 1; } else { num = num + 1; }
    if (num < 0) { num = numImages - 1; } 
    if (num >= numImages) { num = 0; }

    refImages.style.transform = 'translateX(-' + (num * 100) + '%)'
}

async function setDrawer (event, id, show) {
    let refBody = document.getElementsByTagName('body')[0]
    let refDrawer = document.getElementById(id)

    if (typeof event !== 'undefined' && typeof event.stopPropagation === 'function') {
        if (event.cancelable) event.preventDefault()
        event.stopPropagation()
        target = event.target.id
    }

    // Development environment
    if (document.getElementsByTagName('sdw-tool-preview').length > 0) {
        let refContentDesktop = document.getElementsByTagName('sdw-tool-preview')[0].shadow.querySelector('div[name="contentDesktop"]')
        let refContentPhone = document.getElementsByTagName('sdw-tool-preview')[0].shadow.querySelector('div[name="contentPhone"]')
        let childs = document.getElementsByTagName('sdw-tool-preview')[0].shadow.querySelectorAll('div[id="' + id + '"]')

        let refDrawerDesktop = childs[0]
        let refDrawerPhone = childs[1]

        if (show) {
            refContentDesktop.style.overflow = 'hidden'
            refContentPhone.style.overflow = 'hidden'
            refDrawerDesktop.style.display = 'flex'
            refDrawerPhone.style.display = 'flex'
            await promiseWait(300) 
            refDrawerDesktop.style.opacity = '1'
            refDrawerPhone.style.opacity = '1'
            refDrawerDesktop.querySelector('div[class="drawerSide"]').style.transform = 'translate3d(0px, 0, 0)'
            refDrawerPhone.querySelector('div[class="drawerSide"]').style.transform = 'translate3d(0px, 0, 0)'
        } else {
            refDrawerDesktop.style.opacity = '0'
            refDrawerPhone.style.opacity = '0'
            refDrawerDesktop.querySelector('div[class="drawerSide"]').style.transform = 'translate3d(-250px, 0, 0)'
            refDrawerPhone.querySelector('div[class="drawerSide"]').style.transform = 'translate3d(-250px, 0, 0)' 
            await promiseWait(300)
            refContentDesktop.style.overflow = 'initial'
            refContentPhone.style.overflow = 'initial'
            refDrawerDesktop.style.display = 'none'
            refDrawerPhone.style.display = 'none'
        }
    } else {
        if (show) {
            refBody.style.overflow = 'hidden'
            refDrawer.style.display = 'flex'
            await promiseWaitUntilPropertyValue(refDrawer, 'display', 'flex')  
            refDrawer.style.opacity = '1'
            refDrawer.querySelector('div[class="drawerSide"]').style.transform = 'translate3d(0px, 0, 0)'
        } else {
            refDrawer.style.opacity = '0'
            refDrawer.querySelector('div[class="drawerSide"]').style.transform = 'translate3d(-250px, 0, 0)'
            await promiseTransitionEnd(refDrawer)
            refBody.style.overflow = 'initial'
            refDrawer.style.display = 'none'
        }
    }
}

async function promiseWait (time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, time)
    })
}

function promiseWaitUntilPropertyValue (ref, property, value) {
    return new Promise(async (resolve, reject) => {
        let style = window.getComputedStyle(ref)
        let now = style.getPropertyValue(property)

        if (now === value) {
            resolve()
        } else {
            await promiseWait(1)
            await promiseWaitUntilPropertyValue(ref, property, value)
        }
    }) 
}

function promiseTransitionEnd (ref) {
    return new Promise(async (resolve, reject) => {
        ref.addEventListener('transitionend', () => {
            resolve()
        })
    })  
}
*/