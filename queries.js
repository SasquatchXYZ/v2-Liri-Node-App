const request = require(`request`);
const moment = require(`moment`);

const QueryAPI = function () {
    this.findShow = function (userSearch) {
        console.log(userSearch);

        let showURL = `http://api.tvmaze.com/singlesearch/shows?q=${userSearch}`;
        request(showURL, function(error, response, data) {

            if (!error && response.statusCode === 200) {
                let show = JSON.parse(data);
                //console.log(show);

                let showInfo = {};
                showInfo.name = show.name;
                showInfo.genres = show.genres.join(", ");
                if (show.network === null) {
                    showInfo.network = show.webChannel.name;
                } else {
                    showInfo.network = show.network.name;
                }
                showInfo.rating = show.rating.average;
                showInfo.premiered = moment(show.premiered).format('MMMM-DD-YYYY');
                showInfo.summary = show.summary;

                console.log(showInfo);

            }
        })
    };

    this.findActor = function (userSearch) {
        console.log(userSearch);
        let actorURL = `http://api.tvmaze.com/search/people?q=${userSearch}`;
        request(actorURL, function(error, response, data) {
            if (!error && response.statusCode === 200) {
                let actor = JSON.parse(data)[0].person;
                //console.log(actor);
                let actorInfo = {};
                actorInfo.name = actor.name;
                actorInfo.gender = actor.gender;
                actorInfo.birtday = moment(actor.birthday).format('MMMM-DD-YYYY');
                actorInfo.country = actor.country.name;
                actorInfo.url = actor.url;

                console.log(actorInfo);

            }
        })
    };
};

module.exports = QueryAPI;
