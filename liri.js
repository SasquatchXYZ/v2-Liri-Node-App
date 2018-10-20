require("dotenv").config();

let keys = require("./keys");
let fs = require("fs");
let inquirer = require("inquirer");
let request = require("request");
let moment = require("moment");

let bandsintown = require("bandsintown")("codingbootcamp");
let Spotify = require("node-spotify-api");
let omdb = require("omdb");

const bandsAPIkey = "codingbootcamp";
let spotify = new Spotify(keys.spotify);
const omdbAPIkey = "trilogy";

/*let optionsObject = [
    {
        type: "Concert",
        query: "concert-this",
        question: "Who would you like to see?"
    },
    {
        type: "Song",
        query: "spotify-song-this",
        question: "What is the name of the song?"
    },
    {
        type: "Movie",
        query: "movie-this",
        question: "What movie should I find?"
    }
];*/

inquirer
    .prompt([
        {
            type: 'list',
            name: 'userRequest',
            message: 'What Can I Help You Find?',
            choices: ["Concert", "Song", "Movie", "You Pick LIRI"]
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
            /*        inquirer
                            .prompt([
                                {
                                    type: 'input',
                                    name: 'bandRequest',
                                    message: 'Who Would You Like to See?',
                                }
                            ])
                            .then(function(user) {
                                let request = user.bandRequest;
                                console.log(request);
                            });*/
            break;
        case "Song":
            secondRequestSong();
            /* inquirer
                 .prompt([
                     {
                         type: 'input',
                         name: 'songRequest',
                         message: 'What Song?',
                     }
                 ])
                 .then(function(user) {
                     let request = user.songRequest;
                     console.log(request);
                 });*/
            break;
        case "Movie":
            secondRequestMovie();
            /* inquirer
                 .prompt([
                     {
                         type: 'input',
                         name: 'movieRequest',
                         message: 'What Movie?',
                     }
                 ])
                 .then(function(user) {
                     let request = user.movieRequest;
                     console.log(request);
                 });*/
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
        let songCommandsArray = ["spotify-this-song", "song", "track"];
        let movieCommandsArray = ["movie-this", "movie", "film", "documentary"];

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
                //console.log("Uh, we had a slight weapons malfunction, but uh... everything's perfectly all right now. We're fine. We're all fine here now, thank you. How are you?");
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
                console.log(data.length);
                let results = JSON.parse(data);
                for (let n = 0; n < results.length; n++) {
                    let concerts = {};
                    concerts.venue = results[n].venue.name;
                    concerts.location = `${results[n].venue.city} ${results[n].venue.region}, ${results[n].venue.country}`;
                    concerts.date = moment(results[n].datetime).format("MM/DD/YYYY");

                    console.log("===========================================================");
                    console.log(concerts);

                    appendLog(JSON.stringify(concerts));
                }
            }
        }
    })
}

function querySpotify(userRequest) {
    spotify.search({type: 'track', query: `${userRequest}`, limit: 5}, function (error, data) {
        if (error) {
            return console.log(`Error Occurred: ${error}`);
        }
        //console.log(data.tracks.items);
        let songsArray = data.tracks.items;
        for (let y = 0; y < songsArray.length; y++) {
            let track = {};
            track.artist = songsArray[y].artists[0].name;
            track.song = songsArray[y].name;
            track.album = songsArray[y].album.name;
            track.preview = songsArray[y].preview_url;

            console.log("===========================================================");
            console.log(track);

            appendLog(JSON.stringify(track));
        }
    })
}

function queryOMDB(userRequest) {
    let movie = userRequest.split(" ").join("+");
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
    })
}

// Log Function to Append to random.txt ================================================================================
function appendLog(data) {
    let stream = fs.createWriteStream('./log.txt', {flags: 'a'});
    stream.write(`${data}\r`);
    stream.end();
}