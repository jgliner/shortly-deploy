var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: String,
  password: String,
  timestamp: {type: Date, default: Date.now}
});


exports.userSchema = userSchema;