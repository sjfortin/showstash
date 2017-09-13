var express = require('express');
var router = express.Router();
var pool = require('../modules/pool');

// get all shows route
router.get('/', function (req, res) {
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


// POST new show to database via manual entry form
router.post('/', function (req, res) {
    var userID = req.user.id;
    if (req.isAuthenticated()) {
        pool.connect(function (errDatabase, client, done) {
            if (errDatabase) {
                console.log('Error connecting to database', errDatabase);
                res.sendStatus(500);
            } else {
                client.query('INSERT INTO users_shows (band, show_date, venue, city, state, user_id) VALUES ($1, $2, $3, $4, $5, $6);', [req.body.band, req.body.show_date, req.body.venue, req.body.city, req.body.state, userID], function (errQuery, data) {
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
