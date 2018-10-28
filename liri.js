require("dotenv").config();

const fs = require("fs");
const inquirer = require("inquirer");
const DataLogger = require('./datalogger');
const appendLog = new DataLogger();

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
            secondRequest.concert();
            break;
        case "Song":
            secondRequest.song();
            break;
        case "Movie":
            secondRequest.movie();
            break;
        case 'TV':
            secondRequest.tvShow();
            break;
        case "You Pick LIRI":
            checkRandom();
            appendLog.logdata("Dealer's Choice");
            break;
    }
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
        let songCommandsArray = ["spotify-this-song", "song", "track", "radio"];
        let movieCommandsArray = ["movie-this", "movie", "film", "documentary", "picture", "motion picture"];
        let tvCommandsArray = ['show-this', 'actor-this', 'show', 'series','actor','him','her'];
        appendLog(`random.txt says: "${randomArray}"`);

        if (randomArray.length === 1) {
            if (concertCommandsArray.includes(command)) {
                sortRequest("Concert");
            } else if (songCommandsArray.includes(command)) {
                sortRequest("Song");
            } else if (movieCommandsArray.includes(command)) {
                sortRequest("Movie");
            } else if (tvCommandsArray.includes(command)) {
                sortRequest('TV')
            }
         else {
                console.log("Check your random.txt, something's missing...");
                appendLog("Uh, we had a slight weapons malfunction, but uh... everything's perfectly all right now. We're fine. We're all fine here now, thank you. How are you?");
            }
        } else if (randomArray.length === 2) {
            if (concertCommandsArray.includes(command)) {
                queryAPI.findConcert(parameter);
            } else if (songCommandsArray.includes(command)) {
                query.song(parameter);
            } else if (movieCommandsArray.includes(command)) {
                queryOMDB(parameter);
            }
        }
    })
}
