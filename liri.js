require("dotenv").config();

let keys = require("./keys");
let fs = require("fs");
let inquirer = require("inquirer");
let request = require("request");
let moment = require("moment");

let bandsintown = require("bandsintown")("codingbootcamp");
let Spotify = require("node-spotify-api");
let omdb = require("omdb");

const bandsAPI = "codingbootcamp";
let spotify = new Spotify(keys.spotify);

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
.then(function(user) {
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
        });

}
// LIRI's Choice Functions =============================================================================================
function checkRandom() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        let text = data.replace(/"/g, "");
        /*console.log(data.split(",").join(" "));*/
        let randomArray = text.split(",");
        console.log(randomArray);
        let command = randomArray[0];
        let parameter = randomArray[1];
        let concertCommandsArray = ["concert-this", "concert", "band"];
        let songCommandsArray = ["spotify-this-song", "song"];
        let movieCommandsArray = ["movie-this", "movie", "film", "documentary"];

        if (concertCommandsArray.includes(command)) {
            sortRequest("Concert");
        } else if (songCommandsArray.includes(command)) {
            sortRequest("Song");
        } else if (movieCommandsArray.includes(command)) {
            sortRequest("Movie")
        }
    })
}

// Query API Functions =================================================================================================
function queryBandsInTown(userRequest) {
    let band = userRequest.split(" ").join("%20");
    let queryURL = `https://rest.bandsintown.com/artists/${band}/events?app_id=${bandsAPI}`;

    request(queryURL, function(error, response, data) {
        if (!error && response.statusCode === 200) {
            let results = JSON.parse(data);
            console.log(results);
        }
    })
}

function querySpotify(userRequest) {
    spotify.search({type: 'track', query: `${userRequest}`, limit: 1}, function(error, data){
        if (error) {
            return console.log(`Error Occurred: ${error}`);
        }
        //console.log(data);
        console.log(data.tracks.items[0]);
    })
}

function queryOMDB(userRequest) {
    let movie = userRequest.split(" ").join("+");
    console.log(movie);
}


/*function sortQuery(query, parameter) {
    console.log(query, )
}*/

/*
function queryRandom()*/
