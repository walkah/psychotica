var settings = require('../settings');
var Activity = require('../models/activity');

exports.index = function(req, res) {
  var query = Activity.find();
  query.sort('created_on', -1);
  query.limit(20);
  query.exec(function(err, docs) {
    res.render('index', {
      title: settings.site_name,
      activities: docs,
      user: req.user
    });
  });
};
