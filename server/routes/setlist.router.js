var express = require('express');
var router = express.Router();
var pool = require('../modules/pool');

// Using requst module to make HTTP requests from the server
// https://www.npmjs.com/package/request
var request = require('request');

var setListApiKey = process.env.SETLIST_API_KEY || require('../config.js').setlistApiKey;

// setlist.fm GET
var setlist = {
    url: 'https://api.setlist.fm/rest/1.0/search/setlists?artistName=Big%20Thief&cityName=Minneapolis&p=1',
    headers: {
        'Accept': 'application/json',
        'x-api-key': 'e79a7647-93fd-43c2-8df4-294e266401d6',
        'User-Agent': 'request'
    }
};

router.get('/', function (req, res) {
    console.log('get setlist has been hit');

    request(setlist, function (error, response, body) {
        if (response && response.statusCode == 200) {
            res.send(body);
        } else {
            console.log('error', error);
            res.sendStatus(500);
        }
    });
});

router.get('/search', function (req, res) {
    console.log('req.query', req.query);

    request({
        url: 'https://api.setlist.fm/rest/1.0/search/setlists?artistName=' + req.query.band + '&cityName=' + req.query.city + '&p=1',
        headers: {
            'Accept': 'application/json',
            'x-api-key': 'e79a7647-93fd-43c2-8df4-294e266401d6',
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
});

module.exports = router;
