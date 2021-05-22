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

app.get('/room', async (req, res, next) => {
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
  if (minPrice || maxPrice) {
    query['rooms.price'] = {}
    if (minPrice) {
      query['rooms.price'].$gte = parseInt(minPrice)
    }
    if (maxPrice) {
      query['rooms.price'].$lte = parseInt(maxPrice)
    }
  }
  if (capacity.length != 0) {
    query['rooms.capacity'] = {}
    query['rooms.capacity'].$in = capacity
  }
  const collection = db.collection(config.collection)
  set.slRoomCount = await collection.countDocuments({
    campus: 'SL'
  })
  set.kpRoomCount = await collection.countDocuments({
    campus: 'KP'
  })
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
    }
  })
  let cap = collection.distinct('rooms.capacity', {campus: campus})
  cap.then((result) => {
    let checked = []
    for (let i = 0; i < result.length; i++) {
      if (capacity.includes(result[i])) {
        checked.push(1)
      } else {
        checked.push(0)
      }
    }
    set.cap = result
    set.checkedCap = checked
  })
  collection.find(query).toArray((err, places) => {
    if (err) {
      res.status(500).send({
        error: 'Error fetching campus from database'
      })
    } else {
      res.status(200).render('page/roomPage', {places, socialLinks, set})
    }
  })
})

app.get('/saved', async (req, res, next) => {
  let set = {}
  const collection = db.collection(config.collection)
  set.slRoomCount = await collection.countDocuments({
    campus: 'SL'
  })
  set.kpRoomCount = await collection.countDocuments({
    campus: 'KP'
  })
  res.status(200).render('page/saved', {socialLinks, set})
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