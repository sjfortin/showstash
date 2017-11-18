var express = require('express');
var router = express.Router();
var pool = require('../modules/pool');

// Handles Ajax request for user information if user is authenticated
router.get('/', function(req, res) {
  console.log('get /user route');
  // check if logged in
  if (req.isAuthenticated()) {
    // send back user object from database
    console.log('logged in', req.user);
    var userInfo = {
      username: req.user.username,
      image: req.user.image,
      name: req.user.name
    };
    res.send(userInfo);
  } else {
    // failure best handled on the server. do redirect here.
    console.log('not logged in');
    // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
    res.send(false);
  }
});

// clear all server session information about this user
router.get('/logout', function(req, res) {
  // Use passport's built-in method to log out the user
  console.log('Logged out');
  req.logOut();
  res.sendStatus(200);
});

// Update the last login of a user
router.put('/timestamp', function(req, res) {
  console.log('updating the user timestamp');
  console.log('timestamp req.body', req.body);

  var todayDate = new Date();

  if (req.isAuthenticated()) {
    pool.connect(function(errDatabase, client, done) {
      if (errDatabase) {
        console.log('Error connecting to database', errDatabase);
        res.sendStatus(500);
      } else {
        client.query(
          'UPDATE users SET last_login=$1 WHERE username=$2;',
          [todayDate, req.body.username],
          function(errQuery, data) {
            done();
            if (errQuery) {
              console.log('Error making database query', errQuery);
              res.sendStatus(500);
            } else {
              res.sendStatus(201);
            }
          }
        );
      }
    });
  }
});

module.exports = router;
