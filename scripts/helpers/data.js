var request = require('sync-request');
var fs = require('fs-extra');
var gsjson = require('google-spreadsheet-to-json');
var deasync = require('deasync');
var request = require('sync-request');
var csvjson = require('csvjson');

var config = require('../config.json');
var userHome = require('user-home');
var keys = require(userHome + '/.gu/interactives.json');

var data;

function fetchData(callback) {
    gsjson({
        spreadsheetId: config.data.id,
        allWorksheets: true,
        credentials: keys.google
    })
    .then(function(result) {
        callback(result);
    })
    .then(function(err) {
        if (err) {
            console.log(err);
        }
    });
}

function sortResults(data) {
    var newData = {};

    newData.demographics = {
        'house': data[0],
        'senate': data[1].concat(data[2])
    }

    return newData;
}

function compileChamber(chamber) {
    compiledSeats = [];

    for (var i in data.results[chamber]) {
        var seat = data.results[chamber][i];

        if (seat.winner) {
            var demographics;

            for (var d in data.demographics[chamber]) {
                if (seat.winner === data.demographics[chamber][d].fullName) {
                    var demographics = data.demographics[chamber][d];
                }
            }

            if (demographics) {
                compiledSeats.push(demographics);
            } else {
                console.log('no match for ' + seat.winner + ' in ' + seat.seat);
            }
        } else {
            console.log('no winner for ' + seat.seat);
        }
    }

    return compiledSeats;
}

function getData() {
    var isDone = false;

    console.log('fetching demographics...');

    fetchData(function(result) {
        data = result;
        data = sortResults(data);

        console.log('fetching results...');
        data.results = {};
        data.results.senate = request('GET', 'https://gdn-cdn.s3.amazonaws.com/2018/11/midterms-results/csv/senate.csv?update=21390644');
        data.results.senate = csvjson.toObject(data.results.senate.getBody('utf8'));
        data.results.house = request('GET', 'https://gdn-cdn.s3.amazonaws.com/2018/11/midterms-results/csv/house.csv?update=1234534');
        data.results.house = csvjson.toObject(data.results.house.getBody('utf8'))

        console.log('building congressional demographics list...');

        data.compiled = {};
        console.log('buildling senate demographics list...');
        data.compiled.senate = compileChamber('senate');
        console.log('buildling house demographics list...');
        data.compiled.house = compileChamber('house');

        fs.mkdirsSync('./.data');
        fs.writeFileSync('./.data/data.json', JSON.stringify(data.compiled));

        isDone = true;
    });

    deasync.loopWhile(function() {
        return !isDone;
    });

};

getData()
