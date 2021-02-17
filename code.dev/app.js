const axios = require('axios');

var markets = {
	binance: {
		url: 'https://api.binance.com',
		apiKeyName: 'binance-api-key',
		apiSecretName: 'binance-api-secret'
	}
}

if ( testConnection('binance') ){
	console.log('.... Connected to Binance Network!');
	getSymbolList('binance');
}

// FUNCTIONS
function testConnection(marketName){
    var acConTest =  {
        method: 'get',
		url: markets[marketName].url + '/api/v3/ping'
    };
	axios(acConTest)
		.then(function (response){
		    if (response.status == '200'){
				return 1;
			}
		})
		.catch(function (error) {
			return 0;
		});

}
function getSymbolList (marketName){
	var acGetSymbolList = {
		method: 'get',
		url: markets[marketName].url + '/api/v3/exchangeInfo'
	};
	axios(acGetSymblList)
		.then (function(response){
			console.log(response.data.symbols);
		})
		.catch(function(error){
			console.log(error);
		});
}