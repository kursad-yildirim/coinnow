const axios = require('axios').default;
const appName = process.env.APP_NAME;
const appPort = process.env.APP_PORT;
const dbRestUrl = process.env.DB_REST_URL;
const tradingCurrency = 'USDT';
const markets = require('./data/markets').markets;


var symbolShortList = ['BTC', 'ETH', 'HNT'];
var homeCoefficient = {BTC: 6000, ETH:600, HNT: 24};

for (var symbolIndex = 0; symbolIndex < symbolShortList.length; symbolIndex++){
  getSymbolPrice('binance',symbolShortList[symbolIndex]);
}

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
      symbolData.price = normalizeMarket(symbolName, marketName, response.data);
      normalizeToHome(symbolData);
    })
    .catch(function (error) {
      console.log(error);
    });
}
function getpairName(symbolName, marketName) {
  return symbolName + markets[marketName].symbolFormat.pairSeperator + tradingCurrency;
}
function normalizeMarket(symbolName, marketName, responseData) {
  var symbolInfo;
  var symbolPrice = 0;
  if (markets[marketName].symbolFormat.pricePath != 'none') {
    symbolInfo = responseData[markets[marketName].symbolFormat.path];
  } else {
    symbolInfo = responseData;
  }

  if (Array.isArray(symbolInfo)) {
    symbolPrice = symbolInfo[0][markets[marketName].symbolFormat.symbolPricePropertyName];
  } else {
    symbolPrice = symbolInfo[markets[marketName].symbolFormat.symbolPricePropertyName];
  }

  return symbolPrice;
}
function normalizeToHome(symbolData){
  symbolData.price = Math.round( 100 * symbolData.price / homeCoefficient[symbolData.name] ) / 100;
  console.log(symbolData.name + '/TL = ' + symbolData.price );
}
