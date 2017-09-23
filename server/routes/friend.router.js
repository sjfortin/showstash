var express = require('express');
var router = express.Router();
var pool = require('../modules/pool');

// Using requst module to make HTTP requests from the server
// https://www.npmjs.com/package/request
var request = require('request');


// GET My Shows from users_shows table
router.get('/getFriends', function (req, res) {
    var showID = req.query.id;
    // check if logged in
    if (req.isAuthenticated()) {
        pool.connect(function (errDatabase, client, done) {
            if (errDatabase) {
                console.log('Error connecting to database', err);
                res.sendStatus(500);
            } else {
                client.query('SELECT * FROM friends WHERE user_show=$1;',
                    [
                        showID
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
    } else {
        // failure best handled on the server. do redirect here.
        console.log('not logged in');
        // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
        res.send(false);
    }
});

// POST friends to friends table
router.post('/addFriend', function (req, res) {
    if (req.isAuthenticated()) {
        pool.connect(function (errDatabase, client, done) {
            if (errDatabase) {
                console.log('Error connecting to database', errDatabase);
                res.sendStatus(500);
            } else {
                client.query('INSERT INTO friends (first_name, last_name, user_show) VALUES ($1, $2, $3) returning *;',
                    [
                        req.body.first_name,
                        req.body.last_name,
                        req.body.showId
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

// Delete friend
router.delete('/deleteFriend', function (req, res) {
    if (req.isAuthenticated()) {
        var friendId = req.query.id;
        pool.connect(function (errorConnectingToDatabase, client, done) {
            if (errorConnectingToDatabase) {
                console.log('Error connecting to database', errorConnectingToDatabase);
                res.sendStatus(500);
            } else {
                client.query('DELETE FROM friends WHERE id=$1 returning *',
                    [
                        friendId
                    ],
                    function (errorMakingQuery, data) {
                        done();
                        if (errorMakingQuery) {
                            console.log('Error making database query', errorMakingQuery);
                            res.sendStatus(500);
                        } else {
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


module.exports = router;
