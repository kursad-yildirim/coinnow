const axios = require('axios').default;
const databaseName = process.env.DB_NAME;
const tradingCurrency = 'USDT';
const requiredFieldName = process.env.DB_REQUIRED;
const targetDB = require('./modules/mongodb.util');
const redisCache = require('./modules/redis.util');
const markets = require('./data/markets').markets;
targetDB.init();
const redisClient = redisCache.createClient();
redisClient.on('error', err => {
  console.log('Error ' + err);
});

var symbolShortList = ['BTC', 'ETH', 'HNT'];

for (var symbolIndex = 0; symbolIndex < symbolShortList.length; symbolIndex++){
  getSymbolPrice('binance', symbolShortList[symbolIndex], symbolIndex);
}

function getSymbolPrice(marketName, symbolName, symbolIndex) {
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
        tradingCurrency: tradingCurrency,
        coinPriceTime: Date.now()
      };
      symbolData.price = normalizeMarket(symbolName, marketName, response.data);
      updateCurrentPrice(symbolData);
      storeData(symbolData, symbolIndex);
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
function storeData(symbolData, symbolIndex){
  targetDB[databaseName].create(symbolData).then(success).catch(failure);
  function success(data){
    console.log({operationName: 'create', operationStatus: 'ok'});
    if ( symbolIndex == ( symbolShortList.length - 1 ) )
      targetDB.terminate();
  }
  function failure(error){
    console.log(error);
  }
}
function updateCurrentPrice(symbolData){
  symbolData.coinPriceTime = 'latest_' + symbolData.name;
  targetDB[databaseName].findOneAndUpdate({[requiredFieldName]: symbolData.coinPriceTime }, symbolData,{new: true, upsert:true}).then(success).catch(failure);
  function success(data){
    console.log({operationName: 'create', operationStatus: 'ok'});
  }
  function failure(error){
    console.log(error);
  }

  redisClient.set('foo', 'bar', (err, reply) => {
    if (err) throw err;
    console.log(reply);

    redisClient.get('foo', (err, reply) => {
        if (err) throw err;
        console.log(reply);
    });
});



}