const express = require('express');
const exphbs = require('express-handlebars');
const MongoClient = require('mongodb').MongoClient;
const config = require('./config.js');

const app = express();
const port = process.env.PORT || 8000;

let db = null;

const hbs = exphbs.create({
  defaultView: 'main',
});

const socialLinks = [
  { link: 'https://www.tiktok.com/@utarnet?lang=en', class: 'fab fa-tiktok' },
  { link: 'https://twitter.com/utarnet?lang=en', class: 'fab fa-twitter' },
  { link: 'https://www.linkedin.com/school/universiti-tunku-abdul-rahman/?originalSubdomain=my/', class: 'fab fa-linkedin-in' },
  { link: 'https://www.facebook.com/UTARnet/', class: 'fab fa-facebook-f' },
  { link: 'https://www.instagram.com/utarnet1/?hl=en/', class: 'fab fa-instagram' },
  { link: 'https://github.com/GervinFung/Room', class: 'fab fa-github' }
];

app.engine('handlebars', hbs.engine);

app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res, next) => {
  const css = ['index'];
  res.status(200).render('page/index', {css, socialLinks});
});

app.get('/room', (req, res, next) => {
  const campus = req.query.campus;
  const minPrice = req.query.min;
  const maxPrice = req.query.max;
  const capacity = getCapacityQ(req.query.cap);
  const address = getSearchQ(req.query.address);
  const remarks = getSearchQ(req.query.remarks);
  const facilities = getSearchQ(req.query.facilities);
  let otherCampus = '';
  if (campus === 'SL') {
    otherCampus = 'KP';
  } else if (campus === 'KP') {
    otherCampus = 'SL';
  }
  let set = {};
  set.address = req.query.address;
  set.remarks = req.query.remarks;
  set.facilities = req.query.facilities;
  const collection = db.collection(config.collection);
  collection.find(generateQueryStatement(campus, minPrice, maxPrice, capacity, address, remarks, facilities)).toArray((err, places) => {
    if (err) {
      res.status(500).send({
        error: 'Error querying from database'
      });
    } else {
      collection.aggregate(minmaxPipeline(campus)).toArray((err, minmax) => {
        if (err) {
          res.status(500).send({
            error: 'Error fetching campus from database'
          });
        } else {
          set.minmin = minmax[0].minPrice;
          set.maxmax = minmax[0].maxPrice;
          collection.distinct('rooms.capacity', {campus: campus}, (err, cap) => {
            if (err) {
              res.status(500).send({
                error: 'Error getting room capacity from database'
              });
            } else {
              let checked = [];
              for (let i = 0; i < cap.length; i++) {
                if (capacity.includes(cap[i])) {
                  checked.push(1);
                } else {
                  checked.push(0);
                }
              }
              set.cap = cap;
              set.checkedCap = checked;
              collection.countDocuments({campus: otherCampus}, (err, count) => {
                if (err) {
                  res.status(500).send({
                    error: 'Error counting room from database'
                  });
                } else {
                  if (campus === 'SL') {
                    set.slRoomCount = places.length;
                    set.kpRoomCount = count;
                  } else if (campus === 'KP') {
                    set.slRoomCount = count;
                    set.kpRoomCount = places.length;
                  }
                  const css = ['room', 'waiting', 'fullscreenFilter'];
                  const js = ['room', 'roomCapacity', 'priceRange', 'roomTemplate', 'filter', 'roomOnly'];
                  res.status(200).render('page/roomPage', {css, js, places, socialLinks, set});
                }
              })
            }
          })
        }
      })
    }
  })
})

app.get('/saved', (req, res, next) => {
  let set = {};
  const collection = db.collection(config.collection);
  collection.countDocuments({campus: 'KP'}, (err, result) => {
    collection.countDocuments({campus: 'SL'}, (err, result2) => {
      set.kpRoomCount = result;
      set.slRoomCount = result2;
      const css = ['room', 'waiting'];
      const js = ['room', 'roomTemplate', 'filter', 'savedOnly'];
      res.status(200).render('page/saved', {css, js, socialLinks, set});
    })
  })
})


MongoClient.connect(config.url, {useNewUrlParser: true, useUnifiedTopology: true},  (err, client) => {
  if(err) {
    console.error('Failed to connect database');
    throw err;
  }
  db = client.db(config.dbname);
  app.listen(port, () => {
    console.log('===Server listening on port ', port);
  })
})

function getCapacityQ(cap) {
  const toNumbers = arr => arr.map(Number);
  let capacity = [];
  if (cap) {
    if (typeof(cap) === 'string') {
      capacity = [parseInt(cap)];
    } else {
      capacity = toNumbers(cap);
    }
  }
  return capacity;
}

function toRegex(arr) {
  let regexArr = [];
  arr.forEach((item) => {
    if (item) {
      regexArr.push(new RegExp(item, 'i'));
    }
  })
  return regexArr;
}

function getSearchQ(field) {
  if (field) {
    field = field.trim();
    return toRegex(field.split(' '));
  } else {
    return undefined;
  }
}

function generateQueryStatement(campus, minPrice, maxPrice, capacity, address, remarks, facilities) {
  let query = {};

  if (campus) {
    query['campus'] = campus;
  }
  if (minPrice || maxPrice || capacity.length != 0) {
    query['rooms'] = { $elemMatch: {} }
  }
  if (minPrice || maxPrice) {
    query['rooms'].$elemMatch.price = {}
    if (minPrice) {
      query['rooms'].$elemMatch.price.$gte = parseInt(minPrice);
    }
    if (maxPrice) {
      query['rooms'].$elemMatch.price.$lte = parseInt(maxPrice);
    }
  }
  if (capacity.length != 0) {
    query['rooms'].$elemMatch.capacity = {}
    query['rooms'].$elemMatch.capacity.$in = capacity;
  }
  if (address) {
    query['address'] = { $in: address }
  }
  if (remarks) {
    query['remarks'] = { $in: remarks }
  }
  if (facilities) {
    query['facilities'] = { $in: facilities }
  }
  return query;
}

function minmaxPipeline(campus) {
  const pipeline =
  [{
    $match: {'campus': campus}
  },
  {
    $group:
    {
      '_id': null,
      'minPrice': {'$min': {'$min': '$rooms.price'} },
      'maxPrice': {'$max': {'$max' : '$rooms.price'} }
    }
  }]
  return pipeline;
}
