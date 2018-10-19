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
    let userChoice1 = user.userRequest;
    sortRequest(userChoice1);
});

function sortRequest(userChoice1) {
    switch (userChoice1) {
        case "Concert":
            let query = "concert-this";
            let question = "Who would you like to see?";
            secondRequest(query, question);
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
            let query2 = "spotify-this-song";
            let question2 = "What song shall I find?";
            secondRequest(query2, question2);
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
            let query3 = "movie-this";
            let question3 = "What movie should I find?";
            secondRequest(query3, question3);
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
}




function secondRequest(query, question) {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'request',
                message: `${question}`,
            }
        ])
        .then(function (user) {
            console.log(user.request);
            return user.request;
        });

    console.log();

}

/*function sortQuery(query, parameter) {
    console.log(query, )
}*/

/*
function queryRandom()*/
