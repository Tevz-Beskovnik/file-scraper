let fs = require('fs');

module.exports = {
    'Parser': (filename) => {
        if(!fs.existsSync(filename)) throw new TypeError("File with specified path: "+filename+", does not exist!", "index.js");

    }
}