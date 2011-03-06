var mongoose = require('mongoose');

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var Activity = new Schema({
  type   : String,
  object : String,
});

mongoose.model('Activity', Activity);