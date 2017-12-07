// server.js
// where your node app starts

// init project
var express = require('express');
var MongoClient = require('mongodb').MongoClient
var urlService = require('./db/url');

var app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html

MongoClient.connect(process.env.MONGO_URL, function(err, db) {
  
    app.get("/", function (request, response) {
      response.sendFile(__dirname + '/views/index.html');
    });
    
    app.get('/new/:protocol//:url', function(req, res) {
      var url = req.params.url, protocol = req.params.protocol
      try {
        if ((protocol != 'http:' && protocol != 'https:') || url.indexOf('www.') == -1) {
          throw "Wrong url format, make sure you have a valid protocol and real site."
        }

        var originalUrl = protocol + '//' + url

      
        urlService.create(db, originalUrl, function(doc) {
          res.json(doc)
        })
      } catch (err) { 
        res.json({
          message: err.message ? err.message : err
        })    
      }

  })

  app.get('/:url', function(req, res) {
      var url = req.params.url
      try {
        urlService.getOriginalUrl(db, url, function(originalUrl) {
          if (!originalUrl) {
            return res.json({
              message: "Url not found"
            }) 
          }
          res.redirect(originalUrl)
        })
      } catch (err) { 
        res.json({
          message: err.message ? err.message : err
        })    
      }
  })

  // listen for requests :)
  var listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
  });
  
});




