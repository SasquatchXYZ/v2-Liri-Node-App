require("dotenv").config();

const keys = require("./keys");
const fs = require("fs");
const inquirer = require("inquirer");
const request = require("request");
const moment = require("moment");


const bandsintown = require("bandsintown")(keys.bandsKey);
const Spotify = require("node-spotify-api");
const omdbAPI = require("omdb-client");


const bandsAPIkey = keys.bandsKey;
const spotify = new Spotify(keys.spotify);
const omdbAPIkey = keys.omdbKey;

// const TV = require(`./tv`);
// const TVMaze = require(`./queries.js`);
// const queryTVMaze = new TVMaze();
const SecondRequest = require(`./secondRequests`);
let secondRequest = new SecondRequest();

inquirer
    .prompt([
        {
            type: 'list',
            name: 'userRequest',
            message: 'What Can I Help You Find?',
            choices: ['Concert', 'Song', 'Movie', 'TV', 'You Pick LIRI']
        }
    ])
    .then(function (user) {
        let userChoice = user.userRequest;
        sortRequest(userChoice);
    });

function sortRequest(userChoice) {
    switch (userChoice) {
        case "Concert":
            secondRequestConcert();
            break;
        case "Song":
            secondRequestSong();
            break;
        case "Movie":
            secondRequestMovie();
            break;
        case 'TV':
            secondRequest.tvshow();
            break;
        case "You Pick LIRI":
            checkRandom();
            appendLog("Dealer's Choice");
            break;
    }
}

// Secondary Question Functions ========================================================================================
function secondRequestConcert() {
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
            queryBandsInTown(user.artist);
            appendLog(`Band: ${user.artist}`);
        });

}

function secondRequestSong() {
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
            querySpotify(user.songTitle);
            appendLog(`Song: ${user.songTitle}`);
        });

}

function secondRequestMovie() {
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
            queryOMDB(user.movieTitle);
            appendLog(`Movie: ${user.movieTitle}`);
        });

}

/*function secondRequestTV() {
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
        });
}*/
// LIRI's Choice Functions =============================================================================================
function checkRandom() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        let text = data.replace(/"/g, "");
        /*console.log(data.split(",").join(" "));*/
        let randomArray = text.split(",");
        console.log(randomArray);
        let command = randomArray[0].trim();
        console.log(command);
        let parameter = randomArray[1].trim();
        console.log(parameter);
        let concertCommandsArray = ["concert-this", "concert", "band", "artist"];
        let songCommandsArray = ["spotify-this-song", "song", "track", "radio"];
        let movieCommandsArray = ["movie-this", "movie", "film", "documentary", "picture", "motion picture"];

        appendLog(`random.txt says: "${randomArray}"`);

        if (randomArray.length === 1) {
            if (concertCommandsArray.includes(command)) {
                sortRequest("Concert");
            } else if (songCommandsArray.includes(command)) {
                sortRequest("Song");
            } else if (movieCommandsArray.includes(command)) {
                sortRequest("Movie");
            } else {
                console.log("Check your random.txt, something's missing...");
                appendLog("Uh, we had a slight weapons malfunction, but uh... everything's perfectly all right now. We're fine. We're all fine here now, thank you. How are you?");
            }
        } else if (randomArray.length === 2) {
            if (concertCommandsArray.includes(command)) {
                queryBandsInTown(parameter);
            } else if (songCommandsArray.includes(command)) {
                querySpotify(parameter);
            } else if (movieCommandsArray.includes(command)) {
                queryOMDB(parameter);
            }
        }
    })
}

// Query API Functions =================================================================================================
function queryBandsInTown(userRequest) {
    let band = userRequest.split(" ").join("%20");
    let queryURL = `https://rest.bandsintown.com/artists/${band}/events?app_id=${bandsAPIkey}`;

    request(queryURL, function (error, response, data) {
        if (!error && response.statusCode === 200) {
            if (data.length === 3) {
                console.log("There are no upcoming shows for this artist.");
                appendLog("There are no upcoming shows for this artist.");
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

                    appendLog(JSON.stringify(concerts));

                })
            }
        }
    })

    /*        bandsintown
                .getArtistEventList(userRequest)
                .then(function(events) {
                   console.log(events.length);
                   events.forEach(function(show) {

                       let concert = {};
                       concert.title = show.title;
                       concert.venue = show.venue.name;
                       concert.date = show.formatted_datetime;
                       concert.location = show.formatted_location;

                       console.log("----------------------------------------------------------------------------");
                       console.log(concert);

                       appendLog(JSON.stringify(concert));
                   })
                });*/
}

function querySpotify(userRequest) {
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

            console.log("===========================================================");
            console.log(track);

            appendLog(JSON.stringify(track));
        })
    })
}

function queryOMDB(userRequest) {

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

        appendLog(JSON.stringify(movieData));
    })

    /*let movie = userRequest.split(" ").join("+");
    let queryURL = `http://www.omdbapi.com/?t=${movie}&y=&plot=short&apikey=${omdbAPIkey}`;


    request(queryURL, function (error, response, data) {
        if (!error && response.statusCode === 200) {
            let results = JSON.parse(data);

            let movieObject = {};
            movieObject.title = results.Title;
            movieObject.releaseYear = results.Year;
            movieObject.rated = results.Rated;
            movieObject.imdbRating = results.Ratings[0].Value;
            movieObject.rottenTomatoesRating = results.Ratings[1].Value;
            movieObject.country = results.Country;
            movieObject.language = results.Language;
            movieObject.plot = results.Plot;
            movieObject.actors = results.Actors;

            console.log(movieObject);

            appendLog(JSON.stringify(movieObject));
        }
    })*/
}

// Log Function to Append to random.txt ================================================================================
function appendLog(data) {
    let stream = fs.createWriteStream('./log.txt', {flags: 'a'});
    stream.write(`\n${data}\n`);
    stream.end();
}