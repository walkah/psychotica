var settings = require('../settings');
var Activity = require('../models/activity');


exports.index = function(req, res) {
  var query = Activity.find();
  query.sort('published', -1);
  query.limit(20);
  query.exec(function(err, docs) {
    res.render('index', {
      title: settings.site_name,
      activities: docs
    });
  });
};

exports.show = function(req, res) {
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

exports.create = function(req, res) {
  var a = new Activity();
  a.content = req.body.content;
  a.verb = req.body.verb;
  a.save(function() {
    res.redirect('/activity');
  });
};
