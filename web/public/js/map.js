const map = findByID('map');

addMapListener();

function addMapListener() {
    map.addEventListener('click', () => {
        console.log('map clicked');
    })
}