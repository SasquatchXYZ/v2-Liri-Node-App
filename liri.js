require("dotenv").config();

let keys = require("./keys");
let fs = require("fs");
let request = require("request");
let moment = require("moment");
let inquirer = require("inquirer");
let Spotify = require("node-spotify-api");
let bandsintown = require("bandsintown")("codingbootcamp");
let omdb = require("omdb");

