const advancedSearch = findByClassName('advanced-search')
const saveBtnList = findByClassName('save-room-btn')
const filterContent = findByID('filter-content')

let savedRoomList = []

saveRoom()
changeSaveBtnInnerHTML()
startSearch()
filterAndCloseFilterAddListener()

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
            btn.className = btn.className === SAVE_BTN ? UNSAVE_BTN : SAVE_BTN

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
        const saved = []
        const sum = savedRoomStorage.length
        if (sum === 0) {return}
        for (let i = 0; i < allInfosLength; i++) {
            const room = allInfos[i]
            const index = consistOf(savedRoomStorage, room.ID, room.address)
            if (index !== -1) {
                saved.push(saveBtnList[i])
            }
        }
        for (let i = 0; i < saved.length; i++) {
            const btn = saved[i]
            btn.className = UNSAVE_BTN
            btn.innerHTML = 'Unsave'
        }
        saveLinkBtn.innerText = `Saved(${sum})`
    }
}



//room capacity


function startSearch() {
    for(let i = 0; i < advancedSearch.length; i++) {
        advancedSearch[i].addEventListener('keyup', event => {
            if (event.key === 'Enter') {
                displayLoading()
                console.log('Enter pressed')
                redirectFilter()
            }
        })
    }
}

function redirectFilter() {
  window.location.search = getQueryString()
}

function getQueryString() {
  let queryString = '?'
  queryString += 'campus=' + getActiveCampus()
  queryString += '&min=' + getMinPrice()
  queryString += '&max=' + getMaxPrice()
  let capacityQ = ''
  let capacity = getSelectedCapacity()
  for (let i = 0; i < capacity.length; i++) {
    capacityQ += '&cap=' + capacity[i]
  }
  queryString += capacityQ
  if (getAddress()) {
    queryString += '&address=' + getAddress()
  }
  if (getRemarks()) {
    queryString += '&remarks=' + getRemarks()
  }
  if (getFacilities()) {
    queryString += '&facilities=' + getFacilities()
  }
  return queryString
}

function getActiveCampus() {
  return getUrlParameter('campus')
}

function getMinPrice() {
  return lowerRangeScroll[0].value
}

function getMaxPrice() {
  return upperRangeScroll[0].value
}

function getAddress() {
  return advancedSearch[0].value
}

function getRemarks() {
  return advancedSearch[1].value
}

function getFacilities() {
  return advancedSearch[2].value
}

function filterAndCloseFilterAddListener() {
    findByID('filter').addEventListener('click', () => {
        filterContent.style.display = 'block';
    })
    findByID('close-button').addEventListener('click', () => {
        filterContent.style.display = 'none';
    })
}


function detectClickOutsideOfDropdown(target, dropdown, dropdownContent, searchButton, dropDownButton, closeBtn, show) {
    for (let i = 0; i < closeBtn.length; i++) {
        if (target === closeBtn[i]) {
            dropdownContent.style.display = 'none'
            return false
        }
    }
    let isSearch = false;
    for (let i = 0; i < searchButton.length; i++) {
        if (target === searchButton[i]) {
            isSearch = true;
            break;
        }
    }
    if (target === dropDownButton) {
        dropdownContent.style.display = show ? 'none' : 'block'
        return !show
    } else {
        const isClickOutsideOrSaveBtn = (target !== dropdown && !dropdown.contains(target)) || isSearch
        dropdownContent.style.display = isClickOutsideOrSaveBtn ? 'none' : 'block'
        return !isClickOutsideOrSaveBtn
    }
}
