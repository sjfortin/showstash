var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');


//when clicking the google button, the user is taken to the following url to login
router.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account'
  }
  ));

// router.get('/auth/google/callback',
//   passport.authenticate('google', {
//     successRedirect: '#/home',
//     failureRedirect: '#/login'
//   }
//   ));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '#/login' }),
  function (req, res) {
    // absolute path
    res.redirect('http://localhost:5000/#/home');
  });


// Handles login form POST from index.html
router.post('/',
  passport.authenticate('local', { // local strategy - userStrategy.js
    // request stays within node/express and is routed as a new request
    successRedirect: '/user'   // goes to routes/user.js
  })
);

// Handle index file separately
// Also catches any other request not explicitly matched elsewhere
router.get('/', function (req, res) {
  console.log('request for index');
  res.sendFile(path.join(__dirname, '../public/views/index.html'));
});

router.get('/*', function (req, res) {
  console.log('404 : ', req.params);
  res.sendStatus(404);
});

module.exports = router;
