/**
 * Psychoti.ca
 */
require.paths.unshift('./node_modules');

var express = require('express');
var app = module.exports = express.createServer();
var mongoose = require('mongoose').Mongoose,
db = mongoose.connect('mongodb://localhost/psychotica');

var Activity = require('./models.js').Activity(db)

// Configuration
app.configure(function(){
    app.set('views', __dirname + '/views');
    app.use(express.bodyDecoder());
    app.use(express.methodOverride());
    app.use(express.compiler({ src: __dirname + '/public', enable: ['sass'] }));
    app.use(app.router);
    app.use(express.staticProvider(__dirname + '/public'));

    app.set('view engine', 'haml');
    app.register('.haml', require('hamljs'));    
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
app.get('/', function(req, res, next) {
    Activity.find().sort([['created_at', 'descending']]).all(function(entries) {
        res.render('index', {
            locals: { posts: entries }
        });
    });  
});

app.get('/activity/post', function(req, res) {
    res.render('post', {locals: {title: 'New Post'}});
});

app.post('/activity/post', function(req, res) {
    var a = new Activity();
    a.body = req.body.body;

    a.save(function () {
        res.redirect('/');
    });
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port)
}
