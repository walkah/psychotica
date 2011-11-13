/**
 * Psychotica
 */
var settings = require('./settings');
var express = require('express');
var app = module.exports = express.createServer();

require('mongoose').connect('mongodb://localhost/psychotica_test');

// Config
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Middleware
app.configure(function(){
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: settings.secret }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// Routes
require('./routes/site')(app);
require('./routes/activity')(app);
require('./routes/users')(app);

// Start the server
if (!module.parent) {
  app.listen(settings.port);
  console.log("psychotica listening on port %d", app.address().port);
}
