var db = require('../mongoConfig');
var crypto = require('crypto');
var mongoose = require('mongoose');

db.linkSchema.pre('save', function(next) {
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
  next();
});

var Link = mongoose.model('Link', db.linkSchema);
module.exports = Link;
