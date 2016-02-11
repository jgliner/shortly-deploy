var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: String,
  password: String,
  timestamp: {type: Date, default: Date.now}
});

var linkSchema = new Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: Number,
  timestamp: {type: Date, default: Date.now}
});


exports.userSchema = userSchema;
exports.linkSchema = linkSchema;
