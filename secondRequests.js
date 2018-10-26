const inquirer = require("inquirer");

const QueryAPI = require(`./queries.js`);
const queryAPI = new QueryAPI();

const SecondRequests = function () {
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
                } else {
                    queryAPI.findActor(user.term);
                }
            });
    }
};

module.exports = SecondRequests;
