const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const config = require('./config.js')
const moment = require('moment')

const app = express()
const port = 8000

let db = null

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: {
    formatDate: (date, format) => {
      return moment(date).format(format)
    }
  }}))
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.use(bodyParser.json())

app.get('/', (req, res, next) => {
  res.status(200).sendFile(path.resolve('./public/html/index.html'))
})

app.get('/room', (req, res, next) => {
  const campus = req.query.campus
  const collection = db.collection(config.collection)
  collection.find({campus: campus}).toArray((err, places) => {
    if(err) {
      res.status(500).send({
        error: 'Error fetching campus from database'
      })
    } else {
      res.status(200).render('roomPage', {places})
    }
  })
})

MongoClient.connect(config.url, {useNewUrlParser: true, useUnifiedTopology: true},  (err, client) => {
  if(err) {
    console.error('Failed to connect database')
    throw err
  }
  db = client.db(config.dbname)
  app.listen(port, () => {
    console.log('===Server listening on port ', port)
  })
  const collection = db.collection(config.collection)
})
