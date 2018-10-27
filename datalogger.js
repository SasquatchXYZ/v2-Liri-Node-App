const fs = require('fs');

const AppendLog = function() {
    this.logdata = function(data) {
        let stream = fs.createWriteStream('./log.txt', {flags: 'a'});
        stream.write(`\n${data}\n`);
        stream.end();
    }
};

module.exports = AppendLog;