const allRoomsInPage = document.getElementsByClassName('infos')
const length = allRoomsInPage.length
let savedInnerHTML = []
const SAVED_INNER_HTML = 'SAVED_INNER_HTML'

const savedDialog = document.getElementById('saved-dialog')

saveRoom()

function saveRoom() {
    for (let index = 0; index < length; index++) {
        const room = allRoomsInPage[index]
        room.addEventListener('click', e => {
            const HTML = '<div class="infos">' + room.innerHTML + '</div>'
            if (savedInnerHTML.includes(HTML)) {
                const index = savedInnerHTML.indexOf(HTML)
                if (index > -1) {
                    savedInnerHTML.splice(index, 1)
                    displayMsg('Unsaved!', e)
                }
            } else {
                savedInnerHTML.push(HTML)
                displayMsg('Saved!', e)
            }
            sessionStorage.setItem(SAVED_INNER_HTML, savedInnerHTML)
        })
    }
}

function displayMsg(text, e) {
    savedDialog.innerText = text
    savedDialog.style.display = 'flex'
    savedDialog.style.left = e.pageX + 'px'
    savedDialog.style.top = e.pageY + 'px'
    setTimeout(() => {
        savedDialog.style.display = 'none'
    }, 250)
}