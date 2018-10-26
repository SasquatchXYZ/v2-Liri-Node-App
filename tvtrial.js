const request = require('request');
const logger = require('datalogger');

/*
const logger = new Logger();
*/





/*
class TV {
    constructor() {
        this.showsURL = `http://api.tvmaze.com/singlesearch/shows?q=`;
        this.actorsURL = `http://api.tvmaze.com/search/people?q=`;
    }

    sendRequest(url) {
        return new Promise((resolve, reject) => {
            request(url, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                if (body.indexOf(`{`) === 0 ) {
                    resolve(JSON.parse(body));
                } else if (body.indexOf('[') === 0) {
                    resolve(JSON.parse(body)[0]);
                } else {
                    console.log(body);
                    reject(`The data could not be parsed for our purposes.`)
                }
            })
        })
    }

    findShow(show) {
        const url = this.showsURL + show;

        this.sendRequest(url)
            .then(

            )
    }
}*/
