var mongoose = require('mongoose');
var settings = require('../settings');
var twitter = require('twitter');

/**
 * list activity
 */
exports.index = function(req, res){
  var Activity = mongoose.model('Activity');
  var query = Activity.find();
  query.sort('created_on', -1);
  query.limit(20);
  query.exec(function(err, docs) {
    res.render('index', {
      title: settings.site_name,
      activities: docs
    });
  });
};

/**
 * POST new activity
 */
exports.create = function(req, res){
  var Activity = mongoose.model('Activity');
  var a = new Activity();
  a.object = req.body.object;
  a.type = req.body.type;
  a.save(function() {
    var twit = new twitter({
      'consumer_key': settings.twitter_consumer_key,
      'consumer_secret': settings.twitter_consumer_secret,
      'access_token_key' : settings.twitter_oauth_token,
      'access_token_secret' : settings.twitter_oauth_token_secret
    });

    twit.updateStatus(req.body.object, function() {
      console.log('posted to twitter!');
    });
    res.redirect('/activity');
  });
};

/**
 * Show individual activity.
 */
exports.show = function(req, res){
  var Activity = mongoose.model('Activity');
  Activity.findOne({_id: req.params.activity}, function(err, doc) {
    if (err || !doc) {
      return req.next(new Error('Activity not found'));
    }
    res.render('activity', {
      title: settings.site_name,
      activity: doc
    });
  });
};

