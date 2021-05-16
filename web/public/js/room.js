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
        options.push(document.getElementById('capacity-' + (i + 1)))
    }
    return Object.freeze(options)
}

const roomCapacitySaveButton = findByID('rc-save-button')
const roomCapacityClearButton = findByID('rc-clear-button')

let rcShow = false

function findByID(ID) {
    return document.getElementById(ID)
}

highlightActiveCampus()

showRoomCapacityDropDown()
filterRoomCapacity()
clearRoomCapacity()
activateClearRoomCapacityButton()

function highlightActiveCampus() {
    if (location.href.includes('room?campus=KP')) {
        changeClassName(KAMPAR, SGLONG)
    } else if (location.href.includes('room?campus=SL')) {
        changeClassName(SGLONG, KAMPAR)
    }
}

function changeClassName(activeCampus, inactiveCampus) {
    activeCampus.className += ACTIVE
    inactiveCampus.className.replace(ACTIVE, '')
}


//show drop down
function showRoomCapacityDropDown() {
    dropDownRCButton.addEventListener('click', () => {
        dropDownRCContent.style.display = rcShow ? 'none' : 'block'
        rcShow = !rcShow
    })
}

function getSelectedCapacity() {
  let selectedCapacity = []
  for (let i = 0; i < roomCapacityListSize; i++) {
      if (rcOptions[i].checked) {
          selectedCapacity.push(i + 1)
      }
  }
  return selectedCapacity
}

function filterRoomCapacity() {
    roomCapacitySaveButton.addEventListener('click', () => {
        doSearchUpdate()
        selectedCapacity = getSelectedCapacity()
        console.log('proceed with query..' + selectedCapacity)
        dropDownRCButton.innerHTML = selectedCapacity.length === 0 ? 'Room Capacity' : 'Room Capacity: ' + selectedCapacity + ' tenant(s)'
        dropDownRCContent.style.display = 'none'
        rcShow = false
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

const minPrice = 100, maxPrice = 1000

showPriceDropDown()
filterPriceRange()
clearPriceRange()

updateLowerRangePriceValue()
updateUpperRangePriceValue()

function showPriceDropDown() {
    dropDownPriceButton.addEventListener('click', () => {
        dropDownPriceContent.style.display = priceShow ? 'none' : 'block'
        priceShow = !priceShow
    })
}

function filterPriceRange() {
    priceSaveButton.addEventListener('click', () => {
        doSearchUpdate()
        const lowerRange = lowerRangeScroll.value
        const upperRange = upperRangeScroll.value
        console.log('proceed with query..' + lowerRange + ' ' + upperRange)
        dropDownPriceContent.style.display = 'none'
        priceShow = false
        dropDownPriceButton.innerHTML = lowerRangeScroll.value == minPrice && upperRangeScroll.value == maxPrice ? 'Price' : 'RM ' + lowerRange + ' - RM '  + upperRange
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

function updateLowerRangePriceValue() {
    lowerRangeInput.value = lowerRangeScroll.value
    lowerRangeScroll.addEventListener('input', () => {
        lowerRangeInput.value = lowerRangeScroll.value
        updateClearPriceRangeClassName()
    })
    lowerRangeInput.addEventListener('input', () => {
        lowerRangeScroll.value = lowerRangeInput.value
        updateClearPriceRangeClassName()
    })
}

function updateUpperRangePriceValue() {
    upperRangeInput.value = upperRangeScroll.value
    upperRangeScroll.addEventListener('input', () => {
        upperRangeInput.value = upperRangeScroll.value
        updateClearPriceRangeClassName()
    })
    upperRangeInput.addEventListener('input', () => {
        upperRangeScroll.value = upperRangeInput.value
        updateClearPriceRangeClassName()
    })
}

function updateClearPriceRangeClassName() {
    if (upperRangeScroll.value == maxPrice && lowerRangeScroll.value == minPrice) {
        priceClearButton.className = 'clear-button'
        dropDownPriceButton.innerHTML = 'Price'
        return
    }
    addAvailableToPriceBtnClassName()
}

function addAvailableToPriceBtnClassName() {
    if (!priceClearButton.className.includes(AVAILABLE)) {
        priceClearButton.className += AVAILABLE
    }
}

closeDropdownContent()

function closeDropdownContent() {
    window.addEventListener('click', event => {
        const target = event.target
        detectClickOutsideOfDropdown(target, dropDownPrice, dropDownPriceContent, priceSaveButton, priceShow)
        detectClickOutsideOfDropdown(target, dropDownRC, dropDownRCContent, roomCapacitySaveButton, rcShow)
    })
}

function detectClickOutsideOfDropdown(target, dropdown, dropdownContent, saveButton, show) {
    const isClickOutsideOrSaveBtn = (target !== dropdown && !dropdown.contains(target)) || target === saveButton
    dropdownContent.style.display = isClickOutsideOrSaveBtn ? 'none' : 'block'
    show = isClickOutsideOrSaveBtn ? false : true
}