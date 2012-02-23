/**
 * Psychotica
 */
var settings = require('./settings');
var express = require('express');
var app = module.exports = express.createServer();

var MongoStore = require('connect-mongodb');
var mongoose = require('mongoose'); 
mongoose.connect(settings.db_url);

require('express-resource');
var passport = require('passport')
  , BrowserIDStrategy = require('passport-browserid').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.email);
});

passport.deserializeUser(function(email, done) {
  done(null, { email: email });
});

passport.use(new BrowserIDStrategy({
    audience: 'http://0.0.0.0:3000'
  },
  function(email, done) {
    console.log(email);
    if (email == settings.email) {
      return done(null, {email: email});
    }
  }
));

// Config
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Middleware
app.configure(function(){
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: settings.secret, 
                            store: new MongoStore({db: mongoose.connections[0].db}) }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// Routes
app.get('/login', function(req, res){
  res.render('login', { title: settings.site_name, user: req.user });
});

app.post(
  '/auth/browserid', 
  passport.authenticate('browserid', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.resource(require('./routes/site'));
app.resource('activity', require('./routes/activity'));


// Start the server
if (!module.parent) {
  app.listen(settings.port);
  console.log("psychotica running at http://%s:%d", app.address().address, app.address().port);
}
