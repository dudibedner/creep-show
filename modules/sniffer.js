const fs = require('fs');
const axios = require('axios');
//const { resolve } = require('path');
const stampBaseUrl = 'https://www.bitstamp.net/api/v2/ticker';

var highPricesBuffer = [];

var getMonthlyHighPrice = (symbol) => {
    let _highPriceBuffer = highPricesBuffer[symbol];
    if(_highPriceBuffer) {
        return new Promise((resolve, reject) => {
            resolve(_highPriceBuffer);
            console.log(`resolved ${symbol} highest price (${_highPriceBuffer}) from buffer`);    
        });
    }
    
    var highestPrice;
    var filePath = `sniffer_${symbol}_data.txt`;
    return new Promise((resolve, reject) => {
        var content = fs.readFileSync(filePath, 'utf8');
        if(content)
            highestPrice = JSON.parse(content.toString());

        let now = new Date();
        var period = now.getFullYear() * 100 + now.getMonth() + 1;  // July 2020: 202007
        axios.get(`${stampBaseUrl}/${symbol}usd`).then(response => {
            if(!highestPrice) {
                highestPrice = {
                    period: period,
                    price: response.data.high
                };
                fs.writeFile(filePath, JSON.stringify(highestPrice), (err) => { if(err) console.log(err) });
            }
            else if(highestPrice.price < response.data.high || highestPrice.period < period) {
                highestPrice.price = response.data.high;
                highestPrice.period = period;
                fs.writeFile(filePath, JSON.stringify(highestPrice), (err) => { if(err) console.log(err) });
            }

            resolve(highestPrice.price);
            highPricesBuffer[symbol] = highestPrice.price;
            setTimeout(() => {
                highPricesBuffer[symbol]  = undefined;
            }, 300000);  // Keep value buffered for 5 minutes

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
