const infoContent = findByID('infos-content')

function insertNewInfo(info, infoContent) {
  const infoHTML = Handlebars.templates.room(info)
  infoContent.insertAdjacentHTML('beforeend', infoHTML)
}

function parseInfoElem(infoElem, idElem) {
  let info = {}

  info.ID = idElem.querySelector('p').textContent.trim()

  const infoAddressElem = infoElem.querySelector('.address-info p')
  info.address = infoAddressElem.textContent.trim()

  const infoRemarksInfoElem = infoElem.querySelector('.remarks-info')
  const remarksDivs = infoRemarksInfoElem.getElementsByTagName('p')

  const infoAvailableFromElem = remarksDivs[0]
  let available_from = {}
  const date = infoAvailableFromElem.textContent.trim().split(' ')
  available_from.month = date[2]
  available_from.year = parseInt(date[3])
  info.available_from = available_from

  const infoRemarksElem = remarksDivs[1]
  info.remarks = infoRemarksElem.textContent.trim()

  info.facilities = infoElem.querySelector('.facilities-info p').textContent.trim()

  const infoContactElem = infoElem.querySelector('.contact-info')
  const contactDivs = infoContactElem.getElementsByTagName('p')
  info.name = contactDivs[0].textContent.trim()
  info.hp_no = contactDivs[1].textContent.trim()
  info.email = contactDivs[2].textContent.trim()

  let rooms = []
  const infoAccomodationElems = infoElem.querySelector('.accomodation-infos').children
  for (let i = 0; i < infoAccomodationElems.length; i++) {
    let room = {}
    room.type = infoAccomodationElems[i].querySelector('p').textContent.trim()
    const capacityElem = infoAccomodationElems[i].querySelector('.tenants')
    room.capacity = parseInt(capacityElem.textContent.trim().split(' ')[0])
    const priceElem = infoAccomodationElems[i].querySelector('.price-label')
    room.price = parseInt(priceElem.textContent.trim().split(' ')[0].slice(1))
    rooms.push(room)
  }
  info.rooms = rooms
  return Object.freeze(info)
}

function roomsMatchQuery(rooms, query) {
  for (let i = 0; i < rooms.length; i++) {
    if (rooms[i].price >= query.min_price && rooms[i].price <= query.max_price) {
      if (query.capacity.length === 0) {
        return true
      }
      for (let j = 0; j < query.capacity.length; j++) {
        if (rooms[i].capacity === query.capacity[j]) {
          return true
        }
      }
    }
  }
  return false
}

function infoMatchesQuery(info, query) {
  return roomsMatchQuery(info.rooms, query)
}

function doSearchUpdate() {
  query = {
    min_price: lowerRangeScroll.value,
    max_price: upperRangeScroll.value,
    capacity: getSelectedCapacity()
  }
  const infoContainer = document.querySelector('.content')
  if (infoContainer) {
    while (infoContainer.lastChild) {
      infoContainer.removeChild(infoContainer.lastChild)
    }
  }

  allInfos.forEach((info) => {
    if (infoMatchesQuery(info, query)) {
      // console.log("inserting")
      insertNewInfo(info, infoContent)
    }
  })
  console.log(infoContent.innerHTML)
}

const infosElemsCollection = document.getElementsByClassName('infos')
const idElemsCollection = document.getElementsByClassName('id')

function getAllInfo() {
  let info = []
  for (let i = 0; i < infosElemsCollection.length; i++) {
    info.push(parseInfoElem(infosElemsCollection[i], idElemsCollection[i]))
  }
  return Object.freeze(info)
}

const allInfos = getAllInfo()
const allInfosLength = allInfos.length