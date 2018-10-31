require("dotenv").config();

const keys = require("./keys");
const request = require(`request`);
const moment = require(`moment`);
const DataLogger = require('./datalogger');
const appendLog = new DataLogger();

const Spotify = require("node-spotify-api");
const omdbAPI = require("omdb-client");

const bandsAPIkey = keys.bandsKey;
const spotify = new Spotify(keys.spotify);
const omdbAPIkey = keys.omdbKey;

const QueryAPI = function () {
    this.findConcert = function (userRequest) {
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

                        appendLog.logdata(JSON.stringify(concerts, null, 2));

                    })
                }
            }
        })
    };

    this.findSong = function (userRequest) {
        spotify.search({type: 'track', query: `${userRequest}`, limit: 5}, function (error, data) {
            if (error) {
                return console.log(`Error Occurred: ${error}`);
            }
            //console.log(data.tracks.items);
            let songsArray = data.tracks.items;
            songsArray.forEach(function (song) {
                let track = {};
                track.artist = song.artists[0].name;
                track.song = song.name;
                track.album = song.album.name;
                track.preview = song.preview_url;

                console.log("-----------------------------------------------------------------");
                console.log(track);

                appendLog.logdata(JSON.stringify(track, null, 2));
            })
        })
    };

    this.findMovie = function (userRequest) {
        let params = {
            apiKey: omdbAPIkey,
            plot: 'full',
            title: userRequest
        };

        omdbAPI.get(params, function (error, movie) {
            if (error) {
                console.log(error);
            }
            // console.log(movie);

            let movieData = {};
            movieData.title = movie.Title;
            movieData.released = movie.Released;
            movieData.rated = movie.Rated;
            movieData.imdbRating = movie.Ratings[0].Value;
            movieData.rottenTomatoesRating = movie.Ratings[1].Value;
            movieData.country = movie.Country;
            movieData.language = movie.Language;
            movieData.plot = movie.Plot;
            movieData.actors = movie.Actors;
            movieData.runtime = movie.Runtime;

            console.log(movieData);

            appendLog.logdata(JSON.stringify(movieData, null, 2));
        })
    };

    this.findShow = function (userSearch) {
        console.log(userSearch);

        let showURL = `http://api.tvmaze.com/singlesearch/shows?q=${userSearch}`;
        request(showURL, function (error, response, data) {

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
                appendLog.logdata(JSON.stringify(showInfo, null, 2));

            }
        })
    };

    this.findActor = function (userSearch) {
        console.log(userSearch);
        let actorURL = `http://api.tvmaze.com/search/people?q=${userSearch}`;
        request(actorURL, function (error, response, data) {
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
                appendLog.logdata(JSON.stringify(actorInfo, null, 2));

            }
        })
    };
};

module.exports = QueryAPI;
