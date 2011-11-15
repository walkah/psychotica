/**
 * Psychotica
 */
var settings = require('./settings');
var express = require('express');
var app = module.exports = express.createServer();

require('mongoose').connect(settings.db_url);

require('express-resource');

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
app.resource(require('./routes/site'));
app.resource('activity', require('./routes/activity'));

// Start the server
if (!module.parent) {
  app.listen(settings.port);
  console.log("psychotica listening on port %d", app.address().port);
}
