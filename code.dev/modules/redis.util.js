(function(){
	'use strict';
	const redis = require('redis');
	const fs = require('fs');
	const redisPort = process.env.REDIS_PORT;
    const redisHost = process.env.REDIS_SVC_NAME + '.' + process.env.REDIS_NAMESPACE;
    var redisConfig = {
		host: redisHost,
		port: redisPort
	}
	function createClient(){
		return client = redis.createClient({redisConfig});
	}
	
	module.exports.createClient = createClient;
//	module.exports[databaseName] = mongoose.model(databaseName, databaseSchema);
})();
