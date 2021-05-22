const content = findByID('infos-content')
const downloadTxtFileBtn = findByID('download-txt-button')
const roomList = JSON.parse(localStorage.getItem(SAVED_ROOM))
const roomListSize = roomList === null ? 0 : roomList.length

display()
downloadInfoInPlainText()

const saveBtnList = document.getElementsByClassName('save-room-btn')
const saveBtnLen = saveBtnList.length

removeSavedRoom()


function downloadInfoInPlainText() {
    if (roomListSize === 0) {
        downloadTxtFileBtn.style.display = 'none'
        return
    }
    downloadTxtFileBtn.addEventListener('click', () => {
        const text = generateReadableInfoFromList(roomList, roomListSize)
        console.log(text)
        createFileToDownload('txt', text)
    })
}

function createFileToDownload(fileExtension, text) {
    const file = new Blob([text], {type: 'text/plain'})
    const a = document.createElement('a')
    const url = window.URL.createObjectURL(file)
    a.href = url
    a.style.display = 'none'
    a.download = `UTAR_saved_accommodation.${fileExtension}`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
}


function display() {
    displayLoading(150)
    if (roomListSize === 0) {
        return
    }
    saveLinkBtn.innerText = roomListSize === 0 ? 'Saved' : `Saved(${roomListSize})`
    content.innerHTML = ''
    for (let index = 0; index < roomListSize; index++) {
        insertNewInfo(roomList[index], content)
    }
}

function generateReadableInfoFromList(roomList, roomListSize) {
    let information = '--NOTE: KP means Kampar AND SL means Sungai Long--\n\n'
    for (let i = 0; i < roomListSize; i++) {
        const room = roomList[i]
        information += addNewInfo(`Rental Room ID ${room.ID}\n------------------------`)
        information += addNewInfo(`Address: ${room.address}`)
        information += addNewInfo(`Available from: ${room.available_from.year} ${room.available_from.month}`)
        information += addNewInfo(`Remarks: ${processInfo(room.remarks)}`)
        information += addNewInfo(`Facilities: ${processInfo(room.facilities)}`)
        information += addNewInfo(`Contact Info: ${processContactInfo(room.name, room.hp_no, room.email)}`)
        information += addNewInfo(`Room Info: ${processRoomInfo(room.rooms)}`)
    }
    return Object.freeze(information)
}


function addNewInfo(newInfo) {
    return newInfo += '\n'
}

function processContactInfo(name, hp_no, email) {
    return `\n1) Name: ${name}\n` + `2) Contact Number: ${processInfo(hp_no)}\n` + `3) Email: ${processInfo(email)}`
}

function processRoomInfo(rooms) {
    let roomInfo = '\n'
    for (let i = 0; i < rooms.length; i++) {
        const room = rooms[i]
        roomInfo += addNewInfo(`${room.type} Room` + `\tRM ${room.price} / ${room.capacity} Tenant(s)`)
    }
    return Object.freeze(roomInfo)
}

function processInfo(info) {
    return (info.length === 0 || info === null) ? '*NOT PROVIDED*' : info
}

function removeSavedRoom() {
    for (let i = 0; i < saveBtnLen; i++) {
        const saveBtn = saveBtnList[i]
        saveBtn.innerHTML = 'Remove'
        saveBtn.addEventListener('click', () => {
            roomList.splice(i, 1)
            localStorage.setItem(SAVED_ROOM, JSON.stringify(roomList))
            location.reload()
        })
    }
}