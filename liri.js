require("dotenv").config();

let keys = require("./keys");
let fs = require("fs");
let request = require("request");
let moment = require("moment");
let inquirer = require("inquirer");
let Spotify = require("node-spotify-api");
let bandsintown = require("bandsintown")("codingbootcamp");
let omdb = require("omdb");

let api;

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
    let request = user.userRequest;
    switch (request) {
        case "Concert":
            api = "concert";
            question = "Who would you like to see?";
            secondRequest(question);
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
            api = "song";
            question = "What song shall I find?";
            secondRequest(question);
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
            api = "movie";
            question = "What movie should I find?";
            secondRequest(question);
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
            console.log("random");
            break;
    }
});

function secondRequest(question) {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'request',
                message: `${question}`,
            }
        ])
        .then(function(user) {
            console.log(user.request);
        });
}