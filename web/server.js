var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var config = require('./config.js');

var app = express();
var port = 8000;

var db = null;

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.use(bodyParser.json());

app.get('/', function(req, res, next){
  res.status(200).sendFile(path.resolve('./public/html/index.html'));
});

app.get('/room', function(req, res, next){
  var campus = req.query.campus;
  var collection = db.collection(config.collection);
  collection.find({campus: campus}).toArray(function(err, places) {
    if(err) {
      res.status(500).send({
        error: "Error fetching campus from database"
      });
    } else {
      res.status(200).render('roomPage', {places});
    }
  })
});

MongoClient.connect(config.url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
  if(err) {
    console.error("Failed to connect database");
    throw err;
  }
  db = client.db(config.dbname);
  app.listen(port, function() {
    console.log("===Server listening on port ", port);
  });
  var collection = db.collection(config.collection);
});
