var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').OAuth2Strategy;
var encryptLib = require('../modules/encryption');
var pool = require('../modules/pool.js');

// Google oAuth2
passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID || require('../config.js').GOOGLE_CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET || require('../config.js').GOOGLE_CLIENT_SECRET ,
  callbackURL: process.env.CALLBACK_URL || require('../config.js').GOOGLE_CALLBACK_URL,
  passReqToCallback: true
}, function (req, accessToken, refreshToken, profile, done) {
  console.log("THIS IS THE PROFILE", profile);
  pool.connect(function (err, client, release) {
    if (err) {
      console.log('connection err ', err);
      release();
      done(err);
    }
    var user = {};
    //adding user to database if not already there
    client.query("INSERT INTO users (username, image, name) VALUES ($1, $2, $3) ON CONFLICT (username) DO UPDATE SET username = $1, image = $2, name = $3;",
      [profile.emails[0].value, profile.photos[0].value, profile.displayName],
      function (err, result) {
        // Handle Errors
        if (err) {
          console.log('query err ', err);
          done(err);
          release();
        }
        //selecting the user from database and setting them as this session's user
        client.query("SELECT * FROM users WHERE username = $1",
          [profile.emails[0].value],
          function (err, result) {
            if (err) {
              console.log('query err ', err);
              done(err);
              release();
            }
            user = result.rows[0];
            release();
            if (!user) {
              // user not found
              return done(null, false, { message: 'Incorrect credentials.' });
            } else {
              // user found
              console.log('User row ', user);
              done(null, user);
            }
          });

      });
  });
} //end of function
)); //end of new GoogleStrategy

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  console.log('called deserializeUser - pg');

  pool.connect(function (err, client, release) {
    if (err) {
      console.log('connection err ', err);
      release();
      done(err);
    }

    var user = {};

    client.query("SELECT * FROM users WHERE id = $1", [id], function (err, result) {

      // Handle Errors
      if (err) {
        console.log('query err ', err);
        done(err);
        release();
      }

      user = result.rows[0];
      release();

      if (!user) {
        // user not found
        return done(null, false, { message: 'Incorrect credentials.' });
      } else {
        // user found
        console.log('User row ', user);
        done(null, user);
      }

    });
  });
});

// Does actual work of logging in
passport.use('local', new localStrategy({
  passReqToCallback: true,
  usernameField: 'username'
}, function (req, username, password, done) {
  pool.connect(function (err, client, release) {
    console.log('called local - pg');

    // assumes the username will be unique, thus returning 1 or 0 results
    client.query("SELECT * FROM users WHERE username = $1", [username],
      function (err, result) {
        var user = {};

        console.log('here');

        // Handle Errors
        if (err) {
          console.log('connection err ', err);
          done(null, user);
        }

        release();

        if (result.rows[0] != undefined) {
          user = result.rows[0];
          console.log('User obj', user);
          // Hash and compare
          if (encryptLib.comparePassword(password, user.password)) {
            // all good!
            console.log('passwords match');
            done(null, user);
          } else {
            console.log('password does not match');
            done(null, false, { message: 'Incorrect credentials.' });
          }
        } else {
          console.log('no user');
          done(null, false);
        }

      });
  });
}
));

module.exports = passport;