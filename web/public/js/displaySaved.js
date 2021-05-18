const SAVED_INNER_HTML = 'SAVED_INNER_HTML'
const content = findByID('infos-content')
display()

function display() {
    displayLoading(150)
    if (location.href.slice(-5) === 'saved') {
        console.log('it is saved only')
        if (content.innerHTML === null || content.innerHTML.length === 0) {
            console.log('empty')
            content.innerHTML = getInnerHtml()
        }
    } else {
        console.log('it is query only')
        console.log(content.innerHTML)
    }
}

function getInnerHtml() {
    let innerHTML = ''
    const list = sessionStorage.getItem(SAVED_INNER_HTML)
    for (let index = 0; index < list.length; index++) {
        innerHTML += list[index]
    }
    return Object.freeze(innerHTML)
}