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
  const toNumbers = arr => arr.map(Number)
  const campus = req.query.campus
  const minPrice = req.query.min
  const maxPrice = req.query.max
  let capacity = []
  let set = {}
  if (req.query.cap) {
    if (typeof(req.query.cap) === 'string') {
      capacity = [parseInt(req.query.cap)]
    } else {
      capacity = toNumbers(req.query.cap)
    }
  }
  let query = {}
  if (campus) {
    query['campus'] = campus
  }
  if (minPrice || maxPrice || capacity.length != 0) {
    query['rooms'] = { $elemMatch: {} }
  }
  if (minPrice || maxPrice) {
    query['rooms'].$elemMatch.price = {}
    if (minPrice) {
      query['rooms'].$elemMatch.price.$gte = parseInt(minPrice)
    }
    if (maxPrice) {
      query['rooms'].$elemMatch.price.$lte = parseInt(maxPrice)
    }
  }
  if (capacity.length != 0) {
    query['rooms'].$elemMatch.capacity = {}
    query['rooms'].$elemMatch.capacity.$in = capacity
  }
  const collection = db.collection(config.collection)
  collection.find(query).toArray((err, places) => {
    if (err) {
      res.status(500).send({
        error: 'Error querying from database'
      })
    } else {
      collection.aggregate([
        {
          $match: {'campus': campus}
        },
        {
          $group:
          {
            '_id': null,
            'minPrice': {'$min': {'$min': '$rooms.price'} },
            'maxPrice': {'$max': {'$max' : '$rooms.price'} }
          }
        }
      ]).toArray((err, minmax) => {
        if (err) {
          res.status(500).send({
            error: 'Error fetching campus from database'
          })
        } else {
          set.minmin = minmax[0].minPrice
          set.maxmax = minmax[0].maxPrice
          collection.distinct('rooms.capacity', {campus: campus}, (err, cap) => {
            if (err) {
              res.status(500).send({
                error: 'Error getting room capacity from database'
              })
            } else {
              let checked = []
              for (let i = 0; i < cap.length; i++) {
                if (capacity.includes(cap[i])) {
                  checked.push(1)
                } else {
                  checked.push(0)
                }
              }
              set.cap = cap
              set.checkedCap = checked
              let otherCampus
              if (campus === 'SL') {
                otherCampus = 'KP'
              } else if (campus === 'KP') {
                otherCampus = 'SL'
              }
              collection.countDocuments({campus: otherCampus}, (err, count) => {
                if (campus === 'SL') {
                  set.slRoomCount = places.length
                  set.kpRoomCount = count
                } else if (campus === 'KP') {
                  set.slRoomCount = count
                  set.kpRoomCount = places.length
                }
                res.status(200).render('page/roomPage', {places, socialLinks, set})
              })
            }
          })
        }
      })
    }
  })
})

app.get('/saved', (req, res, next) => {
  let set = {}
  const collection = db.collection(config.collection)
  collection.countDocuments({campus: 'KP'}, (err, result) => {
    collection.countDocuments({campus: 'SL'}, (err, result2) => {
      set.kpRoomCount = result
      set.slRoomCount = result2
      console.log(set)
      res.status(200).render('page/saved', {socialLinks, set})
    })
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
})

function queryPlaces(query) {

}
