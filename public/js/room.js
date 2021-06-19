const KAMPAR = findByID('kampar')
const SGLONG = findByID('sg-long')
const ACTIVE = ' active-campus'
const AVAILABLE = ' available-clear'

const SAVED_ROOM = 'SAVED_ROOM'
const SAVE_BTN = 'save-room-btn'
const UNSAVE_BTN = 'unsave-room-btn'

const waiting = findByID('waitingBackground')
const saveLinkBtn = findByID('saved-button')

const firstEscapeChar = /[\[]/, secondEscapeChar = '\\['
const firstEscapeCharReplace = /[\]]/, secondEscapeCharReplace = '\\]'
const plusSignRegex = /\+/g
const regUrl = '[\\?&]'
const exUrl = '=([^&#]*)'

highlightActiveCampus()
displaySavedLoading()
displayCampusLoading()
restorePage()

function findByID(ID) {return document.getElementById(ID)}
function findByClassName(className) {return document.getElementsByClassName(className)}

function getUrlParameter(name) {
    name = name.replace(firstEscapeChar, secondEscapeChar).replace(firstEscapeCharReplace, secondEscapeCharReplace)
    const results = new RegExp(regUrl + name + exUrl).exec(location.search)
    return results === null ? '' : decodeURIComponent(results[1].replace(plusSignRegex, ' '))
}

function highlightActiveCampus() {
    if (getUrlParameter('campus') === 'KP') {
        changeClassName(KAMPAR, SGLONG)
    } else if (getUrlParameter('campus') === 'SL') {
        changeClassName(SGLONG, KAMPAR)
    }
}

function changeClassName(activeCampus, inactiveCampus) {
    activeCampus.className += ACTIVE
    inactiveCampus.className.replace(ACTIVE, '')
}

function displayLoading() {
    waiting.style.display = 'flex'
}

function displaySavedLoading() {
    saveLinkBtn.addEventListener('click', () => {
        displayLoading()
    })
}

function displayCampusLoading() {
    KAMPAR.addEventListener('click', () => {
        displayLoading()
    })
    SGLONG.addEventListener('click', () => {
        displayLoading()
    })
}

function restorePage() {
    window.addEventListener('pageshow', function (event) {
        const historyTraversal = event.persisted || (typeof window.performance !== 'undefined' && window.performance.type === 2)
        if (historyTraversal) {
            // Handle page restore.
            window.location.reload()
        }
    })
}