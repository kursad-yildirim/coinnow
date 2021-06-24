const axios = require('axios').default;
const appName = process.env.APP_NAME;
const appPort = process.env.APP_PORT;
const dbRestUrl = process.env.DB_REST_URL;
const tradingCurrency = 'USDT';
const markets = require('./data/markets');


var symbolShortList = ['BTC', 'ETH', 'XTZ', 'LTC', 'ADA', 'XLM'];
var marketShortList = ['binance', 'btcturk'];

console.log('>>>>>>>>>>>>>>>>>>>>>>');
console.log(markets);
console.log('>>>>>>>>>>>>>>>>>>>>>>');
allMarkets = markets.markets;
console.log('>>>>>>>>>>>>>>>>>>>>>>');
console.log(allMarkets);
console.log('>>>>>>>>>>>>>>>>>>>>>>');

getSymbolPrice('binance','BTC');


function getSymbolPrice(marketName, symbolName) {
  var acGetSymbolPrice = {
    method: 'get',
    url: allMarkets[marketName].url + allMarkets[marketName].symbolPriceUrlExtension + getpairName(symbolName, marketName)
  };
  axios(acGetSymbolPrice)
    .then(function (response) {
      var symbolData = {
        name: symbolName,
        market: marketName,
        price: 0,
        tradingCurrency: tradingCurrency
      };
      symbolData.price = normalizeMarket(symbolName, marketName, response.data);
      writeToDB(symbolData);
    })
    .catch(function (error) {
      console.log(error);
    });
}
function getpairName(symbolName, marketName) {
  return symbolName + allMarkets[marketName].symbolFormat.pairSeperator + tradingCurrency;
}
function normalizeMarket(symbolName, marketName, responseData) {
  var symbolInfo;
  var symbolPrice = 0;
  if (allMarkets[marketName].symbolFormat.pricePath != 'none') {
    symbolInfo = responseData[allMarkets[marketName].symbolFormat.path];
  } else {
    symbolInfo = responseData;
  }

  if (Array.isArray(symbolInfo)) {
    symbolPrice = symbolInfo[0][allMarkets[marketName].symbolFormat.symbolPricePropertyName];
  } else {
    symbolPrice = symbolInfo[allMarkets[marketName].symbolFormat.symbolPricePropertyName];
  }

  return symbolPrice;
}
function writeToDB(symbolData){
  console.log(symbolData);
}
