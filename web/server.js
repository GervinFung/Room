const express = require('express')
const exphbs = require('express-handlebars')
const MongoClient = require('mongodb').MongoClient
const config = require('./config.js')

const app = express()
const port = 8000

let db = null

const hbs = exphbs.create({defaultView: 'main'})

const socialLinks = [
  { link: 'https://www.tiktok.com/@utarnet?lang=en', class: 'fab fa-tiktok' },
  { link: 'https://twitter.com/utarnet?lang=en', class: 'fab fa-twitter' },
  { link: 'https://www.linkedin.com/school/universiti-tunku-abdul-rahman/?originalSubdomain=my/', class: 'fab fa-linkedin-in' },
  { link: 'https://www.facebook.com/UTARnet/', class: 'fab fa-facebook-f' },
  { link: 'https://www.instagram.com/utarnet1/?hl=en/', class: 'fab fa-instagram' },
  { link: 'https://github.com/GervinFung/Room/tree/nodejs', class: 'fab fa-github' }
]

app.engine('handlebars', hbs.engine)

app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res, next) => {
  res.status(200).render('page/index', {socialLinks})
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
      res.status(200).render('page/roomPage', {places, socialLinks})
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