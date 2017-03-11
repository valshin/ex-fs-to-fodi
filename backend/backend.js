var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(function (req, res, next) {
    var oneof = false;
    if (req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }
    if (req.headers['access-control-request-method']) {
        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        oneof = true;
    }
    if (req.headers['access-control-request-headers']) {
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        oneof = true;
    }
    if (oneof) {
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
    }

    // intercept OPTIONS method
    if (oneof && req.method == 'OPTIONS') {
        res.sendStatus(200);
    }
    else {
        next();
    }
});

var clear = function (id) {
    return new Promise(function (res, rej) {
        request({
            url: 'http://anonymous@192.168.0.105:8100/jsonrpc',
            method: 'POST',
            json: {
                "jsonrpc": "2.0",
                "method": "Playlist.Clear",
                "params": {"playlistid": id},
                "id": 1
            }
        }, function (error, response, body) {
            res();
        });
    })
};

var add = function (data) {
    return new Promise(function (res, rej) {
        request({
            url: 'http://anonymous@192.168.0.105:8100/jsonrpc',
            method: 'POST',
            json: data
        }, function (error, response, body) {
            request({
                url: 'http://anonymous@192.168.0.105:8100/jsonrpc',
                method: 'POST',
                json: {
                    "jsonrpc": "2.0",
                    "method": "Player.Open",
                    "params": {"item": {"playlistid": 1, "position": 0}},
                    "id": 1
                }
            }, function (error, response, body) {
                res();
            })
        });
    })
};

var play = function () {
    return new Promise(function (res, rej) {
        request({
            url: 'http://anonymous@192.168.0.105:8100/jsonrpc',
            method: 'POST',
            json: {
                "jsonrpc": "2.0",
                "method": "Player.Open",
                "params": {"item": {"playlistid": 1, "position": 0}},
                "id": 1
            }
        }, function (error, response, body) {
            res();
        });
    })
};

app.post('/play', function (req, res) {
    var body = req.body;
    Promise.all([clear(0), clear(1)])
        .then(add(body))
        .then(function () {
        res.sendStatus(200);
    });
    debugger
});

app.listen(8100, function () {
    console.log('Example app listening on port 8100!')
})