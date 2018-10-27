require("dotenv").config();

const keys = require("./keys");
const request = require(`request`);
const moment = require(`moment`);
const DataLogger = require('./datalogger');
const appendLog = new DataLogger();

const bandsintown = require("bandsintown")(keys.bandsKey);
const Spotify = require("node-spotify-api");
const omdbAPI = require("omdb-client");

const bandsAPIkey = keys.bandsKey;
const spotify = new Spotify(keys.spotify);
const omdbAPIkey = keys.omdbKey;

const QueryAPI = function () {
    this.findConcert = function(userRequest) {
        let band = userRequest.split(" ").join("%20");
        let queryURL = `https://rest.bandsintown.com/artists/${band}/events?app_id=${bandsAPIkey}`;

        request(queryURL, function (error, response, data) {
            if (!error && response.statusCode === 200) {
                if (data.length === 3) {
                    console.log("There are no upcoming shows for this artist.");
                    appendLog.logdata("There are no upcoming shows for this artist.");
                } else {
                    console.log(JSON.parse(data).length);
                    let results = JSON.parse(data);
                    results.forEach(function (events) {
                        let concerts = {};
                        concerts.venue = events.venue.name;
                        concerts.location = `${events.venue.city} ${events.venue.region}, ${events.venue.country}`;
                        concerts.date = moment(events.datetime).format("MM/DD/YYYY");

                        console.log("-----------------------------------------------------------");
                        console.log(concerts);

                        appendLog.logdata(JSON.stringify(concerts));

                    })
                }
            }
        })
    };
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
                appendLog.logdata(JSON.stringify(showInfo));

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
                appendLog.logdata(JSON.stringify(actorInfo));

            }
        })
    };
};

module.exports = QueryAPI;
