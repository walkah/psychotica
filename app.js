/**
 * Psychotica
 */
var settings = require('./settings');
var express = require('express');
var app = module.exports = express.createServer();
var resource = require('express-resource');
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
app.resource('activity', require('./lib/activity'));

// User stuff
app.get('/login', user.login);
app.post('/login', user.authenticate);
app.get('/logout', user.logout);
app.get('/settings', user.logged_in, user.settings);
app.post('/settings', user.logged_in, user.save);

// Start the server
if (!module.parent) {
  app.listen(settings.port);
  console.log("psychotica listening on port %d", app.address().port);
}
