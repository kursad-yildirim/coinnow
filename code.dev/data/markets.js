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

module.exports = {markets: markets};