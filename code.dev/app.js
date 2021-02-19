const axios = require('axios');
const crypto = require('crypto');

var markets = {
	binance: {
		url: 'https://api.binance.com',
		testUrlExtension: '/api/v3/ping',
		symbolListUrlExtension: '/api/v3/exchangeInfo',
		symbolPriceUrlExtension: '/api/v3/ticker/price?symbol='
	},
	btcturk: {
		url: 'https://api.btcturk.com',
		headerParams: [
			{name: 'X-PCK', value: '012e4da8-3e38-47d0-99ba-18f2f523f3e6'},
			{name: 'X-Stamp', value: Math.floor(new Date().getTime() / 1000)},
			{name: 'X-Signature', value: crypto.createHmac('SHA256', "gAgM7shFpPrgHVf2rvi80rrTZr0b3SR6").update('012e4da8-3e38-47d0-99ba-18f2f523f3e6' + Math.floor(new Date().getTime() / 1000)).digest('base64')}
		],
		testUrlExtension: 'none',
		symbolListUrlExtension: '/api/v2/ticker',
		symbolPriceUrlExtension: '/api/v2/ticker?pairSymbol=BTC_USDT'
	}
}
console.log(markets.btcturk);
var symbolShortList = ["BTCUSDT", "ETHUSDT", "XTZUSDT", "LTCUSDT", "ADAUSDT", "XLMUSDT"];

var myOrders = {};
/*
// Get Prices for my ShortList: Binance
console.log('market: binance');
for (var mySymbolIndex = 0; mySymbolIndex < symbolShortList.length; mySymbolIndex++){
	getSymbolPrice('binance', symbolShortList[mySymbolIndex]);
}*/

getSymbolList('btcturk');


// FUNCTIONS
function getSymbolList(marketName) {
	console.log('Getting symbol list from ' + marketName + ' network:');
	var acGetSymbolList = {
		method: 'get',
		url: markets[marketName].url + markets[marketName].symbolListUrlExtension
	};
	axios(acGetSymbolList)
		.then(function (response) {
			for (var symbolIndex = 0; symbolIndex < response.data.symbols.length; symbolIndex++){
				console.log(response.data.symbols[symbolIndex].symbol);
			}
		})
		.catch(function (error) {
			console.log('--> failed to get symbol list');
		});
}
function getSymbolPrice(marketName, symbolName) {
	var acGetSymbolPrice = {
		method: 'get',
		url: markets[marketName].url + markets[marketName].symbolPriceUrlExtension + symbolName
	};
	axios(acGetSymbolPrice)
		.then(function (response) {
			console.log( response.data.symbol + ': ' + response.data.price);
		})
		.catch(function (error) {
			console.log(error);
		});
}
function testConnection(marketName) {
	console.log('Testing ' + marketName + ' network  connection:');
	var acConTest = {
		method: 'get',
		url: markets[marketName].url + markets[marketName].testUrlExtension
	};
	axios(acConTest)
		.then(function (response) {
			console.log('-> Connection Test Succeeded!');
		})
		.catch(function (error) {
			console.log('-> Connection Test Failed!');
		});

}
