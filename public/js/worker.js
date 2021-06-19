self.addEventListener('message', e => {
    console.log('in worker class')
    self.postMessage(generateReadableInfoFromList(e.data.roomList, e.data.roomListSize));
}, false);


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
    return (info === null || info.length === 0) ? '*NOT PROVIDED*' : info
}