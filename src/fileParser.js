/*
    
*/


const fs = require('fs');
const readline = require('readline');

module.exports = {
    'parser': (filename, callback) => {
        if(!fs.existsSync(filename)) throw new TypeError("File with specified path: "+filename+", does not exist!", "index.js");
        const fileLines = readline.createInterface({
            input: fs.createReadStream(filename),
            output: false,
            console: false
        });

        let lines = [];

        fileLines.on('line', l => {
            lines.push(l.replace(/\s\s+/g, '  '));
        });

        fileLines.on('close', () => {
            callback(lines);
        });
    }
}