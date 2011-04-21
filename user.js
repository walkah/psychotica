// User functions
var settings = require('./settings');
var crypto = require('crypto');
var mongoose = require('mongoose');

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

exports.logged_in = function(req, res, next) { 
  if (req.session.user) {
    next();
  } else {
    next(new Error('Unauthorized'));
  }
};

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
        req.session.user = user;
        res.redirect('/');
      });
    } else {
      res.redirect('/login');
    }
  });
};

exports.logout = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/');
  });  
};

exports.settings = function(req, res) {
  var Profile = mongoose.model('Profile');
  Profile.findOne({'nickname' : settings.user }, function(err, profile) {
    if (!profile) {
      profile = new Profile({'nickname': settings.user});
    }
    console.log(profile);
    res.render('settings', {
      profile: profile,
      title: settings.site_name,
    });
  });
}

exports.save = function(req, res) {
  var Profile = mongoose.model('Profile');
  Profile.findOne({'nickname': settings.user}, function(err, profile) {
    if (!profile) {
      profile = new Profile({'nickname': settings.user});
    }
    profile.fullname = req.body.fullname;
    profile.bio = req.body.bio;
    profile.location = req.body.location;
    profile.updated_on = Date.now();
    profile.save(function() {
      res.redirect('/settings');
    });
  });
}