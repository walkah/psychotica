/**
 * Psychotica
 */

var express = require('express');
var app = module.exports = express.createServer();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/psychotica_test');

require('./models');

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res) {
  var Activity = mongoose.model('Activity');
  Activity.find({}, function(err, docs) {
    res.render('index', {
      title: 'psychoti.ca',
      activities: docs,
    });
  });
});

app.post('/post', function(req, res) {
  var Activity = mongoose.model('Activity');
  var a = new Activity();
  a.object = req.body.object;
  a.type = 'post';
  a.save(function() {
    res.redirect('/');
  });
});

// Start the server
if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port)
}
