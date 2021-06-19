const dropDownRCButton = findByID('room-capacity-button')
const dropDownRCContent = findByID('room-capacity-dropdown-content')
const roomCapacityList = findByClassName('room-capacity-list')
const roomCapacityListSize = roomCapacityList.length
const dropDownRC = findByID('room-capacity-dropdown')
const rcOptions = getAllRoomCapacityOption()
const clearRCBtn = findByClassName('rc-clear-button')
const searchRCBtn = findByClassName('rc-search-button')
const closeRCBtn = findByClassName('close-room')

let rcShow = false

filterRoomCapacity()
closeDropdownContent()
clearRoomCapacity()
activateClearRoomCapacityButton()
setRoomCapacityHTML(getSelectedCapacity())

function getSelectedCapacity() {
    const selectedCapacity = []
    for (let i = 0; i < rcOptions[0].length; i++) {
        const option = rcOptions[0][i];
        if (option.checked) {
            selectedCapacity.push(parseInt(option.className.replace('capacity-', '')))
        }
    }
    return Object.freeze(selectedCapacity)
}

function filterRoomCapacityListener() {
    displayLoading()
    const selectedCapacity = getSelectedCapacity()
    setRoomCapacityHTML(selectedCapacity)
    dropDownRCContent.style.display = 'none'
    rcShow = false
}

function filterRoomCapacity() {
    for (let i = 0; i < searchRCBtn.length; i++) {
        searchRCBtn[i].addEventListener('click', () => {
            filterContent.style.display = 'none';
            filterRoomCapacityListener();
            redirectFilter();
        })
    }
}


function activateClearRoomCapacityButton() {
    for (let j = 0; j < rcOptions.length; j++) {
        for (let k = 0; k < rcOptions[j].length; k++) {
            const element = rcOptions[j][k]
            if (element.checked) {
                for (let j = 0; j < clearRCBtn.length; j++) {
                    if (!clearRCBtn[j].className.includes(AVAILABLE)) {
                        clearRCBtn[j].className += AVAILABLE
                    }
                }
            }
            element.addEventListener('click', () => {
                if (element.checked) {
                    for (let k = 0; k < clearRCBtn.length; k++) {
                        if (!clearRCBtn[k].className.includes(AVAILABLE)) {
                            clearRCBtn[k].className += AVAILABLE
                        }
                    }
                    for (let i = 0; i < rcOptions.length; i++) {
                        rcOptions[i][k].checked = true
                    }
                } else {
                    let count = 0;
                    for (let i = 0; i < rcOptions.length; i++) {
                        rcOptions[i][k].checked = false
                    }
                    for (let j = 0; j < rcOptions[0].length; j++) {
                        if (!rcOptions[0][j].checked) {
                            count++
                        }
                    }
                    if (count === rcOptions[0].length) {
                        for (let j = 0; j < clearRCBtn.length; j++) {
                            clearRCBtn[j].className = 'rc-clear-button clear-button'
                        }
                        dropDownRCButton.innerHTML = 'Room Capacity'
                    }
                }
            })
        }
    }
}

function clearRoomCapacity() {
    for (let i = 0; i < clearRCBtn.length; i++) {
        clearRCBtn[i].addEventListener('click', () => {
            for (let j = 0; j < rcOptions.length; j++) {
                for (let k = 0; k < rcOptions[j].length; k++) {
                    rcOptions[j][k].checked = false
                }
            }
            for (let j = 0; j < clearRCBtn.length; j++) {
                clearRCBtn[j].className = 'rc-clear-button clear-button'
            }
            dropDownRCButton.innerHTML = 'Room Capacity'
            console.log('cancel all query..')
        })
    }
}

function setRoomCapacityHTML(selectedCapacity) {
    dropDownRCButton.innerHTML = selectedCapacity.length === 0 ? 'Room Capacity' : 'Room Capacity: ' + selectedCapacity + ' tenant(s)'
}

function getAllRoomCapacityOption() {
    const arrayOfOptions = [];
    for (let i = 0; i < roomCapacityListSize; i++) {
        const options = [];
        for (let j = 0; j < roomCapacityList[i].children.length; j++) {
            options.push(roomCapacityList[i].children[j].children[0])
        }
        arrayOfOptions.push(options)
    }
    return Object.freeze(arrayOfOptions)
}


function closeDropdownContent() {
    window.addEventListener('click', event => {
        const target = event.target;
        rcShow = detectClickOutsideOfDropdown(target, dropDownRC, dropDownRCContent, searchRCBtn, dropDownRCButton, closeRCBtn, rcShow);
    })
}