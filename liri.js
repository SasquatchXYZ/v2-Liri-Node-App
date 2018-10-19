require("dotenv").config();

let keys = require("./keys");
let fs = require("fs");
let request = require("request");
let moment = require("moment");
let inquirer = require("inquirer");
let Spotify = require("node-spotify-api");
let bandsintown = require("bandsintown")("codingbootcamp");
let omdb = require("omdb");

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
            console.log(user);
            console.log(user.artist);
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
            console.log(user);
            console.log(user.songTitle);
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
            console.log(user);
            console.log(user.movieTitle);
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



/*function sortQuery(query, parameter) {
    console.log(query, )
}*/

/*
function queryRandom()*/
