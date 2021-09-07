const fs = require('fs');
const os = require("os");
//const { parse } = require('path');

var now = new Date();
var period = now.getFullYear() * 100 + now.getMonth() + 1;

var ticker = {high: 50343.49, last: 50151.98, timestamp: 1630840490, bid: 50137.19, vwap: 49922.58, volume: 837.17064963, low: 49388.26, ask: 50164.50, open: 49965.32};

//console.log(JSON.stringify(ticker));
/*
fs.writeFile('playground.log', JSON.stringify(ticker), (err) => {
    if(err) {
        console.log('Unable to write to playground.log file.');
        console.log(err);
    }
});
*/

fs.readFile('playground.log', 'utf8', (err, data) => {
    if(err) {
        console.log('Unable to read to playground.log file.');
        console.log(err);
    }
    else{
        var ticker2 = JSON.parse(data.toString());
        console.log(ticker2);

        // var lines = data.toString().split(os.EOL);
        // var period = parseInt(lines[0]);
        // var price = parseFloat(lines[1]);
        // console.log(price);
        // console.log(period);


    }
});
