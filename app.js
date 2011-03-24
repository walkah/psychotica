/**
 * Psychotica
 */
var settings = require('./settings');
var express = require('express');
var app = module.exports = express.createServer();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/psychotica_test');
require('./models');

var user = require('./user');

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: settings.secret }));
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

app.dynamicHelpers({
  // currently logged in user (if any)
  user: function(req, res) {
    return req.session.user;
  },
});

// Routes
app.get('/', function(req, res) {
  var Activity = mongoose.model('Activity');
  var query = Activity.find();
  query.sort('created_on', -1);
  query.limit(20);
  query.exec(function(err, docs) {
    res.render('index', {
      title: settings.site_name,
      activities: docs,
    });
  });
});

app.post('/post', function(req, res) {
  var Activity = mongoose.model('Activity');
  var a = new Activity();
  a.object = req.body.object;
  a.type = req.body.type;
  a.save(function() {
    res.redirect('/');
  });
});

app.get('/activity/:id', function(req, res, next) {
  var Activity = mongoose.model('Activity');
  Activity.findOne({_id: req.param('id')}, function(err, doc) {
    if (err || !doc) {
      return next(new Error('Activity not found'));
    }
    res.render('activity', {
      title: settings.site_name,
      activity: doc,
    });
  });
});

// User stuff
app.get('/login', user.login);
app.post('/login', user.authenticate);
app.get('/logout', user.logout);
app.get('/settings', user.logged_in, user.settings);
//app.post('/settings', user.save);

// Start the server
if (!module.parent) {
  app.listen(settings.port);
  console.log("psychotica listening on port %d", app.address().port)
}
