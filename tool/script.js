function setCarouselDots(ref) {
    let cnt = 0
    let obj = ref.parentNode.parentNode
    let refImages = obj.querySelector('div[name="images"]')
    let refIndicators = obj.querySelectorAll('div[name="indicator"]')
    console.log(obj)
    console.log(refImages)
    console.log(refIndicators)
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