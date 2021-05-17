const allRoomsInPage = document.getElementsByClassName('infos')
const length = allRoomsInPage.length
let savedInnerHTML = []
const content = findByID('infos-content')
const saveBtn = findByID('saved-button')

const SAVED_INNER_HTML = 'SAVED_INNER_HTML'
// const fs = require('fs')

saveRoom()
showSaved()

function saveRoom() {
    for (let index = 0; index < length; index++) {
        const room = allRoomsInPage[index]
        room.addEventListener('click', () => {
            sessionStorage.removeItem(SAVED_INNER_HTML)
            const HTML = '<div class="infos">' + room.innerHTML + '</div>'
            const TEXT = room.innerText
            if (savedInnerHTML.includes(HTML)) {
                const index = savedInnerHTML.indexOf(HTML)
                if (index > -1) {
                    savedInnerHTML.splice(index, 1)
                }
            } else {
                savedInnerHTML.push(HTML)
            }
            sessionStorage.setItem(SAVED_INNER_HTML, savedInnerHTML)
        })
    }
}

function showSaved() {
    saveBtn.addEventListener('click', () => {
        displayLoading(150)
        const innerHTML = getInnerHtml()
        // writeToHTMLFile(innerHTML)
        content.innerHTML = innerHTML
    })
}

function getInnerHtml() {
    let innerHTML = ''
    const list = sessionStorage.getItem(SAVED_INNER_HTML)
    for (let index = 0; index < list.length; index++) {
        innerHTML += list[index]
    }
    return Object.freeze(innerHTML)
}

// function writeToHTMLFile(innerHTML) {
//     const file = fs.createWriteStream('./files/saved.html')
//     file.write(innerHTML)
//     file.end()
// }