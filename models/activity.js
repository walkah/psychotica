var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

// Object Schema
var ObjectSchema = new Schema({
  attachments  : String,
  author       : ObjectId,
  content      : String,
  displayName  : String,
  image        : String,
  objectType   : String,
  published    : { type: Date, default: Date.now },
  summary      : String,
  url          : String,
  updated      : { type: Date, default: Date.now }
});

// Activity Schema
var ActivitySchema = new Schema({
  actor      : ObjectId,
  content    : String,
  generator  : String,
  icon       : String,
  object     : [ObjectSchema],
  provider   : String,
  published  : { type: Date, default: Date.now },
  target     : String,
  title      : String,
  url        : String,
  updated    : { type: Date, default: Date.now },
  verb       : String
});

ActivitySchema.virtual('published_iso').get(function() {
  return this.published.toISOString();
});

ActivitySchema.virtual('published_ago').get(function() {
  return moment(this.published).fromNow();
});

module.exports = mongoose.model('Activity', ActivitySchema);
