// User functions
var settings = require('./settings');
var crypto = require('crypto');

function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

function auth(user, pass, fn) {
  passHash = md5(settings.pass + settings.secret);
  if (user != settings.user || passHash != md5(pass + settings.secret)) {
    fn(new Error('invalid username/password'));
  } else {
    fn(null, user);
  }
}

exports.login = function(req, res) { 
  if (req.session.user) {
    res.redirect('/');
  }
  res.render('login', {
    title: settings.site_name,
  });
};

exports.authenticate = function(req, res) {
  auth(req.body.username, req.body.password, function(err, user) {
    if (user) {
      req.session.regenerate(function() {
        console.log(user + ' logged in');
        req.session.user = user;
        res.redirect('/');
      });
    } else {
      console.log('Bad login');
      res.redirect('/login');
    }
  });
};

exports.logout = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/');
  });  
};