var express = require('express');
var router = express.Router();
var pool = require('../modules/pool');

// Handles Ajax request for user information if user is authenticated
router.get('/', function (req, res) {
    console.log('get /user route');
    // check if logged in
    if (req.isAuthenticated()) {
        console.log('this is the req.body', req.body);
        console.log('this is the req.user', req.user);

        pool.connect(function (errDatabase, client, done) {
            if (errDatabase) {
                console.log('Error connecting to database', err);
                res.sendStatus(500);
            } else {
                client.query('SELECT * FROM users_shows', function (errQuery, data) {
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

// router.get('/', function (req, res) {
//     console.log('this is the req.body', req.body);
//     console.log('this is the req.user', req.user);

//     pool.connect(function (errDatabase, client, done) {
//         if (errDatabase) {
//             console.log('Error connecting to database', err);
//             res.sendStatus(500);
//         } else {
//             client.query('SELECT * FROM users_shows', function (errQuery, data) {
//                 done();
//                 if (errQuery) {
//                     console.log('Error making database query', errQuery);
//                     res.sendStatus(500);
//                 } else {
//                     console.log(data.rows);
//                     res.send(data.rows);
//                 }
//             });
//         }
//     });
// });

// clear all server session information about this user
router.get('/logout', function (req, res) {
    // Use passport's built-in method to log out the user
    console.log('Logged out');
    req.logOut();
    res.sendStatus(200);
});


module.exports = router;
