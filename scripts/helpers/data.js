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
    var newData = [];

    newData.demographics = {
        'house': data[0],
        'senate': data[1].concat(data[2])
    }

    return newData;
}

function getData() {
    var isDone = false;

    fetchData(function(result) {
        data = result;
        data = sortResults(data);

        data.results = {};
        data.results.senate = request('GET', 'https://gdn-cdn.s3.amazonaws.com/2018/11/midterms-results/csv/senate.csv?update=21390644');
        data.results.senate = csvjson.toObject(data.results.senate.getBody('utf8'))
        data.results.house = request('GET', 'https://gdn-cdn.s3.amazonaws.com/2018/11/midterms-results/csv/house.csv?update=1234534');
        data.results.house = csvjson.toObject(data.results.house.getBody('utf8'))

        isDone = true;
    });

    deasync.loopWhile(function() {
        return !isDone;
    });

    return data;
};

getData()
