var express = require('express');
var router = express.Router();
var pool = require('../modules/pool');

// Using requst module to make HTTP requests from the server
// https://www.npmjs.com/package/request
var request = require('request');

var setListApiKey = process.env.SETLIST_API_KEY || require('../config.js').setlistApiKey;

// GET search results from setlist.fm
router.get('/search', function (req, res) {
    if (req.isAuthenticated()) {
        request({
            url: 'https://api.setlist.fm/rest/1.0/search/setlists?artistName=' + req.query.band + '&cityName=' + req.query.city + '&p=1',
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
                res.sendStatus(500);
            }
        });
    }
});

// POST to db => Search result add button
router.post('/addShow', function (req, res) {
    console.log('this is the search req.body', req.body);

    var userID = req.user.id;
    if (req.isAuthenticated()) {
        pool.connect(function (errDatabase, client, done) {
            if (errDatabase) {
                console.log('Error connecting to database', errDatabase);
                res.sendStatus(500);
            } else {
                client.query('INSERT INTO users_shows (band, show_date, venue, city, state, version_id, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7);',
                    [
                        req.body.band,
                        req.body.show_date,
                        req.body.venue,
                        req.body.city,
                        req.body.state,
                        req.body.version_id,
                        userID
                    ],
                    function (errQuery, data) {
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

module.exports = router;
