const closePriceBtn = findByClassName('close-price')
const searchPriceBtn = findByClassName('price-search-button')

const dropDownPriceButton = findByID('price-range-button')
const dropDownPrice = findByID('price-range-dropdown')
const dropDownPriceContent = findByID('price-range-dropdown-content')
const clearPriceBtn = findByClassName('price-clear-button')
const lowerRangeScroll = findByClassName('lower-range-scroll')
const upperRangeScroll = findByClassName('upper-range-scroll')
const lowerRangeInput = findByClassName('lower-range-input')
const upperRangeInput = findByClassName('upper-range-input')
const adjustmentSigns = findByClassName('adjustment-sign')
const minPrice = parseInt(lowerRangeInput[0].min), maxPrice = parseInt(upperRangeInput[0].max)
const numberRegex = /^\d+$/, nonNumberRegex = /[^\d]/g

let priceShow = false

filterPriceRange()
setPriceRangeHTML()
clearPriceRange()
updatePriceValue()
closeDropdownContent()
activateClearPriceButton()

function updatePriceValue() {
    addScrollPriceListener()
    upperRangeInputListener()
    lowerRangeInputListener()
    addAdjustSignListener()
    for (let i = 0; i < lowerRangeInput.length; i++) {
        lowerRangeInput[i].value = lowerRangeScroll[0].value
    }
    for (let i = 0; i < upperRangeInput.length; i++) {
        upperRangeInput[i].value = upperRangeScroll[0].value
    }
}

function filterPriceRangeListener() {
    displayLoading()
    const lowerRange = lowerRangeScroll[0].value
    const upperRange = upperRangeScroll[0].value
    console.log('proceed with query..' + lowerRange + ' ' + upperRange)
    dropDownPriceContent.style.display = 'none'
    priceShow = false
    dropDownPriceButton.innerHTML = parseInt(lowerRangeScroll[0].value) === minPrice && parseInt(upperRangeScroll[0].value) === maxPrice ? 'Price' : 'RM ' + lowerRange + ' - RM '  + upperRange
}

function clearPriceRange() {
    for (let i = 0; i < clearPriceBtn.length; i++) {
        clearPriceBtn[i].addEventListener('click', () => {
            for (let i = 0; i < lowerRangeScroll.length; i++) {
                lowerRangeScroll[i].value = minPrice
            }
            for (let i = 0; i < upperRangeScroll.length; i++) {
                upperRangeScroll[i].value = maxPrice
            }

            for (let i = 0; i < lowerRangeInput.length; i++) {
                lowerRangeInput[i].value = lowerRangeScroll[0].value
            }
            for (let i = 0; i < upperRangeInput.length; i++) {
                upperRangeInput[i].value = upperRangeScroll[0].value
            }
            for (let j = 0; j < clearPriceBtn.length; j++) {
                clearPriceBtn[j].className = 'price-clear-button clear-button'
            }
            console.log('cancel all query..')
            dropDownPriceButton.innerHTML = 'Price'
        })
    }

}

function setPriceRangeHTML() {
    const min = getUrlParameter('min')
    const max = getUrlParameter('max')
    if (min) {
        for (let i = 0; i < lowerRangeScroll.length; i++) {
            lowerRangeScroll[i].value = parseInt(min)
        }
    } else {
        for (let i = 0; i < lowerRangeScroll.length; i++) {
            lowerRangeScroll[i].value = minPrice
        }
    }
    if (max) {
        for (let i = 0; i < upperRangeScroll.length; i++) {
            upperRangeScroll[i].value = parseInt(max)
        }
    } else {
        for (let i = 0; i < upperRangeScroll.length; i++) {
            upperRangeScroll[i].value = maxPrice
        }
    }
    for (let i = 0; i < lowerRangeInput.length; i++) {
        lowerRangeInput[i].value = lowerRangeScroll[0].value
    }
    for (let i = 0; i < upperRangeInput.length; i++) {
        upperRangeInput[i].value = upperRangeScroll[0].value
    }
    const lowerRange = lowerRangeScroll[0].value
    const upperRange = upperRangeScroll[0].value
    dropDownPriceButton.innerHTML = parseInt(lowerRange) === minPrice && parseInt(upperRange) === maxPrice ? 'Price' : 'RM ' + lowerRange + ' - RM '  + upperRange
}

function upperRangeInputListener() {
    for (let i = 0; i < upperRangeInput.length; i++) {
        const upperInput = upperRangeInput[i];
        upperInput.addEventListener('input', () => {
            if (!numberRegex.test(upperInput.value)) {
                for (let j = 0; j < upperRangeInput.length; j++) {
                    upperRangeInput[j].value = lowerInput.value.replace(nonNumberRegex, '')
                }
            }
            activateClearPriceButton()
            for (let j = 0; j < upperRangeScroll.length; j++) {
                upperRangeScroll[j].value = upperInput.value
            }
            for (let j = 0; j < upperRangeScroll.length; j++) {
                upperRangeInput[j].value = upperInput.value
            }
            addUpdateLowerRangeListener(upperRangeInput)
        })
        upperInput.addEventListener('change', () => {
            const value = upperInput.value
            if (value === null || value.length === 0) {
                for (let j = 0; j < upperRangeScroll.length; j++) {
                    upperRangeInput[j].value = maxPrice
                }
            } else {
                const parsedValue = parseInt(value)
                const max = parseInt(upperRangeInput.max)
                const lowerRange = parseInt(lowerRangeInput[0].value)
                if (parsedValue < lowerRange) {
                    for (let j = 0; j < upperRangeScroll.length; j++) {
                        upperRangeInput[j].value = lowerRange
                    }
                } else if (parsedValue > max) {
                    for (let j = 0; j < upperRangeScroll.length; j++) {
                        upperRangeInput[j].value = max
                    }
                }
            }
        })
    }
}

function lowerRangeInputListener() {
    for (let i = 0; i < lowerRangeInput.length; i++) {
        const lowerInput = lowerRangeInput[i];
        lowerInput.addEventListener('input', () => {
            if (!numberRegex.test(lowerInput.value)) {
                for (let j = 0; j < lowerRangeInput.length; j++) {
                    lowerRangeInput[j].value = lowerInput.value.replace(nonNumberRegex, '')
                }
            }
            activateClearPriceButton()
            for (let j = 0; j < lowerRangeScroll.length; j++) {
                lowerRangeScroll[j].value = lowerInput.value
            }
            for (let j = 0; j < lowerRangeInput.length; j++) {
                lowerRangeInput[j].value = lowerInput.value
            }
            addUpdateUpperRangeListener(lowerRangeInput)
        })
        lowerInput.addEventListener('change', () => {
            const value = lowerInput.value
            if (value === null || value.length === 0) {
                for (let j = 0; j < lowerRangeInput.length; j++) {
                    lowerRangeInput[j].value = minPrice
                }
            } else {
                const parsedValue = parseInt(value)
                const min = parseInt(lowerInput.min)
                const upperRange = parseInt(upperRangeInput[0].value)
                if (parsedValue < min) {
                    for (let j = 0; j < lowerRangeInput.length; j++) {
                        lowerRangeInput[j].value = min
                    }
                } else if (parsedValue > upperRange) {
                    for (let j = 0; j < lowerRangeInput.length; j++) {
                        lowerRangeInput[j].value = upperRange
                    }
                }
            }
        })
    }
}

function addScrollPriceListener() {
    for (let i = 0; i < upperRangeScroll.length; i++) {
        upperRangeScroll[i].addEventListener('input', () => {
            for (let j = 0; j < upperRangeScroll.length; j++) {
                upperRangeScroll[j].value = upperRangeScroll[i].value;
            }
            for (let j = 0; j < upperRangeInput.length; j++) {
                upperRangeInput[j].value = upperRangeScroll[i].value;
            }
            addUpdateLowerRangeListener(upperRangeScroll)
            activateClearPriceButton()
        })
    }
    for (let i = 0; i < lowerRangeScroll.length; i++) {
        lowerRangeScroll[i].addEventListener('input', () => {
            for (let j = 0; j < lowerRangeScroll.length; j++) {
                lowerRangeScroll[j].value = lowerRangeScroll[i].value
            }
            for (let j = 0; j < lowerRangeInput.length; j++) {
                lowerRangeInput[j].value = lowerRangeScroll[i].value
            }
            addUpdateUpperRangeListener(lowerRangeScroll)
            activateClearPriceButton()
        })
    }
}

function addUpdateUpperRangeListener(lowerRange) {
    const min = parseInt(lowerRange[0].value)
    if (min >= upperRangeScroll[0].value) {
        for (let i = 0; i < upperRangeScroll.length; i++) {
            upperRangeScroll[i].value = min
        }
        for (let i = 0; i < upperRangeInput.length; i++) {
            upperRangeInput[i].value = min
        }
    }
}

function addUpdateLowerRangeListener(upperRange) {
    const max = parseInt(upperRange[0].value)
    if (max <= lowerRangeScroll[0].value) {
        for (let i = 0; i < lowerRangeScroll.length; i++) {
            lowerRangeScroll[i].value = max
        }
        for (let i = 0; i < lowerRangeInput.length; i++) {
            lowerRangeInput[i].value = max
        }
    }
}

let priceChangeInterval = null;
let priceChangeTimeout = null;

function changePriceValue(sign, scrollElem, numberElem) {
    const oldValue = parseInt(scrollElem.value)
    const operationMultiply = sign === "+" ? 1 : -1
    scrollElem.value = oldValue + parseInt(scrollElem.step) * operationMultiply
    numberElem.value = scrollElem.value
    scrollElem.dispatchEvent(new Event('input'))
}

function startChangingPrice(sign) {
    const scrollElem = sign.parentElement.getElementsByTagName('input')[0]
    const numberElem = sign.parentElement.nextElementSibling.getElementsByTagName('input')[0]
    const signContent = sign.textContent
    changePriceValue(signContent, scrollElem, numberElem)
    priceChangeTimeout = setTimeout(() => {
        priceChangeInterval = setInterval(() => {changePriceValue(signContent, scrollElem, numberElem)}, 10)
    }, 500)
}

function addAdjustSignListener() {
    for (const sign of adjustmentSigns) {
        sign.addEventListener('click', () => {sign.parentElement.getElementsByTagName('input')[0].focus()})
        sign.addEventListener('mousedown', () =>{startChangingPrice(sign)})
        sign.addEventListener('mouseup', () => {
            clearInterval(priceChangeInterval)
            clearTimeout(priceChangeTimeout)
        })
    }
}

function activateClearPriceButton() {
    for (let i = 0; i < clearPriceBtn.length; i++) {
        if (parseInt(upperRangeScroll[0].value) === maxPrice && parseInt(lowerRangeScroll[0].value) === minPrice) {
            clearPriceBtn[i].className = 'price-clear-button clear-button'
            dropDownPriceButton.innerHTML = 'Price'
        }
        else if (!clearPriceBtn[i].className.includes(AVAILABLE)) {
            clearPriceBtn[i].className += AVAILABLE
        }
    }
}

//filter

function filterPriceRange() {
    for (let i = 0; i < searchPriceBtn.length; i++) {
        searchPriceBtn[i].addEventListener('click', () => {
            filterContent.style.display = 'none';
            filterPriceRangeListener();
            redirectFilter();
        })
    }
}

function closeDropdownContent() {
    window.addEventListener('click', event => {
        const target = event.target;
        priceShow = detectClickOutsideOfDropdown(target, dropDownPrice, dropDownPriceContent, searchPriceBtn, dropDownPriceButton, closePriceBtn, priceShow);
    })
}