const username = 'eugeneyjy'
const password = 'Dnthackmepls78'
const host = 'room.88id4.mongodb.net'
const dbname = 'utar_accom'
const dbparam = 'retryWrites=true&w=majority'
const collection = 'room'

const url = `mongodb+srv://${username}:${password}@${host}/${dbname}?${dbparam}`

exports.url = url
exports.dbname = dbname
exports.collection = collection