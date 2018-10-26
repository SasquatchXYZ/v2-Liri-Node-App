

const QueryAPI = function () {
/*    this.secondChoice = function () {
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
                    .findShow(user.term);
                }
            });
    };*/
    this.findShow = function (userSearch) {
        console.log(userSearch);
    };
    this.findActor = function (userSearch) {
        console.log(userSearch);
    };
};

module.exports = QueryAPI;
