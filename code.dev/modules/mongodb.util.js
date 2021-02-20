(function(){
	'use strict';
	var mongoose = require('mongoose');
    var mongoDbServer = process.env.COINNOW_DB_IP;
    var appName = 'coinnow';
	var coinNowDBConfig = {
		"server": mongoDbServer + ":27017",
		"database": appName + '_db',
	}
	var Schema = mongoose.Schema;
	function init(){
		var options = {
            useNewUrlParser: true,
            useUnifiedTopology: true}
		}
		var connectionString = 'mongodb://' + coinNowDBConfig.server + '/' + coinNowDBConfig.database;
		mongoose.connect(connectionString,options)
			.then(function(result){
				console.log("MongoDb connection successful. DB: " + connectionString);
			})
			.catch(function(error){
				console.log(error.message);
				console.log("Error occured while connecting to DB: " + connectionString);
			});
		mongoose.set('useCreateIndex', true);
	}
        var moduleSchema = new Schema({name: {type:String,required:true,unique:true},}, { strict: false });
	
	module.exports.init = init;
	module.exports[appName] = mongoose.model(appName, moduleSchema);
})();
