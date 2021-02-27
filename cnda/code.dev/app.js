const axios = require('axios').default;
const crypto = require('crypto');
const coinNowDb = require('./modules/mongodb.util');
const appName = 'coinnow';
const tradingCurrency = 'USDT';
coinNowDb.init();

// MONGO DB FUNCTIONS
function mongoFind(searchToken) {
	coinNowDb[appName].find(searchToken).then(success).catch(failure);
	function success(data) {
		if (data.length == 0) {
			console.log([{ name: 'Coin not found' }]);
		} else {
			console.log(data);
		}
	}
	function failure(error) {
		console.log([{ operationName: 'find', operationStatus: 'CoinNow-Error-101' }]);
	}
}
function mongoCreate(data) {
	coinNowDb[appName].create(data).then(success).catch(failure);
	function success(data) {
		console.log({ operationName: 'create', operationStatus: 'ok' });
	}
	function failure(error) {
		console.log({ operationName: 'create', operationStatus: 'CoinNow-Error-101' });
	}
}
function mongoUpdate(data) {
	coinNowDb[appName].findOneAndUpdate({ name: data.coinName }, data, { new: true, upsert: true }).then(success).catch(failure);
	function success(data) {
		console.log({ operationName: 'update', operationStatus: 'ok' });
	}
	function failure(error) {
		console.log({ operationName: 'update', operationStatus: 'CoinNow-Error-101' });
	}
}
function mongoDelete(data) {
	coinNowDb[appName].deleteMany(data).then(success).catch(failure);
	function success(data) {
		console.log({ operationName: 'delete', operationStatus: 'ok' });
	}
	function failure(error) {
		console.log({ operationName: 'delete', operationStatus: 'CoinNow-Error-101' });
	}
}

