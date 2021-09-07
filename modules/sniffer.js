const fs = require('fs');
const axios = require('axios');

const stampBaseUrl = 'https://www.bitstamp.net/api/v2/ticker';
//const stampLtcUtl = 'https://www.bitstamp.net/api/v2/ticker/ltcusd';

var getMonthlyHighPrice = (symbol) => {
    var highestPrices;
    var filePath = `sniffer_${symbol}_data.txt`;
    return new Promise((resolve, reject) => {
        var content = fs.readFileSync(filePath, 'utf8');
        if(content)
            highestPrices = JSON.parse(content.toString());

        let now = new Date();
        var period = now.getFullYear() * 100 + now.getMonth() + 1;  // July 2020: 202007
        axios.get(`${stampBaseUrl}/${symbol}usd`).then(response => {
            if(!highestPrices) {
                highestPrices = {
                    period: period,
                    price: response.data.high
                };
            }
            else if(highestPrices.price < response.data.high || highestPrices.period < period) {
                highestPrices.price = response.data.high;
                highestPrices.period = period;
            }

            fs.writeFileSync(filePath, JSON.stringify(highestPrices));
            resolve(highestPrices.price);
        }, message => {
            reject(message);
        }).catch(e => {
            console.log(e);
        });
    });
};

var getCurrentPrice = (symbol) => {
    return new Promise((resolve, reject) => {
        axios.get(`${stampBaseUrl}/${symbol}usd`).then(response => {
            resolve(response.data.last);
        }, message => {
            reject(message);
        });
    });
};

module.exports = {getMonthlyHighPrice, getCurrentPrice };
