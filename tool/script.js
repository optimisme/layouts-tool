function setCarouselDots(ref) {
    let cnt = 0
    let obj = ref.parentNode.parentNode
    let refImages = obj.querySelector('div[name="images"]')
    let refIndicators = obj.querySelectorAll('div[name="indicator"]')

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
    let cnt = 0
    let num = 0
    let obj = ref.parentNode.parentNode
    let refImages = obj.querySelector('div[name="images"]')
    let numImages = (refImages.querySelectorAll('div[name="carouselImage"]')).length

    if (refImages.style.transform != '') {
        num = -1 * (parseInt((refImages.style.transform.replace('translateX(', '')).replace('%)', '')) / 100)
    }

    if (direction == 'left') { num = num - 1; } else { num = num + 1; }
    if (num < 0) { num = numImages - 1; } 
    if (num >= numImages) { num = 0; }

    refImages.style.transform = 'translateX(-' + (num * 100) + '%)'
}