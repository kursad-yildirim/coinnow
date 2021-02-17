const axios = require('axios');

var markets = {
	binance: {
		url: 'https://api.binance.com',
		apiKeyName: 'binance-api-key',
		apiSecretName: 'binance-api-secret'
	}
}

// testConnection('binance');
getSymbolList('binance',false);

// FUNCTIONS
function testConnection(marketName) {
	console.log('Testing ' + marketName + ' network  connection:');
	var acConTest = {
		method: 'get',
		url: markets[marketName].url + '/api/v3/ping'
	};
	axios(acConTest)
		.then(function (response) {
			console.log('-> Connection Test Succeeded!');
		})
		.catch(function (error) {
			console.log('-> Connection Test Failed!');
		});

}
function getSymbolList(marketName, verifyNetwork) {
	console.log('Getting symbol list from ' + marketName + ' network:');
	var acGetSymbolList = {
		method: 'get',
		url: markets[marketName].url + '/api/v3/exchangeInfo'
	};
	var acConTest = {
		method: 'get',
		url: markets[marketName].url + '/api/v3/ping'
	};
	if (verifyNetwork) {
		axios(acConTest)
			.then(function (response) {
				console.log('-> network connected');
				axios(acGetSymbolList)
					.then(function (response) {
						console.log(response.data.symbols);
					})
					.catch(function (error) {
						console.log('--> failed to get symbol list');
					});
			})
			.catch(function (error) {
				console.log('-> failed to connect to network');
			});
	} else {
		axios(acGetSymbolList)
			.then(function (response) {
				console.log(response.data.symbols);
			})
			.catch(function (error) {
				console.log('--> failed to get symbol list');
			});
	}
}