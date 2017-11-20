var express = require('express');
var router = express.Router();
var pool = require('../modules/pool');

// Using requst module to make HTTP requests from the server
// https://www.npmjs.com/package/request
var request = require('request');

var setListApiKey =
  process.env.SETLIST_API_KEY || require('../config.js').musicApi.setlistApiKey;

// GET My Shows from users_shows table
router.get('/myShows', function(req, res) {
  if (req.isAuthenticated()) {
    pool.connect(function(errDatabase, client, done) {
      if (errDatabase) {
        console.log('Error connecting to database', err);
        res.sendStatus(500);
      } else {
        client.query(
          'SELECT * FROM users_shows WHERE user_id=$1;',
          [req.user.id],
          function(errQuery, data) {
            done();
            if (errQuery) {
              console.log('Error making database query', errQuery);
              res.sendStatus(500);
            } else {
              res.send(data.rows);
            }
          }
        );
      }
    });
  } else {
    // failure best handled on the server. do redirect here.
    console.log('not logged in');
    // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
    res.send(false);
  }
});

// GET a user's artist images from the database
router.get('/artistImages', function(req, res) {
  if (req.isAuthenticated()) {
    pool.connect(function(errDatabase, client, done) {
      if (errDatabase) {
        console.log('Error connecting to database', err);
        res.sendStatus(500);
      } else {
        client.query(
          'SELECT * FROM users_shows WHERE user_id=$1;',
          [req.user.id],
          function(errQuery, data) {
            done();
            if (errQuery) {
              console.log('Error making database query', errQuery);
              res.sendStatus(500);
            } else {
              res.send(data.rows);
            }
          }
        );
      }
    });
  } else {
    // failure best handled on the server. do redirect here.
    console.log('not logged in');
    // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
    res.send(false);
  }
});

// POST manual shows to users_shows table
router.post('/addShowManually', function(req, res) {
  var userID = req.user.id;
  if (req.isAuthenticated()) {
    pool.connect(function(errDatabase, client, done) {
      if (errDatabase) {
        console.log('Error connecting to database', errDatabase);
        res.sendStatus(500);
      } else {
        client.query(
          'INSERT INTO users_shows (artist, show_date, full_year, venue, city, state, image, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) returning id;',
          [
            req.body.newShow.artist,
            req.body.newShow.show_date,
            req.body.full_year,
            req.body.newShow.venue,
            req.body.newShow.city,
            req.body.newShow.state,
            req.body.newShow.newImage,
            userID
          ],
          function(errQuery, data) {
            done();
            if (errQuery) {
              console.log('Error making database query', errQuery);
              res.sendStatus(500);
            } else {
              res.send(data.rows);
            }
          }
        );
      }
    });
  }
});

// GET Search Results from server
router.get('/searchResults', function(req, res) {
  if (req.isAuthenticated()) {
    // https://api.setlist.fm/rest/1.0/search/setlists?artistName=' + req.query.artist + '&cityName=' + req.query.city + '&p=' + req.query.currentPageNumber

    let baseUrl = 'https://api.setlist.fm/rest/1.0/search/setlists?';
    if (req.query.artist) {
      baseUrl += 'artistName=' + req.query.artist;
    }
    if (req.query.city) {
      baseUrl += '&cityName=' + req.query.city;
    }
    if (req.query.venue) {
      baseUrl += '&venueName=' + req.query.venue;
    }
    baseUrl += '&p=' + req.query.currentPageNumber;

    console.log('baseUrl', baseUrl);

    request(
      {
        url: baseUrl,
        headers: {
          Accept: 'application/json',
          'x-api-key': setListApiKey,
          'User-Agent': 'request'
        }
      },
      function(error, response, body) {
        if (response && response.statusCode == 200) {
          res.send(body);
        } else {
          console.log('error', error);
          res.sendStatus(204);
        }
      }
    );
  }
});

// POST from Search Results add button
router.post('/addSearchedShow', function(req, res) {
  var userID = req.user.id;

  if (req.isAuthenticated()) {
    pool.connect(function(errDatabase, client, done) {
      if (errDatabase) {
        console.log('Error connecting to database', errDatabase);
        res.sendStatus(500);
      } else {
        client.query(
          'INSERT INTO users_shows (artist, mbid, show_date, full_year, venue, city, state, version_id, user_id, setlist, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning *;',
          [
            req.body.artist,
            req.body.mbid,
            req.body.show_date,
            req.body.full_year,
            req.body.venue,
            req.body.city,
            req.body.state,
            req.body.version_id,
            userID,
            req.body.setlist,
            req.body.image
          ],
          function(errQuery, data) {
            done();
            if (errQuery) {
              console.log('Error making database query', errQuery);
              res.sendStatus(500);
            } else {
              res.send(data.rows);
            }
          }
        );
      }
    });
  }
});

// GET individual show details
router.get('/showDetails', function(req, res) {
  // check if logged in
  if (req.isAuthenticated()) {
    pool.connect(function(errDatabase, client, done) {
      if (errDatabase) {
        console.log('Error connecting to database', err);
        res.sendStatus(500);
      } else {
        client.query(
          'SELECT * FROM users_shows WHERE id=$1;',
          [req.query.id],
          function(errQuery, data) {
            done();
            if (errQuery) {
              console.log('Error making database query', errQuery);
              res.sendStatus(500);
            } else {
              console.log(data.rows);
              res.send(data.rows);
            }
          }
        );
      }
    });
  } else {
    // failure best handled on the server. do redirect here.
    console.log('not logged in');
    // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
    res.send(false);
  }
});

// Delete show route
router.delete('/deleteShow', function(req, res) {
  if (req.isAuthenticated()) {
    var showID = req.query.id;
    pool.connect(function(errorConnectingToDatabase, client, done) {
      if (errorConnectingToDatabase) {
        console.log('Error connecting to database', errorConnectingToDatabase);
        res.sendStatus(500);
      } else {
        client.query('DELETE FROM users_shows WHERE id=$1', [showID], function(
          errorMakingQuery,
          result
        ) {
          done();
          if (errorMakingQuery) {
            console.log('Error making database query', errorMakingQuery);
            res.sendStatus(500);
          } else {
            res.sendStatus(200);
          }
        });
      }
    });
  } else {
    // failure best handled on the server. do redirect here.
    console.log('not logged in');
    // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
    res.send(false);
  }
});

// UPDATE user shows from the edit form
router.put('/editShow', function(req, res) {
  console.log('editShow', req.body);

  var imageToInsert;

  if (req.body.details[0].newImage) {
    imageToInsert = req.body.details[0].newImage;
  } else {
    imageToInsert = req.body.details[0].image;
  }

  if (req.isAuthenticated()) {
    pool.connect(function(errDatabase, client, done) {
      if (errDatabase) {
        console.log('Error connecting to database', errDatabase);
        res.sendStatus(500);
      } else {
        client.query(
          'UPDATE users_shows SET artist=$1, show_date=$2, venue=$3, city=$4, state=$5, image=$6 WHERE id=$7;',
          [
            req.body.details[0].artist,
            req.body.details[0].show_date,
            req.body.details[0].venue,
            req.body.details[0].city,
            req.body.details[0].state,
            imageToInsert,
            req.body.details[0].id
          ],
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

// UPDATE artist image
router.put('/updateArtistImage', function(req, res) {
  console.log('updateArtistImage', req.body);

  if (req.isAuthenticated()) {
    pool.connect(function(errDatabase, client, done) {
      if (errDatabase) {
        console.log('Error connecting to database', errDatabase);
        res.sendStatus(500);
      } else {
        client.query(
          'UPDATE users_shows SET image=$1 WHERE id=$2;',
          [req.body.image, req.body.show],
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

// Add notes to the users_shows table
router.put('/addNote', function(req, res) {
  if (req.isAuthenticated()) {
    pool.connect(function(errDatabase, client, done) {
      if (errDatabase) {
        console.log('Error connecting to database', errDatabase);
        res.sendStatus(500);
      } else {
        client.query(
          'UPDATE users_shows SET notes=$1 WHERE id=$2;',
          [req.body.details[0].notes, req.body.details[0].id],
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

// get mbid information
var lastFmApiKey =
  process.env.LASTFM_API_KEY || require('../config.js').musicApi.lastFmApiKey;

router.get('/artistImage', function(req, res) {
  var artist = req.query.artist;
  if (req.isAuthenticated()) {
    request(
      {
        url:
          'http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=' +
          artist +
          '&api_key=' +
          lastFmApiKey +
          '&format=json',
        headers: {
          Accept: 'application/json',
          'User-Agent': 'request'
        }
      },
      function(error, response, body) {
        if (response && response.statusCode == 200) {
          res.send(body);
        } else {
          console.log('error', error);
          res.sendStatus(204);
        }
      }
    );
  }
});

// GET all shows
router.get('/getAllShows', function(req, res) {
  // check if logged in
  if (req.isAuthenticated()) {
    pool.connect(function(errDatabase, client, done) {
      if (errDatabase) {
        console.log('Error connecting to database', err);
        res.sendStatus(500);
      } else {
        client.query(
          'SELECT * FROM users_shows JOIN users ON users_shows.user_id = users.id;',
          function(errQuery, data) {
            done();
            if (errQuery) {
              console.log('Error making database query', errQuery);
              res.sendStatus(500);
            } else {
              console.log(data.rows);
              res.send(data.rows);
            }
          }
        );
      }
    });
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

module.exports = router;
