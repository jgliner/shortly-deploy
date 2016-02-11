var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var User = require('../app/models/user');
var Link = require('../app/models/link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  console.log('fetch links');
  Link.find({}, function(err, links) {
    res.send(200, links);
  });

  // Links.reset().fetch().then(function(links) {
  //   res.send(200, links.models);
  // });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.findOne({ url: uri }, function(err, found) {
    if (found) {
      res.send(200, found);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }
        var newLink = new Link({
          url: uri,
          title: title,
          baseUrl: req.headers.origin,
          visits: 0
        });
        newLink.save(function(err, link) {
          if (err) {return console.error(err);}
          console.log(link);
          res.send(200, link);
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  User.findOne({username: username}, function(err, user) {
    if (err) {return console.error(err);}
    if (user) {
      User.comparePassword(password, user.password, function(isMatch) {
        if (isMatch) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      });
    } else {
      res.redirect('/login');
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var user = new User({
    username: username,
    password: password,
  });
  User.count({username: username}, function(err, count) {
    console.log('User.count', count);
    if (!count) {
      user.save(function(err, user) {
        if (err) {return console.error(err);}
        
        util.createSession(req, res, user);
      });
    } else {
      res.redirect('/signup');
    }
  });
};

exports.navToLink = function(req, res) {
  Link.find({ code: req.params[0] }, function(err, found) {
    if (!found[0]) {
      res.redirect('/');
    } else {
      return res.redirect(found[0].url);
      // TODO: increment visits
    }
  });

  // new Link({ code: req.params[0] }).fetch().then(function(link) {
  //   if (!link) {
  //     res.redirect('/');
  //   } else {
  //     link.set({ visits: link.get('visits') + 1 })
  //       .save()
  //       .then(function() {
  //         return res.redirect(link.get('url'));
  //       });
  //   }
  // });
};


















