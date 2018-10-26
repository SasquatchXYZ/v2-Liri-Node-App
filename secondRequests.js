const inquirer = require("inquirer");

const TVMaze = require(`./queries.js`);
const queryTVMaze = new TVMaze();

const SecondRequests = function() {
    this.tvshow = function() {
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'search',
                    message: 'Search by:',
                    choices: ['Show', 'Actor']
                }, {
                    type: 'input',
                    name: 'term',
                    message: 'Name?'
                }
            ])
            .then(function (user) {
                console.log(user.search, user.term);
                if (user.search === 'show') {
                    queryTVMaze.findShow(user.term);
                }
                queryTVMaze.findActor(user.term);
            });
    }
};

module.exports = SecondRequests;
