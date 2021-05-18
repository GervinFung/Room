const KAMPAR = findByID('kampar')
const SGLONG = findByID('sg-long')
const ACTIVE = ' active-campus'
const AVAILABLE = ' available'

const dropDownRCButton = findByID('room-capacity-button')
const dropDownRCContent = findByID('room-capacity-dropdown-content')
const roomCapacityListSize = findByID('room-capacity-list').children.length
const dropDownRC = findByID('room-capacity-dropdown')
const rcOptions = getAllRoomCapacityOption()

function getAllRoomCapacityOption() {
    let options = []
    for (let i = 0; i < roomCapacityListSize; i++) {
        options.push(document.getElementById('capacity-' + (i)))
    }
    return Object.freeze(options)
}

const roomCapacitySaveButton = findByID('rc-save-button')
const roomCapacityClearButton = findByID('rc-clear-button')

let rcShow = false

function findByID(ID) {
    return document.getElementById(ID)
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

const waiting = findByID('waitingBackground')

function displayLoading(time) {
    waiting.style.display = 'flex'
    setTimeout(() => {
        waiting.style.display = 'none'
    }, time)
}

highlightActiveCampus()

filterRoomCapacity()
clearRoomCapacity()
activateClearRoomCapacityButton()
setRoomCapacityHTML(getSelectedCapacity())

function redirectFilter() {
  window.location.search = getQueryString()
}

function getQueryString() {
  const campusQ = 'campus=' + getActiveCampus()
  const minPriceQ = 'min=' + getMinPrice()
  const maxPriceQ = 'max=' + getMaxPrice()
  let capacityQ = ''
  let capacity = getSelectedCapacity()
  for (let i = 0; i < capacity.length; i++) {
    capacityQ += 'cap=' + capacity[i]
    if (i != capacity.length-1) {
      capacityQ += '&'
    }
  }
  return '?' + campusQ + '&' + minPriceQ + '&' + maxPriceQ + '&' + capacityQ
}

function getActiveCampus() {
  return getUrlParameter('campus')
}

function getMinPrice() {
  return lowerRangeScroll.value
}

function getMaxPrice() {
  return upperRangeScroll.value
}

function highlightActiveCampus() {
    if (getUrlParameter('campus') == 'KP') {
        changeClassName(KAMPAR, SGLONG)
    } else if (getUrlParameter('campus') == 'SL') {
        changeClassName(SGLONG, KAMPAR)
    }
}

function changeClassName(activeCampus, inactiveCampus) {
    activeCampus.className += ACTIVE
    inactiveCampus.className.replace(ACTIVE, '')
}

function getSelectedCapacity() {
  let selectedCapacity = []
  for (let i = 0; i < roomCapacityListSize; i++) {
      if (rcOptions[i].checked) {
          selectedCapacity.push(i)
      }
  }
  return Object.freeze(selectedCapacity)
}

function filterRoomCapacity() {
    roomCapacitySaveButton.addEventListener('click', () => {
        displayLoading(150)
        // doSearchUpdate()
        selectedCapacity = getSelectedCapacity()
        console.log('proceed with query..' + selectedCapacity)
        setRoomCapacityHTML(selectedCapacity)
        dropDownRCContent.style.display = 'none'
        rcShow = false
        redirectFilter()
    })
}

function activateClearRoomCapacityButton() {
    for (let i = 0; i < roomCapacityListSize; i++) {
        const element = rcOptions[i]
        element.addEventListener('click', () => {
            if (element.checked) {
                if (!roomCapacityClearButton.className.includes(AVAILABLE)) {
                    roomCapacityClearButton.className += AVAILABLE
                }
            } else {
                let count = 0
                for (let j = 0; j < roomCapacityListSize; j++) {
                    if (!rcOptions[j].checked) {
                        count++
                    }
                }
                if (count === roomCapacityListSize) {
                    roomCapacityClearButton.className = 'clear-button'
                    dropDownRCButton.innerHTML = 'Room Capacity'
                }
            }
        })
    }
}

function clearRoomCapacity() {
    roomCapacityClearButton.addEventListener('click', () => {
        for (let i = 0; i < roomCapacityListSize; i++) {
            rcOptions[i].checked = false
        }
        roomCapacityClearButton.className = 'clear-button'
        dropDownRCButton.innerHTML = 'Room Capacity'
        console.log('cancel all query..')
    })
}

function setRoomCapacityHTML(selectedCapacity) {
  dropDownRCButton.innerHTML = selectedCapacity.length === 0 ? 'Room Capacity' : 'Room Capacity: ' + selectedCapacity + ' tenant(s)'
}

let priceShow = false

const dropDownPriceButton = findByID('price-range-button')
const dropDownPrice = findByID('price-range-dropdown')
const dropDownPriceContent = findByID('price-range-dropdown-content')

const priceClearButton = findByID('price-clear-button')
const priceSaveButton = findByID('price-save-button')

const lowerRangeScroll = findByID('lower-range-scroll')
const upperRangeScroll = findByID('upper-range-scroll')

const lowerRangeInput = findByID('lower-range-input')
const upperRangeInput = findByID('upper-range-input')

const minPrice = lowerRangeInput.min, maxPrice = upperRangeInput.max

const numberRegex = /^\d+$/, nonNumberRegex = /[^\d]/g

setPriceRangeHTML()
filterPriceRange()
clearPriceRange()

function filterPriceRange() {
    priceSaveButton.addEventListener('click', () => {
        displayLoading(150)
        doSearchUpdate()
        const lowerRange = lowerRangeScroll.value
        const upperRange = upperRangeScroll.value
        console.log('proceed with query..' + lowerRange + ' ' + upperRange)
        dropDownPriceContent.style.display = 'none'
        priceShow = false
        dropDownPriceButton.innerHTML = parseInt(lowerRangeScroll.value) === minPrice && parseInt(upperRangeScroll.value) === maxPrice ? 'Price' : 'RM ' + lowerRange + ' - RM '  + upperRange
        redirectFilter()
    })
}

function clearPriceRange() {
    priceClearButton.addEventListener('click', () => {
        lowerRangeScroll.value = minPrice
        upperRangeScroll.value = maxPrice
        lowerRangeInput.value = lowerRangeScroll.value
        upperRangeInput.value = upperRangeScroll.value
        priceClearButton.className = 'clear-button'
        console.log('cancel all query..')
        dropDownPriceButton.innerHTML = 'Price'
    })
}

function setPriceRangeHTML() {
  console.log(getUrlParameter('cap'))
  const min = getUrlParameter('min')
  const max = getUrlParameter('max')
  if (min) {
    lowerRangeScroll.value = parseInt(min)
  } else {
    lowerRangeScroll.value = minPrice
  }
  if (max) {
    upperRangeScroll.value = parseInt(max)
  } else {
    upperRangeScroll.value = maxPrice
  }
  const lowerRange = lowerRangeScroll.value
  const upperRange = upperRangeScroll.value
  dropDownPriceButton.innerHTML = parseInt(lowerRange) == minPrice && parseInt(upperRange) == maxPrice ? 'Price' : 'RM ' + lowerRange + ' - RM '  + upperRange
}

function updatePriceValue(priceInput, priceScroll) {
    priceInput.value = priceScroll.value
    addUpdatePriceListener(priceScroll, priceInput)
    addInputPriceListener(priceInput, priceScroll)
}

function addInputPriceListener(inputElement, scrollElement) {
    inputElement.addEventListener('input', () => {
        if (!numberRegex.test(inputElement.value)) {
            inputElement.value = inputElement.value.replace(nonNumberRegex, '')
        }
        updateClearPriceRangeClassName()
        scrollElement.value = inputElement.value
    })
    inputElement.addEventListener('change', () => {
        const isLower = inputElement === lowerRangeInput
        const isUpper = inputElement === upperRangeInput
        if (inputElement.value === null || inputElement.value.length === 0) {
            if (isLower) {
                inputElement.value = minPrice
            } else if (isUpper) {
                inputElement.value = maxPrice
            }
        } else {
            const value = parseInt(inputElement.value)
            if (isLower) {
                const min = parseInt(inputElement.min)
                const upperRange = parseInt(upperRangeInput.value)
                if (value < min) {
                    inputElement.value = min
                } else if (value > upperRange) {
                    inputElement.value = upperRange
                }
            }
            else if (isUpper) {
                const max = parseInt(inputElement.max)
                const lowerRange = parseInt(lowerRangeInput.value)
                if (value < lowerRange) {
                    inputElement.value = lowerRange
                } else if (value > max) {
                    inputElement.value = max
                }
            }
        }
    })
}

function addUpdatePriceListener(scrollElement, inputElement) {
    scrollElement.addEventListener('input', () => {
        inputElement.value = scrollElement.value
        updateClearPriceRangeClassName()
    })
}

updatePriceValue(lowerRangeInput, lowerRangeScroll)
updatePriceValue(upperRangeInput, upperRangeScroll)

updatePriceRange()

function updatePriceRange() {
    addUpdateUpperRangeListener(lowerRangeScroll)
    addUpdateUpperRangeListener(lowerRangeInput)
    addUpdateLowerRangeListener(upperRangeScroll)
    addUpdateLowerRangeListener(upperRangeInput)
}

function addUpdateUpperRangeListener(elementToAddListener) {
    elementToAddListener.addEventListener('change', () => {
        const min = parseInt(elementToAddListener.value)
        if (min === upperRangeScroll.min) {return}
        upperRangeScroll.min = min
        upperRangeInput.min = min
    })
}

function addUpdateLowerRangeListener(elementToAddListener) {
    elementToAddListener.addEventListener('change', () => {
        const max = parseInt(elementToAddListener.value)
        if (max === lowerRangeScroll.max) {return}
        lowerRangeScroll.max = max
        lowerRangeInput.max = max
    })
}


function updateClearPriceRangeClassName() {
    if (parseInt(upperRangeScroll.value) == maxPrice && parseInt(lowerRangeScroll.value) == minPrice) {
        priceClearButton.className = 'clear-button'
        dropDownPriceButton.innerHTML = 'Price'
    }
    else if (!priceClearButton.className.includes(AVAILABLE)) {
        priceClearButton.className += AVAILABLE
    }
}

closeDropdownContent()

function closeDropdownContent() {
    window.addEventListener('click', event => {
        const target = event.target
        priceShow = detectClickOutsideOfDropdown(target, dropDownPrice, dropDownPriceContent, priceSaveButton, dropDownPriceButton, priceShow)
        rcShow = detectClickOutsideOfDropdown(target, dropDownRC, dropDownRCContent, roomCapacitySaveButton, dropDownRCButton, rcShow)
    })
}

function detectClickOutsideOfDropdown(target, dropdown, dropdownContent, saveButton, dropDownButton, show) {
    if (target === dropDownButton) {
        dropdownContent.style.display = show ? 'none' : 'block'
        return !show
    } else {
        const isClickOutsideOrSaveBtn = (target !== dropdown && !dropdown.contains(target)) || target === saveButton
        dropdownContent.style.display = isClickOutsideOrSaveBtn ? 'none' : 'block'
        return isClickOutsideOrSaveBtn ? false : true
    }
}

const advancedSearch = findByID('advanced-search')

startSearch()

function startSearch() {
    advancedSearch.addEventListener('keyup', event => {
        if (event.key === 'Enter') {
            displayLoading(500)
            console.log('Enter pressed')
        }
    })
}
