const searchRCBtn = findByID('rc-search-button')
const searchPriceBtn = findByID('price-search-button')

const dropDownRCButton = findByID('room-capacity-button')
const dropDownRCContent = findByID('room-capacity-dropdown-content')
const roomCapacityList = findByID('room-capacity-list')
const roomCapacityListSize = roomCapacityList.children.length
const dropDownRC = findByID('room-capacity-dropdown')
const rcOptions = getAllRoomCapacityOption()
const clearRCBtn = findByID('rc-clear-button')

const advancedSearch = document.getElementsByClassName('advanced-search')
const saveBtnList = document.getElementsByClassName('save-room-btn')

const dropDownPriceButton = findByID('price-range-button')
const dropDownPrice = findByID('price-range-dropdown')
const dropDownPriceContent = findByID('price-range-dropdown-content')
const clearPriceBtn = findByID('price-clear-button')
const lowerRangeScroll = findByID('lower-range-scroll')
const upperRangeScroll = findByID('upper-range-scroll')
const lowerRangeInput = findByID('lower-range-input')
const upperRangeInput = findByID('upper-range-input')
const minPrice = parseInt(lowerRangeInput.min), maxPrice = parseInt(upperRangeInput.max)
const numberRegex = /^\d+$/, nonNumberRegex = /[^\d]/g

let savedRoomList = []
let rcShow = false
let priceShow = false

saveRoom()
filterRoomCapacity()
filterPriceRange()
closeDropdownContent()

startSearch()
clearRoomCapacity()
activateClearRoomCapacityButton()
setRoomCapacityHTML(getSelectedCapacity())
setPriceRangeHTML()
clearPriceRange()
updatePriceValue()
changeSaveBtnInnerHTML()
activateClearPriceButton()


function consistOf(savedRoomStorage, ID) {
    if (savedRoomStorage === null) {
        return -1
    }
    for (let i = 0; i < savedRoomStorage.length; i++) {
        const room = savedRoomStorage[i]
        if (room.ID === ID) {
            return i
        }
    }
    return -1
}

function saveRoom() {
    for (let i = 0; i < allInfosLength; i++) {
        const btn = saveBtnList[i]
        btn.addEventListener('click', () => {
            const parsedElem = allInfos[i]
            const savedRoomStorage = JSON.parse(localStorage.getItem(SAVED_ROOM))

            if (savedRoomStorage !== null) {savedRoomList = savedRoomStorage}

            const index = consistOf(savedRoomStorage, parsedElem.ID)

            if (index !== -1) {
                savedRoomList.splice(index, 1)
            } else {
                savedRoomList.push(parsedElem)
            }

            btn.innerHTML = btn.innerHTML === 'Save' ? 'Unsave' : 'Save'

            const saveSize = savedRoomList.length

            saveLinkBtn.innerText = saveSize === 0 ? 'Saved' : `Saved(${saveSize})`

            localStorage.setItem(SAVED_ROOM, JSON.stringify(savedRoomList))
        })
    }
}

//temporary solution
function changeSaveBtnInnerHTML() {
    const savedRoomStorage = JSON.parse(localStorage.getItem(SAVED_ROOM))
    if (savedRoomStorage !== null) {
        const sum = savedRoomStorage.length
        if (sum === 0) {return}
        for (let i = 0; i < allInfosLength; i++) {
            const room = allInfos[i]
            const index = consistOf(savedRoomStorage, room.ID, room.address)
            if (index !== -1) {
                saveBtnList[i].innerHTML = 'Unsave'
            }
        }
        saveLinkBtn.innerText = `Saved(${sum})`
    }
}



//room capacity
function getAllRoomCapacityOption() {
    let options = []
    for (let i = 0; i < roomCapacityListSize; i++) {
        options.push(roomCapacityList.children[i].children[0])
    }
    return Object.freeze(options)
}


function startSearch() {
    for(let i = 0; i < advancedSearch.length; i++) {
        advancedSearch[i].addEventListener('keyup', event => {
            if (event.key === 'Enter') {
                displayLoading()
                console.log('Enter pressed')
            }
        })
    }
}

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



// room capacity
function getSelectedCapacity() {
  let selectedCapacity = []
  for (let i = 0; i < roomCapacityListSize; i++) {
      if (rcOptions[i].checked) {
          selectedCapacity.push(i)
      }
  }
  return Object.freeze(selectedCapacity)
}

function filterRoomCapacityListener() {
    displayLoading()
    selectedCapacity = getSelectedCapacity()
    setRoomCapacityHTML(selectedCapacity)
    dropDownRCContent.style.display = 'none'
    rcShow = false
}

function activateClearRoomCapacityButton() {
    for (let i = 0; i < roomCapacityListSize; i++) {
        const element = rcOptions[i]
        if (element.checked) {
            if (!clearRCBtn.className.includes(AVAILABLE)) {
                clearRCBtn.className += AVAILABLE
            }
        }
        element.addEventListener('click', () => {
            if (element.checked) {
                if (!clearRCBtn.className.includes(AVAILABLE)) {
                    clearRCBtn.className += AVAILABLE
                }
            } else {
                let count = 0
                for (let j = 0; j < roomCapacityListSize; j++) {
                    if (!rcOptions[j].checked) {
                        count++
                    }
                }
                if (count === roomCapacityListSize) {
                    clearRCBtn.className = 'clear-button'
                    dropDownRCButton.innerHTML = 'Room Capacity'
                }
            }
        })
    }
}

function clearRoomCapacity() {
    clearRCBtn.addEventListener('click', () => {
        for (let i = 0; i < roomCapacityListSize; i++) {
            rcOptions[i].checked = false
        }
        clearRCBtn.className = 'clear-button'
        dropDownRCButton.innerHTML = 'Room Capacity'
        console.log('cancel all query..')
    })
}

function setRoomCapacityHTML(selectedCapacity) {
  dropDownRCButton.innerHTML = selectedCapacity.length === 0 ? 'Room Capacity' : 'Room Capacity: ' + selectedCapacity + ' tenant(s)'
}



// price
function updatePriceValue() {
    addScrollPriceListener()
    upperRangeInputListener()
    lowerRangeInputListener()
    lowerRangeInput.value = lowerRangeScroll.value
    upperRangeInput.value = upperRangeScroll.value
}

function filterPriceRangeListener() {
    displayLoading()
    const lowerRange = lowerRangeScroll.value
    const upperRange = upperRangeScroll.value
    console.log('proceed with query..' + lowerRange + ' ' + upperRange)
    dropDownPriceContent.style.display = 'none'
    priceShow = false
    dropDownPriceButton.innerHTML = parseInt(lowerRangeScroll.value) === minPrice && parseInt(upperRangeScroll.value) === maxPrice ? 'Price' : 'RM ' + lowerRange + ' - RM '  + upperRange
}

function clearPriceRange() {
    clearPriceBtn.addEventListener('click', () => {
        lowerRangeScroll.value = minPrice
        upperRangeScroll.value = maxPrice
        lowerRangeInput.value = lowerRangeScroll.value
        upperRangeInput.value = upperRangeScroll.value
        clearPriceBtn.className = 'clear-button'
        console.log('cancel all query..')
        dropDownPriceButton.innerHTML = 'Price'
    })
}

function setPriceRangeHTML() {
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
  lowerRangeInput.value = lowerRangeScroll.value
  upperRangeInput.value = upperRangeScroll.value
  const lowerRange = lowerRangeScroll.value
  const upperRange = upperRangeScroll.value
  dropDownPriceButton.innerHTML = parseInt(lowerRange) === minPrice && parseInt(upperRange) === maxPrice ? 'Price' : 'RM ' + lowerRange + ' - RM '  + upperRange
}

function upperRangeInputListener() {
    upperRangeInput.addEventListener('input', () => {
        if (!numberRegex.test(upperRangeInput.value)) {
            upperRangeInput.value = upperRangeInput.value.replace(nonNumberRegex, '')
        }
        activateClearPriceButton()
        upperRangeScroll.value = upperRangeInput.value
        addUpdateLowerRangeListener(upperRangeInput)
    })
    upperRangeInput.addEventListener('change', () => {
        const value = upperRangeInput.value
        if (value === null || value.length === 0) {
            upperRangeInput.value = maxPrice
        } else {
            const parsedValue = parseInt(value)
            const max = parseInt(upperRangeInput.max)
            const lowerRange = parseInt(lowerRangeInput.value)
            if (parsedValue < lowerRange) {
                upperRangeInput.value = lowerRange
            } else if (parsedValue > max) {
                upperRangeInput.value = max
            }
        }
    })
}

function lowerRangeInputListener() {
    lowerRangeInput.addEventListener('input', () => {
        if (!numberRegex.test(lowerRangeInput.value)) {
            lowerRangeInput.value = lowerRangeInput.value.replace(nonNumberRegex, '')
        }
        activateClearPriceButton()
        lowerRangeScroll.value = lowerRangeInput.value
        addUpdateUpperRangeListener(lowerRangeInput)
    })
    lowerRangeInput.addEventListener('change', () => {
        const value = lowerRangeInput.value
        if (value === null || value.length === 0) {
            lowerRangeInput.value = minPrice
        } else {
            const parsedValue = parseInt(value)
            const min = parseInt(lowerRangeInput.min)
            const upperRange = parseInt(upperRangeInput.value)
            if (parsedValue < min) {
                lowerRangeInput.value = min
            } else if (parsedValue > upperRange) {
                lowerRangeInput.value = upperRange
            }
        }
    })
}

function addScrollPriceListener() {
    upperRangeScroll.addEventListener('input', () => {
        upperRangeInput.value = upperRangeScroll.value
        addUpdateLowerRangeListener(upperRangeScroll)
        activateClearPriceButton()
    })
    lowerRangeScroll.addEventListener('input', () => {
        lowerRangeInput.value = lowerRangeScroll.value
        addUpdateUpperRangeListener(lowerRangeScroll)
        activateClearPriceButton()
    })
}

function addUpdateUpperRangeListener(lowerRange) {
    const min = parseInt(lowerRange.value)
    if (min >= upperRangeScroll.value) {
        upperRangeScroll.value = min
        upperRangeInput.value = min
    }
}

function addUpdateLowerRangeListener(upperRange) {
    const max = parseInt(upperRange.value)
    if (max <= lowerRangeScroll.value) {
        lowerRangeScroll.value = max
        lowerRangeInput.value = max
    }
}

function activateClearPriceButton() {
    if (parseInt(upperRangeScroll.value) === maxPrice && parseInt(lowerRangeScroll.value) === minPrice) {
        clearPriceBtn.className = 'clear-button'
        dropDownPriceButton.innerHTML = 'Price'
    }
    else if (!clearPriceBtn.className.includes(AVAILABLE)) {
        clearPriceBtn.className += AVAILABLE
    }
}

//filter
function filterRoomCapacity() {
    searchRCBtn.addEventListener('click', () => {
        filterRoomCapacityListener()
        redirectFilter()
        console.log('proceed with query..' + selectedCapacity)
    })
}

function filterPriceRange() {
    searchPriceBtn.addEventListener('click', () => {
        filterPriceRangeListener()
        redirectFilter()
    })
}


function closeDropdownContent() {
    window.addEventListener('click', event => {
        const target = event.target
        priceShow = detectClickOutsideOfDropdown(target, dropDownPrice, dropDownPriceContent, searchPriceBtn, dropDownPriceButton, priceShow)
        rcShow = detectClickOutsideOfDropdown(target, dropDownRC, dropDownRCContent, searchRCBtn, dropDownRCButton, rcShow)
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