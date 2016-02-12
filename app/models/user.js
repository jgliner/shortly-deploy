var db = require('../mongoConfig');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');


db.userSchema.pre('save', function(next) {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
  .then(function(hash) {
    this.password = hash;
    next();
  });
});

db.userSchema.statics.comparePassword = function(attemptedPassword, hashedPassword, cb) {
  bcrypt.compare(attemptedPassword, hashedPassword, function(err, isMatch) {
    if (err) {return console.error(err);}
    cb(isMatch);
  });
};

var User = mongoose.model('User', db.userSchema);
module.exports = User;
