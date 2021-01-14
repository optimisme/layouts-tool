let body = {
    typeName: 'body',
    description: 'Body',
    image: '',
    tag: 'body',
    childsAllowed: 'all',
    style: [],
    phone: [],
    attributes: [],
    script: ``,
    text: ``,
    childs: []
}
let divAutocenter = {
    typeName: 'divAutocenter',
    description: 'Autocentered div',
    image: 'previewAutocenter.png',
    tag: 'div',
    childsAllowed: 'all',
    style: [
        ['padding', '0 16px', true],

        ['box-sizing', 'border-box', false],
        ['height', 'max-content', false],
        ['margin-left', 'auto', false],
        ['margin-right', 'auto', false],
        ['max-width', '1200px', false],
        ['width', '100%', false],
    ],
    phone: [],
    attributes: [],
    script: ``,
    text: ``,
    childs: []
}
let div = {
    typeName: 'div',
    description: 'Div',
    image: 'previewDivDecorated.png',
    tag: 'div',
    childsAllowed: 'all',
    style: [
        ['backdrop-filter', 'initial', true],
        ['background','initial', true],
        ['box-shadow', 'initial', true],
        ['border', 'initial', true],
        ['border-bottom', 'initial', true],
        ['border-left', 'initial', true],
        ['border-right', 'initial', true],
        ['border-top', 'initial', true],
        ['border-radius', 'initial', true],
        ['cursor', 'initial', true],
        ['filter', 'initial', true],
        ['height', 'max-content', true],
        //['min-height', 'initial', true],
        //['min-width', 'initial', true],
        //['max-height', 'initial', true],
        //['max-width', 'initial', true],
        ['opacity', 'initial', true],
        ['overflow', 'initial', true],
        ['padding', 'initial', true],
        ['transform', 'initial', true],
        ['transition', 'initial', true],
        ['width', 'initial', true],        
        ['z-index', 'initial', true],

        ['box-sizing', 'border-box', false],
        ['margin', '0', false],
    ],
    phone: [
        ['border', 'initial', true],
        ['border-bottom', 'initial', true],
        ['border-left', 'initial', true],
        ['border-right', 'initial', true],
        ['border-top', 'initial', true],
        ['border-radius', 'initial', true],
        ['height', 'initial', true],
        //['min-height', 'initial', true],
        //['min-width', 'initial', true],
        //['max-height', 'initial', true],
        //['max-width', 'initial', true],
        ['padding', 'initial', true],
        ['width', 'initial', true],
    ],
    attributes: [
        ['id', 'initial'],
        ['data-name', 'initial']
    ],
    script: ``,
    text: ``,
    childs: []
}

let divFlex = {
    typeName: 'divFlex',
    description: 'Flex',
    image: 'previewDivFlexRow.png',
    tag: 'div',
    childsAllowed: 'divFlexChild',
    style: [
        ['align-content', 'initial', true],
        ['align-items', 'initial', true],
        ['flex-direction', 'initial', true],
        ['flex-wrap', 'initial', true],
        ['height', 'initial', true],
        ['justify-content', 'initial', true],
        ['padding', 'initial', true],
        ['width', 'initial', true],

        ['box-sizing', 'border-box', false],
        ['display', 'flex', false],
        ['margin', '0', false],
    ],
    phone: [
        ['align-content', 'initial', true],
        ['align-items', 'initial', true],
        ['flex-direction', 'initial', true],
        ['flex-wrap', 'initial', true],
        ['height', 'initial', true],
        ['justify-content', 'initial', true],
        ['padding', 'initial', true],
        ['width', 'initial', true],
    ],
    attributes: [
        ['id', 'initial'],
    ],
    script: ``,
    text: ``,
    childs: []
}

let divFlexChild = {
    typeName: 'divFlexChild',
    description: 'Flex child',
    image: 'previewDivFlexChild.png',
    tag: 'div',
    childsAllowed: 'all',
    style: [
        ['align-items', 'initial', true],
        ['align-self', 'initial', true],
        ['flex-direction', 'initial', true],
        ['flex-grow', 'initial', true],
        ['justify-content', 'initial', true],
        ['min-height', 'initial', true],
        ['min-width', 'initial', true],
        ['max-height', 'initial', true],
        ['max-width', 'initial', true],
        ['padding', 'initial', true],
        // ['flex-shrink', 'initial', true],
        // ['order', 'initial', true],
        ['box-sizing', 'border-box', false],
        ['display', 'flex', false],
        ['margin', '0', false],
    ],
    phone: [
        ['align-items', 'initial', true],
        ['align-self', 'initial', true],
        ['flex-direction', 'initial', true],
        ['flex-grow', 'initial', true],
        ['justify-content', 'initial', true],
        ['min-height', 'initial', true],
        ['min-width', 'initial', true],
        ['max-height', 'initial', true],
        ['max-width', 'initial', true],
        ['padding', 'initial', true],
    ],
    attributes: [
        ['id', 'initial'],
    ],
    script: ``,
    text: ``,
    childs: []
}

let divGrid = {
    typeName: 'divGrid',
    description: 'Grid',
    image: 'previewDivGrid.png',
    tag: 'div',
    childsAllowed: 'divGridChild',
    style: [
        ['align-content', 'initial', true],
        ['align-items', 'initial', true],
        ['column-gap', 'initial', true],
        ['grid-auto-columns', 'initial', true],
        ['grid-auto-flow', 'initial', true],
        ['grid-auto-rows', 'initial', true],
        ['grid-template-areas', 'initial', true],
        ['grid-template-columns', 'initial', true],
        ['grid-template-rows', 'initial', true],
        ['height', 'initial', true],
        ['justify-items', 'initial', true],
        ['row-gap', 'initial', true],
        ['justify-content', 'initial', true],
        ['padding', 'initial', true],
        ['width', 'initial', true],

        ['box-sizing', 'border-box', false],
        ['display', 'grid', false],
        ['margin', '0', false],
    ],
    phone: [
        ['align-content', 'initial', true],
        ['align-items', 'initial', true],
        ['column-gap', 'initial', true],
        ['grid-auto-columns', 'initial', true],
        ['grid-auto-flow', 'initial', true],
        ['grid-auto-rows', 'initial', true],
        ['grid-template-areas', 'initial', true],
        ['grid-template-columns', 'initial', true],
        ['grid-template-rows', 'initial', true],
        ['height', 'initial', true],
        ['justify-items', 'initial', true],
        ['row-gap', 'initial', true],
        ['justify-content', 'initial', true],
        ['padding', 'initial', true],
        ['width', 'initial', true],
    ],
    attributes: [
        ['id', 'initial'],
    ],
    script: ``,
    text: ``,
    childs: []
}

let divGridChild = {
    typeName: 'divGridChild',
    description: 'Grid child',
    image: 'previewDivGridChild.png',
    tag: 'div',
    childsAllowed: 'all',
    style: [
        ['align-items', 'initial', true],
        ['align-self', 'initial', true],
        ['border', 'initial', true],
        ['border-bottom', 'initial', true],
        ['border-left', 'initial', true],
        ['border-right', 'initial', true],
        ['border-top', 'initial', true],
        ['flex-direction', 'initial', true],
        ['grid-area', 'initial', true],
        ['grid-auto-flow', 'initial', true],
        ['grid-column-start', 'initial', true],
        ['grid-column-end', 'initial', true],
        ['grid-row-start', 'initial', true],
        ['grid-row-end', 'initial', true],
        ['justify-content', 'initial', true],
        ['justify-self', 'initial', true],
        ['min-height', 'initial', true],
        ['min-width', 'initial', true],
        ['max-height', 'initial', true],
        ['max-width', 'initial', true],
        ['padding', 'initial', true],

        ['box-sizing', 'border-box', false],
        ['display', 'flex', false],
        ['margin', '0', false],
    ],
    phone: [
        ['align-items', 'initial', true],
        ['align-self', 'initial', true],
        ['flex-direction', 'initial', true],
        ['grid-area', 'initial', true],
        ['grid-auto-flow', 'initial', true],
        ['grid-column-start', 'initial', true],
        ['grid-column-end', 'initial', true],
        ['grid-row-start', 'initial', true],
        ['grid-row-end', 'initial', true],
        ['justify-content', 'initial', true],
        ['justify-self', 'initial', true],
        ['min-height', 'initial', true],
        ['min-width', 'initial', true],
        ['max-height', 'initial', true],
        ['max-width', 'initial', true],
        ['padding', 'initial', true],
    ],
    attributes: [
        ['id', 'initial'],
    ],
    script: ``,
    text: ``,
    childs: []
}

let divStack = {
    typeName: 'divStack',
    description: 'Stack',
    image: 'previewDivStack.png',
    tag: 'div',
    childsAllowed: 'divStackChild',
    style: [
        ['height', '100%', true],
        ['width', '100%', true],

        ['box-sizing', 'border-box', false],
        ['margin', '0', false],
        ['position', 'relative', false],
    ],
    phone: [],
    attributes: [
        ['id', 'initial'],
    ],
    script: ``,
    text: ``,
    childs: []
}

let divStackChild = {
    typeName: 'divStackChild',
    description: 'Stack child',
    image: 'previewDivStackChild.png',
    tag: 'div',
    childsAllowed: 'all',
    style: [
        ['bottom', 'initial', true],
        ['height', 'initial', true],
        ['left', 'initial', true],
        ['right', 'initial', true],
        ['top', 'initial', true],
        ['width', 'initial', true],

        ['box-sizing', 'border-box', false],
        ['position', 'absolute', false],
        ['margin', '0', false],
    ],
    phone: [
        ['bottom', 'initial', true],
        ['height', 'initial', true],
        ['left', 'initial', true],
        ['right', 'initial', true],
        ['top', 'initial', true],
        ['width', 'initial', true],

    ],
    attributes: [
        ['id', 'initial'],
    ],
    script: ``,
    text: ``,
    childs: []
}

let divSticky = {
    typeName: 'divSticky',
    description: 'Sticky div',
    image: 'previewDivSticky.png',
    tag: 'div',
    childsAllowed: 'all',
    style: [
        ['top', '0', true],
        ['z-index', '1000', true],

        ['box-sizing', 'border-box', false],
        ['margin', '0', false],
        ['position', 'sticky', false],
    ],
    phone: [
        ['top', '0', true],
    ],
    attributes: [
        ['id', 'initial'],
    ],
    script: ``,
    text: ``,
    childs: []
}

let divMobile = {
    typeName: 'divMobile',
    description: 'Div visible on mobile',
    image: 'previewDivMobile.png',
    tag: 'div',
    childsAllowed: 'all',
    style: [
        ['box-sizing', 'border-box', false],
        ['display', 'none', false],
        ['height', 'max-content', false],
        ['margin', '0', false],
        ['width', '100%', false],
    ],
    phone: [
        ['display', 'block', false], // TODO: comprovar, potser és initial no unset
    ],
    attributes: [],
    script: ``,
    text: ``,
    childs: []
}

let divDesktop = {
    typeName: 'divDesktop',
    description: 'Div visible on desktop',
    image: 'previewDivDesktop.png',
    tag: 'div',
    childsAllowed: 'all',
    style: [
        ['box-sizing', 'border-box', false],
        ['display', 'block', false],
        ['height', 'max-content', false],
        ['margin', '0', false],
        ['width', '100%', false],
    ],
    phone: [
        ['display', 'none', false],
    ],
    attributes: [],
    script: ``,
    text: ``,
    childs: []
}

let text = {
    typeName: 'text',
    description: 'Text',
    image: 'previewText.png',
    tag: 'div',
    childsAllowed: 'none',
    style: [
        ['color', 'initial', true],
        ['font-family', 'initial', true],
        ['font-size', '1em', true],
        ['font-style', 'initial', true],
        ['font-weight', 'initial', true],
        ['height', 'max-content', true],
        ['padding', 'initial', true],
        ['text-align', 'initial', true],
        ['text-decoration', 'initial', true],
        ['text-transform', 'initial', true],
        ['width', '100%', true],
        ['writing-mode', 'initial', true],

        ['box-sizing', 'border-box', false],
        ['margin', '0', false],
    ],
    phone: [
        ['height', 'initial', true],
        ['padding', 'initial', true],
        ['text-align', 'initial', true],
        ['width', 'initial', true],
        ['writing-mode', 'initial', true],
    ],
    attributes: [
        ['id', 'initial'],
    ],
    script: ``,
    text: `{{textSmall}}`,
    childs: []
}

let textInline = {
    typeName: 'textInline',
    description: 'Inline text',
    image: 'previewTextInline.png',
    tag: 'div',
    childsAllowed: 'none',
    style: [
        ['color', 'initial', true],
        ['font-family', 'initial', true],
        ['font-size', '1em', true],
        ['font-style', 'initial', true],
        ['font-weight', 'initial', true],
        ['text-decoration', 'initial', true],
        ['text-transform', 'initial', true],

        ['box-sizing', 'border-box', false],
        ['display', 'inline', false],
        ['height', 'max-content', false],
        ['margin', '0', false],
        ['width', 'max-content', false],
    ],
    phone: [],
    attributes: [
        ['id', 'initial'],
    ],
    script: ``,
    text: `{{textSmall}}`,
    childs: []
}

let textEllipsis = {
    typeName: 'textEllipsis',
    description: 'Text ellipsis',
    image: 'previewTextEllipsis.png',
    tag: 'div',
    childsAllowed: 'none',
    style: [
        ['color', 'initial', true],
        ['font-family', 'initial', true],
        ['font-size', '1em', true],
        ['font-style', 'initial', true],
        ['font-weight', 'initial', true],
        ['height', 'max-content', true],
        ['padding', 'initial', true],
        ['text-align', 'initial', true],
        ['text-decoration', 'initial', true],
        ['text-transform', 'initial', true],
        ['width', '100%', true],
        ['writing-mode', 'initial', true],

        ['box-sizing', 'border-box', false],
        ['margin', '0', false],
        ['overflow', 'hidden', false],
        ['text-overflow', 'ellipsis', false],
        ['white-space', 'nowrap', false],
    ],
    phone: [
        ['height', 'initial', true],
        ['padding', 'initial', true],
        ['text-align', 'initial', true],
        ['width', 'initial', true],
        ['writing-mode', 'initial', true],
    ],
    attributes: [
        ['id', 'initial'],
    ],
    script: ``,
    text: `{{textSmall}}`,
    childs: []
}

let titleh1 = {
    typeName: 'titleh1',
    description: 'H1',
    image: 'previewTitleH1.png',
    tag: 'h1',
    childsAllowed: 'none',
    style: [
        ['color', 'initial', true],
        ['font-family', 'initial', true],
        ['font-size', '2em', true],
        ['font-style', 'initial', true],
        ['font-weight', '800', true],
        ['height', 'max-content', true],
        ['padding', '0', true],
        ['text-align', 'initial', true],
        ['text-decoration', 'initial', true],
        ['text-transform', 'initial', true],
        ['width', '100%', true],
        ['writing-mode', 'initial', true],

        ['box-sizing', 'border-box', false],
        ['margin', '0', false],
    ],
    phone: [
        ['height', 'initial', true],
        ['padding', 'initial', true],
        ['text-align', 'initial', true],
        ['width', 'initial', true],
        ['writing-mode', 'initial', true],
    ],
    attributes: [
        ['id', 'initial'],
    ],
    script: ``,
    text: `{{title}}`,
    childs: []
}

let titleh2 = {
    typeName: 'titleh2',
    description: 'H2',
    image: 'previewTitleH2.png',
    tag: 'h2',
    childsAllowed: 'none',
    style: [
        ['color', 'initial', true],
        ['font-family', 'initial', true],
        ['font-size', '1.5em', true],
        ['font-style', 'initial', true],
        ['font-weight', '300', true],
        ['height', 'max-content', true],
        ['padding', '0', true],
        ['text-align', 'initial', true],
        ['text-decoration', 'initial', true],
        ['text-transform', 'initial', true],
        ['width', '100%', true],
        ['writing-mode', 'initial', true],

        ['box-sizing', 'border-box', false],
        ['margin', '0', false],
    ],
    phone: [
        ['height', 'initial', true],
        ['padding', 'initial', true],
        ['text-align', 'initial', true],
        ['width', 'initial', true],
        ['writing-mode', 'initial', true],
    ],
    attributes: [
        ['id', 'initial'],
    ],
    script: ``,
    text: `{{title}}`,
    childs: []
}

let titleh3 = {
    typeName: 'titleh3',
    description: 'H3',
    image: 'previewTitleH3.png',
    tag: 'h3',
    childsAllowed: 'none',
    style: [
        ['color', 'initial', true],
        ['font-family', 'initial', true],
        ['font-size', '1.25em', true],
        ['font-style', 'initial', true],
        ['font-weight', '600', true],
        ['height', 'max-content', true],
        ['padding', '0', true],
        ['text-align', 'initial', true],
        ['text-decoration', 'initial', true],
        ['text-transform', 'initial', true],
        ['width', '100%', true],
        ['writing-mode', 'initial', true],

        ['box-sizing', 'border-box', false],
        ['margin', '0', false],
    ],
    phone: [
        ['height', 'initial', true],
        ['padding', 'initial', true],
        ['text-align', 'initial', true],
        ['width', 'initial', true],
        ['writing-mode', 'initial', true],
    ],
    attributes: [
        ['id', 'initial'],
    ],
    script: ``,
    text: `{{title}}`,
    childs: []
}

let image = {
    typeName: 'image',
    description: 'Image',
    image: 'previewImage.png',
    tag: 'img',
    childsAllowed: 'none',
    style: [
        ['filter', 'initial', true],
        // ['object-fit', 'initial', true],

        ['box-sizing', 'border-box', false],
        ['margin', '0', false],
    ],
    phone: [],
    attributes: [
        ['id', 'initial'],
        ['src', '/tool/images/image0.jpg'],
        ['width', '100%'],
        ['height', 'initial'],
        ['alt', 'initial']
    ],
    script: ``,
    text: ``,
    childs: []  
}

let imageBackground = {
    typeName: 'imageBackground',
    description: 'CSS background image',
    image: 'previewImageBackground.png',
    tag: 'div',
    childsAllowed: 'all',
    style: [
        ['background', 'initial', true],
        ['background-attachment', 'initial', true],
        ['background-image','url(\'/tool/images/image0.jpg\')', true],
        ['background-position', 'center', true],
        ['background-repeat','no-repeat', true],
        ['background-size', 'cover', true],
        ['filter', 'initial', true],

        ['box-sizing', 'border-box', false],
        ['height', '100%', false],
        ['margin', '0', false],
        ['width', '100%', false],
    ],
    phone: [],
    attributes: [
        ['id', 'initial'],
    ],
    script: ``,
    text: ``,
    childs: []  
}

let linkBox = {
    typeName: 'linkBox',
    description: 'Link box',
    image: 'previewLinkBox.png',
    tag: 'a',
    childsAllowed: 'all',
    style: [
        ['height', 'max-content', true],
        ['padding', '0', false],
        ['text-decoration', 'none', true],
        ['text-transform', 'initial', true],
        ['width', 'max-content', true],

        ['box-sizing', 'border-box', false],
        ['display', 'block', false],
        ['margin', '0', false],
    ],
    phone: [
        ['height', 'max-content', true],
        ['padding', '0', false],
        ['width', 'max-content', true],
    ],
    attributes: [
        ['id', 'initial'],
        ['href', '/'],
        ['target', '_blank'],
        ['onclick', 'initial'],
    ],
    script: ``,
    text: ``,
    childs: []
}

let linkInline = {
    typeName: 'linkInline',
    description: 'Inline link',
    image: 'previewLinkInline.png',
    tag: 'a',
    childsAllowed: 'none',
    style: [
        ['color', 'initial', true],
        ['font-family', 'initial', true],
        ['font-size', '1em', true],
        ['font-weight', 'initial', true],
        ['text-decoration', 'initial', true],
        ['text-transform', 'initial', true],

        ['box-sizing', 'border-box', false],
        ['display', 'inline', false],
        ['height', 'max-content', false],
        ['margin', '0', false],
        ['width', 'max-content', false],
    ],
    phone: [],
    attributes: [
        ['id', 'initial'],
        ['href', '/'],
        ['target', '_blank'],
        ['onclick', 'initial'],
    ],
    script: ``,
    text: `{{link}}`,
    childs: []
}

let carouselImage = { typeName: 'carouselImage', description: 'Carousel image', image: '', tag: 'div', childsAllowed: 'all', style: [ ['background', 'lightgrey', true], ['background-image','url(\'/tool/images/image0.jpg\')', true], ['background-position', 'center', true],  ['background-repeat','no-repeat', true], ['background-size', 'cover', true] ], phone: [], attributes: [['data-name', 'carouselImage']], script: ``, text: ``, childs: [] }
let carouselImageA = JSON.parse(JSON.stringify(carouselImage))
    carouselImageA.style[1][1] = 'url(\'/tool/images/image4.jpg\')'
let carouselImageB = JSON.parse(JSON.stringify(carouselImage))
    carouselImageB.style[1][1] = 'url(\'/tool/images/image8.jpg\')'

let carouselImages = { typeName: 'carouselImages', description: 'Carousel images', tag: 'div', childsAllowed: 'carouselImage', style: [], phone: [], attributes: [['data-name', 'images']], script: ``, text: ``, childs: [carouselImageA, carouselImageB] }
let carouselFrame = { typeName: 'carouselFrame', description: 'Carousel frame', tag: 'div', childsAllowed: 'none', style: [['border-radius', 'initial', true], ['box-shadow', 'initial', true], ['height', '350px', true]], phone: [['height', 'initial', true]], attributes: [], script: ``, text: ``, childs: [carouselImages]}
let carouselArrowLeft = { typeName: 'carouselArrowLeft', description: 'Left arrow', tag: 'div', childsAllowed: 'none', style: [], phone: [], attributes: [ ['onclick', 'setCarouselArrows(this, \'left\')'] ], script: ``, text: ``, childs: [] }
let carouselArrowLeftBox = { typeName: 'carouselArrowLeftBox', description: 'Left arrow box', tag: 'div', childsAllowed: 'none', style: [], phone: [], attributes: [ ['class', 'carouselArrow'] ], script: ``, text: ``, childs: [carouselArrowLeft] }
let carouselArrowRight = { typeName: 'carouselArrowRight', description: 'Right arrow', tag: 'div', childsAllowed: 'none', style: [], phone: [], attributes: [ ['onclick', 'setCarouselArrows(this, \'right\')'] ], script: ``, text: ``, childs: [] }
let carouselArrowRightBox = { typeName: 'carouselArrowRightBox', description: 'Right arrow box', tag: 'div', childsAllowed: 'none', style: [], phone: [], attributes: [ ['class', 'carouselArrow carouselArrowRight'] ], script: ``, text: ``, childs: [carouselArrowRight] }
let carouselDotsIndicator = { typeName: 'carouselDotsIndicator', description: 'Carousel indicator', image: '', tag: 'div', childsAllowed: 'none', style: [], phone: [], attributes: [ ['data-name', 'indicator'], ['onclick', 'setCarouselDots(this)'] ], script: ``, text: ``, childs: [] }
let carouselDotsIndicators = { typeName: 'carouselDotsIndicators', description: 'Carousel indicators', tag: 'div', childsAllowed: 'carouselDotsIndicator', style: [], phone: [], attributes: [], script: ``, text: ``, childs: [carouselDotsIndicator, carouselDotsIndicator] }

let carouselDots = {
    typeName: 'carouselDots',
    description: 'Carousel with selectors',
    image: 'previewCarouselDots.png',
    tag: 'div',
    childsAllowed: 'none',
    style: [],
    phone: [],
    attributes: [
        ['id', 'initial'],
        ['class', 'carouselDots'],
    ],
    script: ``,
    text: ``,
    childs: [
        carouselFrame,
        carouselDotsIndicators
    ]
}

let carouselArrows = {
    typeName: 'carouselArrows',
    description: 'Carousel with arrows',
    image: 'previewCarouselArrows.png',
    tag: 'div',
    childsAllowed: 'none',
    style: [],
    phone: [],
    attributes: [
        ['id', 'initial'],
        ['class', 'carouselArrows'],
    ],
    script: ``,
    text: ``,
    childs: [
        carouselFrame,
        carouselArrowLeftBox,
        carouselArrowRightBox,
    ]
}

let drawerSide = { typeName: 'drawerSide', description: 'Drawer', image: '', tag: 'div', childsAllowed: 'all', style: [], phone: [], attributes: [ ['class', 'drawerSide'] ], script: ``, text: ``, childs: [] }
let drawer = {
    typeName: 'drawer',
    description: 'Drawer',
    image: 'previewDrawer.png',
    tag: 'div',
    childsAllowed: 'none',
    style: [],
    phone: [],
    attributes: [
        ['id', 'drawer'],
        ['class', 'drawer'],
        ['onclick', 'setDrawer(event, "drawer", false)']
    ],
    script: ``,
    text: ``,
    childs: [ drawerSide ]
}


let iconMaterial = {
    typeName: 'iconMaterial',
    description: 'Icon from material components',
    image: 'previewIconMaterial.png',
    tag: 'span',
    childsAllowed: 'none',
    style: [
        ['color', 'initial', true],
        ['font-size', 'initial', true],
    ],
    phone: [],
    attributes: [
        ['id', 'initial'],
        ['class', 'material-icons'],
    ],
    script: ``,
    text: `menu`,
    childs: []
}

let mapGoogle = {
    typeName: 'mapGoogle',
    description: 'Map from google maps',
    image: 'previewMapGoogle.png',
    tag: 'iframe',
    childsAllowed: 'none',
    style: [
        ['color', 'initial', true],
        ['font-size', 'initial', true],
    ],
    phone: [],
    attributes: [
        ['src', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2993.4493037886214!2d2.167108915743791!3d41.38604790404046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a4a2f3fecaf857%3A0x3ec5c68faba42d52!2sPla%C3%A7a%20de%20Catalunya%2C%201%2C%2008002%20Barcelona!5e0!3m2!1sca!2ses!4v1610619420858!5m2!1sca!2ses'],
        ['width', '100%'],
        ['height', '100%'],
        ['frameborder', '0'],
        ['allowfullscreen', 'true'],
        ['aria-hidden', 'false'],
        ['tabindex', '0'],
    ],
    script: ``,
    text: ``,
    childs: []
}

let formInputTextField = { typeName: 'formInputTextField', description: 'Input text', image: '', tag: 'input', childsAllowed: 'none', style: [], phone: [], attributes: [ ['id', 'formName'], ['type', 'text'], ['placeholder', 'yes'], ['pattern', '[^0-9]*'], ['autocomplete', 'off'], ], script: ``, text: ``, childs: [] }
let formInputTextLabel = { typeName: 'formInputTextLabel', description: 'Label', image: '', tag: 'label', childsAllowed: 'none', style: [], phone: [], attributes: [ ], script: ``, text: `Name`, childs: [] }
let formInputTextSpan = { typeName: 'formInputTextSpan', description: 'Error message', image: '', tag: 'span', childsAllowed: 'none', style: [], phone: [], attributes: [], script: ``, text: `Numbers are not allowed`, childs: [] }

let formInputText = {
    typeName: 'formInputText',
    description: 'Input text with pattern validation',
    image: 'previewFormInputText.png',
    tag: 'div',
    childsAllowed: 'none',
    style: [],
    phone: [],
    attributes: [
        ['class', 'formInputText'],
    ],
    script: ``,
    text: ``,
    childs: [
        formInputTextField,
        formInputTextLabel,
        formInputTextSpan
    ]
}

let formInputTextareaField = { typeName: 'formInputTextareaField', description: 'Input textarea', image: '', tag: 'textarea', childsAllowed: 'none', style: [], phone: [], attributes: [ ['id', 'formDescription'], ['placeholder', 'yes'], ['rows', 'initial'], ], script: ``, text: ``, childs: [] }
let formInputTextareaLabel = { typeName: 'formInputTextareaLabel', description: 'Label', image: '', tag: 'label', childsAllowed: 'none', style: [], phone: [], attributes: [ ], script: ``, text: `Description`, childs: [] }

let formInputTextarea = {
    typeName: 'formInputTextarea',
    description: 'Input textarea',
    image: 'previewFormInputTextarea.png',
    tag: 'div',
    childsAllowed: 'none',
    style: [],
    phone: [],
    attributes: [
        ['class', 'formInputTextarea'],
    ],
    script: ``,
    text: ``,
    childs: [
        formInputTextareaField,
        formInputTextareaLabel
    ]
}

let formInputSelectEmpty = { typeName: 'formInputSelectMain', description: 'Select option', image: '', tag: 'option', childsAllowed: 'none', style: [], phone: [], attributes: [['disabled', 'initial'], ['selected', 'initial'], ['value', '']], script: ``, text: ``, childs: [] }
let formInputSelectOption = { typeName: 'formInputSelectMain', description: 'Select option', image: '', tag: 'option', childsAllowed: 'none', style: [], phone: [], attributes: [['disabled', 'initial'], ['selected', 'initial'], ['value', 'initial']], script: ``, text: `Option`, childs: [] }
let formInputSelectMain = { typeName: 'formInputSelectMain', description: 'Select main', image: '', tag: 'select', childsAllowed: 'formInputSelectOption', style: [], phone: [], attributes: [['required', 'false'],], script: ``, text: ``, childs: [formInputSelectEmpty,formInputSelectOption] }
let formInputSelectHighlight = { typeName: 'formInputSelectHighlight', description: 'Select highlight', image: '', tag: 'span', childsAllowed: 'none', style: [], phone: [], attributes: [], script: ``, text: ``, childs: [] }
let formInputSelectBar = { typeName: 'formInputSelectBar', description: 'Select bar', image: '', tag: 'span', childsAllowed: 'none', style: [], phone: [], attributes: [], script: ``, text: ``, childs: [] }
let formInputSelectLabel = { typeName: 'formInputSelectLabel', description: 'Label', image: '', tag: 'label', childsAllowed: 'none', style: [], phone: [], attributes: [], script: ``, text: `Select`, childs: [] }

let formInputSelect = {
    typeName: 'formInputSelect',
    description: 'Select options',
    image: 'previewFormSelect.png',
    tag: 'div',
    childsAllowed: 'none',
    style: [],
    phone: [],
    attributes: [
        ['class', 'formSelect'],
    ],
    script: ``,
    text: ``,
    childs: [
        formInputSelectMain,
        formInputSelectHighlight,
        formInputSelectBar,
        formInputSelectLabel
    ]
}

let formInputCheckboxMain = { typeName: 'formInputCheckboxMain', description: 'Checkbox main', image: '', tag: 'input', childsAllowed: 'none', style: [], phone: [], attributes: [ ['id', 'initial'], ['value', 'initial'], ['checked', 'initial'], ['name', 'checkboxGroup'], ['type', 'checkbox'], ], script: ``, text: ``, childs: [] }
let formInputCheckboxSpan = { typeName: 'formInputCheckboxSpan', description: 'Checkbox span', image: '', tag: 'span', childsAllowed: 'none', style: [], phone: [], attributes: [], script: ``, text: `Checkbox`, childs: [] }

let formInputCheckbox = {
    typeName: 'formInputCheckbox',
    description: 'Checkbox',
    image: 'previewFormCheckbox.png',
    tag: 'label',
    childsAllowed: 'none',
    style: [],
    phone: [],
    attributes: [
        ['class', 'formCheckbox'],
    ],
    script: ``,
    text: ``,
    childs: [
        formInputCheckboxMain,
        formInputCheckboxSpan,
    ]
}

let formInputRadioMain = { typeName: 'formInputRadioMain', description: 'Radio main', image: '', tag: 'input', childsAllowed: 'none', style: [], phone: [], attributes: [ ['id', 'initial'], ['value', 'initial'], ['checked', 'initial'], ['name', 'radioGroup'], ['type', 'radio'], ], script: ``, text: ``, childs: [] }
let formInputRadioSpan = { typeName: 'formInputRadioSpan', description: 'Radio span', image: '', tag: 'span', childsAllowed: 'none', style: [], phone: [], attributes: [], script: ``, text: `Radio`, childs: [] }

let formInputRadio = {
    typeName: 'formInputRadio',
    description: 'Radio',
    image: 'previewFormRadio.png',
    tag: 'label',
    childsAllowed: 'none',
    style: [],
    phone: [],
    attributes: [
        ['class', 'formRadio'],
    ],
    script: ``,
    text: ``,
    childs: [
        formInputRadioMain,
        formInputRadioSpan,
    ]
}

let formInputRangeMain = { typeName: 'formInputRangeMain', description: 'Range main', image: '', tag: 'input', childsAllowed: 'none', style: [], phone: [], attributes: [ ['id', 'initial'], ['value', 'initial'], ['list', 'initial'], ['min', '0'], ['max', '100'], ['step', 'initial'], ['type', 'range'], ], script: ``, text: ``, childs: [] }
let formInputRangeSpan = { typeName: 'formInputRangeSpan', description: 'Range span', image: '', tag: 'span', childsAllowed: 'none', style: [], phone: [], attributes: [], script: ``, text: `Range slider`, childs: [] }

let formInputRange = {
    typeName: 'formInputRange',
    description: 'Range slider',
    image: 'previewFormRange.png',
    tag: 'label',
    childsAllowed: 'none',
    style: [],
    phone: [],
    attributes: [
        ['class', 'formRange'],
    ],
    script: ``,
    text: ``,
    childs: [
        formInputRangeMain,
        formInputRangeSpan,
    ]
}


let formButton = {
    typeName: 'formButton',
    description: 'Button for forms',
    image: 'previewFormButton.png',
    tag: 'button',
    childsAllowed: 'none',
    style: [
        ['text-transform', 'uppercase', false]
    ],
    phone: [],
    attributes: [
        ['class', 'formButton'],
        ['onclick', 'initial'],
    ],
    script: ``,
    text: `Button`,
    childs: []
}


/*
let div = {
    description: 'Div',
    image: 'previewDiv.png',
    tag: 'div',
    childsAllowed: 'all',
    style: [
        ['backdrop-filter', 'initial', true],
        ['background', 'initial', true],
        ['background-position', 'initial', true],
        ['background-repeat','initial', true],
        ['background-size', 'initial', true],
        ['background-image','initial', true],

        ['box-shadow', 'initial', true],

        ['position', 'initial', true],
        ['bottom', 'initial', true],
        ['left', 'initial', true],
        ['right', 'initial', true],
        ['top', 'initial', true],

        ['border-color', 'initial', true],
        ['border-radius', 'initial', true],
        ['border-style', 'initial', true],
        ['border-width', 'initial', true],

        ['border-bottom', 'initial', true],
        ['border-left', 'initial', true],
        ['border-right', 'initial', true],
        ['border-top', 'initial', true],

        ['margin-bottom', 'initial', true],
        ['margin-left', 'initial', true],
        ['margin-right', 'initial', true],
        ['margin-top', 'initial', true],

        ['padding-bottom', 'initial', true],
        ['padding-left', 'initial', true],
        ['padding-right', 'initial', true],
        ['padding-top', 'initial', true],

        ['min-height', 'initial', true],
        ['max-height', 'initial', true],
        ['height', 'initial', true],

        ['min-width', 'initial', true],
        ['max-width', 'initial', true],
        ['width', 'initial', true],

        ['overflow', 'initial', true],

        ['text-align', 'initial', true],
        ['writing-mode', 'initial', true],
    ],
    phone: [],
    attributes: [],
    script: ``,
    text: ``,
    childs: []
}



*/