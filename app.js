const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const dateFormat = require('dateformat');
const sniffer = require('./modules/sniffer');
const port = process.env.PORT || 3000;

var app = express();
app.set('view engins', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use((req, res, next) => {
    let now = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    let log = `${now}: ${req.method} ${req.url}`;
    fs.appendFile('server.log', log + '\n', (err) => {
        if(err) {
            console.log('Unable to append to server.log file.');
            console.log(err.message);
        }
    });
    
    console.log(log);
    next();
});

hbs.registerHelper('getCurrentMonth', () => {  
    return new Date().toLocaleString('default', { month: 'long' });
});

setInterval(() => {
    //let now = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    sniffer.getMonthlyHighPrice('btc').then((response) => {
        console.log(response);
        return sniffer.getMonthlyHighPrice('ltc');
    }, (message) => {
        console.log(message);
    }).then((response) => {
        console.log(response);
    }, (message) => {
        console.log(message);
    });
}, 12 * 60 * 60 * 1000);  // 12 Hours * 60 minuts * 60 seconds * 1000 ms

app.get('/', (req, res) => {
    var prices = {};
    sniffer.getCurrentPrice('btc').then((response) => {
        prices.btcPrice = toCurrencty(response);
        return sniffer.getMonthlyHighPrice('btc');
    }, message => {
        console.log(message);
    }).then((response) => {
        prices.btcHigh = toCurrencty(response);
        return sniffer.getCurrentPrice('ltc');
    }, (message) => {
        console.log(message);
    }).then((response) => {
        prices.ltcPrice = toCurrencty(response);
        return sniffer.getMonthlyHighPrice('ltc');
    }, (message) => {
        console.log(message);
    }).then((response) => {
        prices.ltcHigh = toCurrencty(response);
        res.render('index.hbs', prices);
    }, (message) =>{
        console.log(message);
    });
});

app.get('/:symbol', (req, res) => {
    sniffer.getCurrentPrice(req.params.symbol).then(response => {
        var data;
        if(req.params.symbol === 'btc')
            data = {'btcPrice': toCurrencty(response) };
        else if(req.params.symbol === 'ltc')
            data = {'ltcPrice':  toCurrencty(response) };

        res.render('index.hbs', data);
    }, message => {
        console.log(message);
    });

});

var toCurrencty = (num) => {
    return parseFloat(num).toLocaleString('en-US', { style: 'currency', currency: 'USD'});
};

app.listen(port, console.log(`Server is up and running, listening on port ${port}`));
