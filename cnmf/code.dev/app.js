const axios = require('axios').default;
const crypto = require('crypto');
const coinNowDb = require('./modules/mongodb.util');
const appName = 'coinnow';
const tradingCurrency = 'USDT';
coinNowDb.init();

var markets = {
	binance: {
		url: 'https://api.binance.com',
		headerParams: [],
		testUrlExtension: '/api/v3/ping',
		symbolListUrlExtension: '/api/v3/exchangeInfo',
		symbolPriceUrlExtension: '/api/v3/ticker/price?symbol=',
		symbolFormat: {
			path: 'symbols',
			symbolPropertyName: 'symbol',
			pricePath: 'none',
			symbolPricePropertyName: 'price',
			pairSeperator: ''
		}
	},
	btcturk: {
		url: 'https://api.btcturk.com',
		headerParams: [
			{ name: 'X-PCK', value: '012e4da8-3e38-47d0-99ba-18f2f523f3e6' },
			{ name: 'X-Stamp', value: Math.floor(new Date().getTime() / 1000) },
			{ name: 'X-Signature', value: crypto.createHmac('SHA256', "gAgM7shFpPrgHVf2rvi80rrTZr0b3SR6").update('012e4da8-3e38-47d0-99ba-18f2f523f3e6' + Math.floor(new Date().getTime() / 1000)).digest('base64') }
		],
		testUrlExtension: 'none',
		symbolListUrlExtension: '/api/v2/ticker',
		symbolPriceUrlExtension: '/api/v2/ticker?pairSymbol=',
		symbolFormat: {
			path: 'data',
			symbolPropertyName: 'pair',
			pricePath: 'data',
			symbolPricePropertyName: 'average',
			pairSeperator: '_'
		}
	}
};
var symbolShortList = ['BTC', 'ETH', 'XTZ', 'LTC', 'ADA', 'XLM'];
var marketShortList = ['binance', 'btcturk'];
var arbitrageList = ['XTZ'];
// Get Prices for my ShortList
/*for (var mySymbolIndex = 0; mySymbolIndex < arbitrageList.length; mySymbolIndex++) {
	for (var myMarketIndex = 0; myMarketIndex < marketShortList.length; myMarketIndex++) {
		getSymbolPrice(marketShortList[myMarketIndex], arbitrageList[mySymbolIndex]);
	}
}*/

// BASIC FUNCTIONS
function checkArbitrage() {
	var myMarketIndex;
	var mySymbolIndex;
	for (mySymbolIndex = 0; mySymbolIndex < arbitrageList.length; mySymbolIndex++) {
		for (myMarketIndex = 0; myMarketIndex < marketShortList.length; myMarketIndex++) {
			getSymbolPrice(marketShortList[myMarketIndex], arbitrageList[mySymbolIndex])
		}
	}
}
// Check Arbitrage
setInterval(checkArbitrage, 1000);
function getSymbolList(marketName) {
	console.log('Getting symbol list from ' + marketName + ' network:');
	var acGetSymbolList = {
		method: 'get',
		url: markets[marketName].url + markets[marketName].symbolListUrlExtension
	};
	axios(acGetSymbolList)
		.then(function (response) {
			var symbolArray = [];
			var symbolNameArray = [];
			if (markets[marketName].symbolFormat.path != 'none') {
				symbolArray = response.data[markets[marketName].symbolFormat.path];
			} else {
				symbolArray = response.data;
			}
			for (var symbolIndex = 0; symbolIndex < symbolArray.length; symbolIndex++) {
				if (symbolArray[symbolIndex][markets[marketName].symbolFormat.symbolPropertyName].includes(tradingCurrency)) {
					symbolNameArray.push(symbolArray[symbolIndex][markets[marketName].symbolFormat.symbolPropertyName]);
				}
			}
			console.log(symbolNameArray);
		})
		.catch(function (error) {
			console.log('--> failed to get symbol list');
			console.log(error);
		});
}
function getSymbolPrice(marketName, symbolName) {
	var acGetSymbolPrice = {
		method: 'get',
		url: markets[marketName].url + markets[marketName].symbolPriceUrlExtension + getpairName(symbolName, marketName)
	};
	axios(acGetSymbolPrice)
		.then(function (response) {
			var symbolInfo;
			var symbolData = {
				coinName: symbolName,
				tradingCurrency: tradingCurrency
			};
			if (markets[marketName].symbolFormat.pricePath != 'none') {
				symbolInfo = response.data[markets[marketName].symbolFormat.path];
			} else {
				symbolInfo = response.data;
			}
			if (Array.isArray(symbolInfo)) {
				symbolData[marketName] = symbolInfo[0][markets[marketName].symbolFormat.symbolPricePropertyName];
			} else {
				symbolData[marketName] = symbolInfo[markets[marketName].symbolFormat.symbolPricePropertyName];
			}
			//	mongoUpdate(symbolData);
			console.log(symbolName + ' -> ' + marketName + ': ' + symbolData[marketName]);
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
function prepareHeader(marketName) {
	var headers = {};
	for (var headerIndex = 0; headerIndex < markets[marketName].headerParams.length; headerIndex++) {
		headers[markets[marketName].headerParams[headerIndex].name] = markets[marketName].headerParams[headerIndex].value;
	}
	return headers;
}
function getpairName(symbolName, marketName) {
	return symbolName + markets[marketName].symbolFormat.pairSeperator + tradingCurrency;
}
