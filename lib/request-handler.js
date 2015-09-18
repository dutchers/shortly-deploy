var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
// var User = require('../app/models/user');
// var Link = require('../app/models/link');
// var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');

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
  var links = db.Url.find({}, function(err, links) {
    console.log("Links: ", links);
    res.send(200, links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;
  var userid = req.session.user._id;
  console.log("USER ID: " + userid);


  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  var link = db.Url.findOne({url: uri}, function (err, link) {
    if (err) {console.log(err)}
   if (link) {
      console.log("If we've found a link, here it is:", link);
      res.send(200, link);
    } else {
      util.getUrlTitle(uri, function (err, title) {
        if (err) {
          console.log('Error reading URL heading: ' + err);
          return res.send(404);
        }
        var newLink = new db.Url ({
          url: uri,
          title: title,
          base_url: req.headers.origin,
          user_id: userid
        });
        newLink.createCode();
        newLink.save(function(err) {
          if (err) { console.log(err) }

          res.send(200, newLink);
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  db.User.findOne({
    username: username
  }, function(err, user) {
    if (user) {
      user.authenticate(password, function(err, bool) {
        if (err) {
          console.log("Password incorrect" + err)
        }
        if (bool) {
          util.createSession(req, res, user);
        }
      });
    }
  });


};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var user = new db.User({
      username: username
    }) //Adding a "row" to the db with the username that was passed in from the login page.

  user.createHash(password, function(err, hash) { //instance method on the model
    if (err) {
      console.log(err)
    }
    user.password = hash; //adding the hash to the 'password' property on the model
    user.save(function(err) {
      if (err) {
        console.log('Creating user failed because: ' + err)
      }
      util.createSession(req, res, user);
    });
  });
};

exports.navToLink = function(req, res) {
  var link = db.Url.findOne({
    code: req.params[0]
  }, function(err, link) {
    if(!link) {
      res.redirect('/');
    } else {
      link.visits++;
      link.save(function(err){
        if(err) {
          console.log('Unable to save');
        }
        res.redirect(link.url);
      })
    }
  })

  // new Link({ //find link
  //   code: req.params[0] //with code that equals the value after the first '/'
  // }).fetch().then(function(link) { //grab it from the db then...
  //   if (!link) { //if link not found
  //     res.redirect('/'); //take them back to the home page
  //   } else { //if it was found
  //     link.set({ //update that model...
  //       visits: link.get('visits') + 1  //by adding one to the visits column
  //     })
  //       .save() //save that shit
  //       .then(function() { //then
  //         return res.redirect(link.get('url')); //take em to what they want
  //       });
  //   }
  // });
};