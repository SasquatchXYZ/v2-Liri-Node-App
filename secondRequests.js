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
    this.tvshow = function () {
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
