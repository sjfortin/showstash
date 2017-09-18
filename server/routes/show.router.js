var express = require('express');
var router = express.Router();
var pool = require('../modules/pool');

// Using requst module to make HTTP requests from the server
// https://www.npmjs.com/package/request
var request = require('request');

var setListApiKey = process.env.SETLIST_API_KEY || require('../config.js').setlistApiKey;

// GET My Shows from users_shows table
router.get('/myShows', function (req, res) {
    // check if logged in
    if (req.isAuthenticated()) {
        pool.connect(function (errDatabase, client, done) {
            if (errDatabase) {
                console.log('Error connecting to database', err);
                res.sendStatus(500);
            } else {
                client.query('SELECT * FROM users_shows WHERE user_id=$1;', [req.user.id], function (errQuery, data) {
                    done();
                    if (errQuery) {
                        console.log('Error making database query', errQuery);
                        res.sendStatus(500);
                    } else {
                        console.log(data.rows);
                        res.send(data.rows);
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

// POST manual shows to users_shows table
router.post('/addShowManually', function (req, res) {
    var userID = req.user.id;
    if (req.isAuthenticated()) {
        pool.connect(function (errDatabase, client, done) {
            if (errDatabase) {
                console.log('Error connecting to database', errDatabase);
                res.sendStatus(500);
            } else {
                client.query('INSERT INTO users_shows (artist, show_date, venue, city, state, user_id) VALUES ($1, $2, $3, $4, $5, $6);', [req.body.artist, req.body.show_date, req.body.venue, req.body.city, req.body.state, userID], function (errQuery, data) {
                    done();
                    if (errQuery) {
                        console.log('Error making database query', errQuery);
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(201);
                    }
                });
            }
        });
    }
});


// GET Search Results from server
router.get('/searchResults', function (req, res) {
    if (req.isAuthenticated()) {
        request({
            url: 'https://api.setlist.fm/rest/1.0/search/setlists?artistName=' + req.query.artist + '&cityName=' + req.query.city + '&p=1',
            headers: {
                'Accept': 'application/json',
                'x-api-key': setListApiKey,
                'User-Agent': 'request'
            }
        }, function (error, response, body) {
            if (response && response.statusCode == 200) {
                res.send(body);
            } else {
                console.log('error', error);
                res.sendStatus(204);
            }
        });
    }
});

// POST from Search Results add button
router.post('/addSearchedShow', function (req, res) {
    console.log('this is the search req.body', req.body);

    var userID = req.user.id;
    if (req.isAuthenticated()) {
        pool.connect(function (errDatabase, client, done) {
            if (errDatabase) {
                console.log('Error connecting to database', errDatabase);
                res.sendStatus(500);
            } else {
                client.query('INSERT INTO users_shows (artist, mbid, show_date, venue, city, state, version_id, user_id, setlist) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning id;',
                    [
                        req.body.artist,
                        req.body.mbid,
                        req.body.show_date,
                        req.body.venue,
                        req.body.city,
                        req.body.state,
                        req.body.version_id,
                        userID,
                        req.body.setlist
                    ],
                    function (errQuery, data) {
                        done();
                        if (errQuery) {
                            console.log('Error making database query', errQuery);
                            res.sendStatus(500);
                        } else {
                            res.send(data.rows);
                        }
                    });
            }
        });
    }
});

// GET individual show details
router.get('/showDetails', function (req, res) {
    // check if logged in
    if (req.isAuthenticated()) {
        pool.connect(function (errDatabase, client, done) {
            if (errDatabase) {
                console.log('Error connecting to database', err);
                res.sendStatus(500);
            } else {
                client.query('SELECT * FROM users_shows WHERE id=$1;', [req.query.id], function (errQuery, data) {
                    done();
                    if (errQuery) {
                        console.log('Error making database query', errQuery);
                        res.sendStatus(500);
                    } else {
                        console.log(data.rows);
                        res.send(data.rows);
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

// Delete show route
router.delete('/deleteShow', function (req, res) {
    if (req.isAuthenticated()) {
        var showID = req.query.id;
        pool.connect(function (errorConnectingToDatabase, client, done) {
            if (errorConnectingToDatabase) {
                console.log('Error connecting to database', errorConnectingToDatabase);
                res.sendStatus(500);
            } else {
                client.query('DELETE FROM users_shows WHERE id=$1',
                    [showID],
                    function (errorMakingQuery, result) {
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
router.put('/editShow', function (req, res) {
    console.log('req.body', req.body.details[0]);
    if (req.isAuthenticated()) {
        pool.connect(function (errDatabase, client, done) {
            if (errDatabase) {
                console.log('Error connecting to database', errDatabase);
                res.sendStatus(500);
            } else {
                client.query('UPDATE users_shows SET artist=$1, show_date=$2, venue=$3, city=$4, state=$5 WHERE id=$6;', [req.body.details[0].artist, req.body.details[0].show_date, req.body.details[0].venue, req.body.details[0].city, req.body.details[0].state, req.body.details[0].id], function (errQuery, data) {
                    done();
                    if (errQuery) {
                        console.log('Error making database query', errQuery);
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(201);
                    }
                });
            }
        });
    }
});

// Add notes to the users_shows table
router.put('/addNote', function (req, res) {
    if (req.isAuthenticated()) {
        pool.connect(function (errDatabase, client, done) {
            if (errDatabase) {
                console.log('Error connecting to database', errDatabase);
                res.sendStatus(500);
            } else {
                client.query('UPDATE users_shows SET notes=$1 WHERE id=$2;', [req.body.details[0].notes, req.body.details[0].id], function (errQuery, data) {
                    done();
                    if (errQuery) {
                        console.log('Error making database query', errQuery);
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(201);
                    }
                });
            }
        });
    }
});
// clear all server session information about this user
router.get('/logout', function (req, res) {
    // Use passport's built-in method to log out the user
    console.log('Logged out');
    req.logOut();
    res.sendStatus(200);
});


module.exports = router;
