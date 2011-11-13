/**
 * Psychotica
 */
var settings = require('./settings');
var sys = require('util');
var express = require('express');
var auth= require('connect-auth');
var app = express.createServer();
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
  app.use(express.static(__dirname + '/public'));
  app.use(auth( [
   auth.Twitter({consumerKey: settings.twitter_consumer_key, consumerSecret: settings.twitter_consumer_secret})
  ]) );
  app.use(app.router);
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

app.get('/auth/twitter', function(req, res) {
  req.authenticate(['twitter'], function(error, authenticated) { 
    var User = mongoose.model('User');
    if (req.session.auth.user) {
      User.findOne({'twitter.user_id': req.session.auth.user.user_id}, function(err, user) {
        if (err || !user) {
          user = new User();
          user.username = user.twitter.username = req.session.auth.user.username;
          user.twitter.user_id = req.session.auth.user.user_id;
          user.twitter.oauth_token = req.session.auth.twitter_oauth_token;
          user.twitter.oauth_token_secret = req.session.auth.twitter_oauth_token_secret;
          user.save();
        }

        req.session.regenerate(function() {
          req.session.user = user;
          res.redirect('/activity');
        });
      });
    }
  });  
});

// User stuff
app.get('/logout', user.logout);
app.get('/settings', user.logged_in, user.settings);
app.post('/settings', user.logged_in, user.save);

// Start the server
if (!module.parent) {
  app.listen(settings.port);
  console.log("psychotica listening on port %d", app.address().port);
}
