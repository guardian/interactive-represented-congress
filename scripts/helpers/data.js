var request = require('sync-request');
var fs = require('fs-extra');
var gsjson = require('google-spreadsheet-to-json');
var deasync = require('deasync');
var request = require('sync-request');
var csvjson = require('csvjson');
var cheerio = require('cheerio');

var config = require('../config.json');
var userHome = require('user-home');
var keys = require(userHome + '/.gu/interactives.json');

var data;
var $;

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

        if (seat.winner !== '') {
            var seatDemographic = null;

            for (var d in data.demographics[chamber]) {
                if (seat.winner === data.demographics[chamber][d].fullName) {
                    seatDemographic = data.demographics[chamber][d];
                    seatDemographic.party = data.results[chamber][i].party;
                }
            }

            if (seatDemographic) {
                compiledSeats.push(seatDemographic);
            } else {
                console.log('no match for ' + seat.winner + ' in ' + seat.seat);
            }
        } else {
            console.log('no winner for ' + seat.seat);
        }
    }

    return compiledSeats;
}

function appendMissingSenators() {
    for (var i in data.demographics.senate) {
        var senator = data.demographics.senate[i];
        var append = true;

        for (var d in data.compiled.senate) {
            if (data.compiled.senate[d].seat === senator.seat) {
                append = false; 
            }
        }

        if (append) {
            senator.party = senator.party.toUpperCase().charAt(0);
            data.compiled.senate.push(senator);
        }
    }

    return data.compiled.senate;
}

function calculateAgeRange(age) {
    if (age >= 65) {
        return 'Over 65'
    } else if (age >= 50) {
        return '50-64'
    } else if (age >= 35) {
        return '35-49';
    } else {
        return 'Under 35';
    }
}

function capitalise(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

function mapData(chamber) {
    console.log('hooking up with map');
    for (var i in data.compiled[chamber]) {
        var seat = data.compiled[chamber][i];
        var $seat = $('#' + (chamber === 'senate' ? 'SN_' : '') +  seat.seat);

        if ($seat.length > 0) {
            $seat.attr('data-name', seat.fullName);
            $seat.attr('data-party', seat.party);
            $seat.attr('data-gender', seat.gender === 'male' ? 'Male' : 'Female');
            $seat.attr('data-ethnicity', capitalise(seat.ethnicity));
            $seat.attr('data-age', calculateAgeRange(seat.age));
            $seat.attr('data-religion', findBroaderReligion(seat.religion));
            $seat.attr('data-orientation', seat.orientation === 'straight' ? 'Straight' : 'LGB');
        } else {
            console.log('Can\'t find ' + seat.seat + ' in map');
        }
    }
}

function findBroaderReligion(religion) {
    if (religion === 'african-methodist' || religion === 'anglican' || religion === 'baptist' || religion === 'catholic' || religion === 'christian' || religion === 'church-of-christ' || religion === 'church-of-god' || religion === 'congregationalist' || religion === 'eastern-orthodox' || religion === 'episcopalian' || religion === 'evangelical' || religion === 'lutheran' || religion === 'methodist' || religion === 'nazarene-christian' || religion === 'pentecostal' || religion === 'protestant' || religion === 'roman-catholic' || religion === 'seventh-day-adventist-church' || religion === 'southern-baptist' || religion === 'unitarian-universalist' || religion === 'united-methodist' || religion === 'christian-reformed' || religion === 'presbyterian' || religion === 'evangelical-lutheran' || religion === 'united-church-of-christ') {
        return 'Christian';
    } else if (religion === 'hindu') {
        return 'Hindu';
    } else if (religion === 'jewish') {
        return 'Jewish';
    } else if (religion === 'mormon') {
        return 'Mormon';
    } else if (religion === 'muslim') {
        return 'Muslim';
    } else if (religion === 'soka-gakkai-buddhist' || religion === 'buddhism') {
        return 'Buddhist';
    } else if (religion === 'humanist' || religion === 'agnostic') {
        return 'Non-religious';
    } else if (religion === 'unspecified' || religion === 'deist' || religion === 'N/A' || religion == 'unspecified/don\'t know/refused' || religion === 'unaffiliated') {
        return 'unspecified';
    } else {
        console.log('new religion discovered! ' + religion);
    }
}

function getData() {
    var isDone = false;

    console.log('fetching demographics...');

    fetchData(function(result) {
        data = result;
        data = sortResults(data);

        console.log('fetching results...');
        data.results = {};
        data.results.senate = request('GET', 'https://gdn-cdn.s3.amazonaws.com/2018/11/midterms-results/csv/senate.csv');
        data.results.senate = csvjson.toObject(data.results.senate.getBody('utf8'));
        data.results.house = request('GET', 'https://gdn-cdn.s3.amazonaws.com/2018/11/midterms-results/csv/house.csv');
        data.results.house = csvjson.toObject(data.results.house.getBody('utf8'))

        console.log('building congressional demographics list...');

        data.compiled = {};
        console.log('buildling senate demographics list...');
        data.compiled.senate = compileChamber('senate');
        console.log('buildling house demographics list...');
        data.compiled.house = compileChamber('house');

        data.compiled.senate = appendMissingSenators();

        var map = fs.readFileSync('./src/templates/partials/map.html');
            $ = cheerio.load(map);

        mapData('house');
        mapData('senate');

        fs.writeFileSync('./src/templates/partials/map-compiled.html', $.html());

        fs.mkdirsSync('./.data');
        fs.writeFileSync('./.data/data.json', JSON.stringify(data.compiled));

        isDone = true;
    });

    deasync.loopWhile(function() {
        return !isDone;
    });

};

getData();
