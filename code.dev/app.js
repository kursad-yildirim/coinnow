const axios = require('axios');

var markets = {
	binance: {
		url: 'https://api.binance.com',
		apiKeyName: 'binance-api-key',
		apiSecretName: 'binance-api-secret'
	}
}

function testConnection(marketName){

        var acConTest =  {
                method: 'get',
                url: markets[marketName].url
        };
	axios(acConTest)
		.then(function (response){
		        console.log(response);
		})
                .catch(function (error) {
                        console.log(error);
                });

}