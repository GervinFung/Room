const KAMPAR = document.getElementById('kampar')
const SGLONG = document.getElementById('sg-long')
const ACTIVE = ' active-campus'

findActiveCampus()

function findActiveCampus() {
    location.href.includes('room?campus=KP') ? changeClassName(KAMPAR, SGLONG) : changeClassName(SGLONG, KAMPAR)
}

function changeClassName(activeCampus, inactiveCampus) {
    activeCampus.className += ACTIVE
    inactiveCampus.className.replace(ACTIVE, '')
}