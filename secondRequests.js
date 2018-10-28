const inquirer = require("inquirer");

const DataLogger = require('./datalogger');
const appendLog = new DataLogger();

const QueryAPI = require(`./queries.js`);
const queryAPI = new QueryAPI();

const SecondRequests = function () {
    this.concert = function () {
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'artist',
                    message: 'Who would you like to see?'
                }
            ])
            .then(function (user) {
                console.log(user.artist);
                queryAPI.findConcert(user.artist);
                appendLog.logdata(`Band: ${user.artist}`);
            });
    };

    this.song = function() {
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'songTitle',
                    message: 'What song shall I find?',
                }
            ])
            .then(function (user) {
                console.log(user.songTitle);
                queryAPI.findSong(user.songTitle);
                appendLog.logdata(`Song: ${user.songTitle}`);
            });
    };

    this.movie = function() {
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'movieTitle',
                    message: 'What movie should I find?'
                }
            ])
            .then(function (user) {
                console.log(user.movieTitle);
                queryAPI.findMovie(user.movieTitle);
                appendLog.logdata(`Movie: ${user.movieTitle}`);
            });
    }
    this.tvShow = function () {
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'search',
                    message: 'Search by:',
                    choices: ['Show', 'Actor/Actress']
                }, {
                    type: 'input',
                    name: 'term',
                    message: 'Name?'
                }
            ])
            .then(function (user) {
                //console.log(user.search, user.term);
                if (user.search === 'Show') {
                    queryAPI.findShow(user.term);
                    appendLog.logdata(`Show: ${user.term}`);
                } else {
                    queryAPI.findActor(user.term);
                    appendLog.logdata(`Actor/Actress: ${user.term}`);
                }
            });
    }
};

module.exports = SecondRequests;
