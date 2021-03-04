const axios = require('axios').default;
const crypto = require('crypto');
const appName = process.env.APP_NAME;
const dbRestUrl = process.env.DB_REST_URL;
const tradingCurrency = 'USDT';
const markets = require('./data/markets');


var symbolShortList = ['BTC', 'ETH', 'XTZ', 'LTC', 'ADA', 'XLM'];
var marketShortList = ['binance', 'btcturk'];


function getSymbolPrice(marketName, symbolName) {
	var acGetSymbolPrice = {
		method: 'get',
		url: markets[marketName].url + markets[marketName].symbolPriceUrlExtension + getpairName(symbolName, marketName)
	};
	axios(acGetSymbolPrice)
		.then(function (response) {
			var symbolData = {
				name: symbolName,
				market: marketName,
				price: 0,
				tradingCurrency: tradingCurrency
			};
			symbolData.price = normalizeMarket(symbolName, marketName);
			writeToDB(symbolData);
		})
		.catch(function (error) {
			console.log(error);
		});
}
function getpairName(symbolName, marketName) {
	return symbolName + markets[marketName].symbolFormat.pairSeperator + tradingCurrency;
}
function normalizeMarket(symbolName, marketName) {
	var symbolInfo;
	var symbolPrice = 0;
	if (markets[marketName].symbolFormat.pricePath != 'none') {
		symbolInfo = response.data[markets[marketName].symbolFormat.path];
	} else {
		symbolInfo = response.data;
	}

	if (Array.isArray(symbolInfo)) {
		symbolPrice = symbolInfo[0][markets[marketName].symbolFormat.symbolPricePropertyName];
	} else {
		symbolPrice = symbolInfo[markets[marketName].symbolFormat.symbolPricePropertyName];
	}

	return symbolPrice;
}
function writeToDB(symbolData){
	console.log(symbolData);
}