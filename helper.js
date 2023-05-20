
const fs = require('fs')

async function myFunction(file) {
    return new Promise((resolve) => {
        fs.open(file, "r", (err, file) => {
            if (err) throw err;
            resolve(
                new Promise((resolve) => {
                    fs.readFile(file, (err, data) => {
                        if (err) throw err;
                        resolve(data.toString().split(/\r?\n/));
                    });
                })
            );
        });
    });
}

async function bringAllWords(filename) {
    let result = await myFunction(filename)
    return result
}

module.exports =  bringAllWords