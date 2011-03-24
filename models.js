var mongoose = require('mongoose');
var relativeDate = require('relative-date');

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

/**
 * Basic activity schema
 */
var ActivitySchema = new Schema({
  type       : String,
  object     : String,
  created_on : { type: Date, default: Date.now },
  updated_on : { type: Date, default: Date.now }
});

ActivitySchema.virtual('created_iso').get(function() {
  return this.created_on.toISOString();
});

ActivitySchema.virtual('created_ago').get(function() {
  return relativeDate(this.created_on);
});

mongoose.model('Activity', ActivitySchema);

/**
 * Profile schema
 */
var ProfileSchema = new Schema({
  nickname  : { type: String, required: true , validate: /[A-Za-z]/ },
  fullname  : String,
  picture   : String,
  bio       : String,
  location  : String,
  created_on : { type: Date, default: Date.now },
  updated_on : { type: Date, default: Date.now }  
});

mongoose.model('Profile', ProfileSchema);