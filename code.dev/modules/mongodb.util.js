(function(){
	'use strict';
	const mongoose = require('mongoose');
	const databaseName = process.env.DB_NAME;
	const databasePort = process.env.DB_PORT;
    const databaseServer = process.env.DB_SVC_NAME + '.' + process.env.DB_NAMESPACE;
	const requiredFieldName = process.env.DB_REQUIRED;
      var databaseConfig = {
		server: databaseServer + ':' + databasePort,
		database: databaseName,
	}
	var Schema = mongoose.Schema;
	var connectionString = 'mongodb://' + databaseConfig.server + '/' + databaseConfig.database;
	function init(){
		var options = {
			useUnifiedTopology: true,
			useNewUrlParser: true
		}
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
	function terminate(){
		mongoose.disconnect(connectionString)
		.then(function(result){
			console.log("MongoDb disconnection successful. DB: " + connectionString);
		})
		.catch(function(error){
		   console.log(error.message);
		   console.log("Error occured while disconnecting to DB: " + connectionString);
		});
	  }
	var databaseSchema = new Schema({[requiredFieldName]: {type:String,required:true,unique:true},}, { strict: false });
	
	module.exports.init = init;
	module.exports.terminate = terminate;
	module.exports[databaseName] = mongoose.model(databaseName, databaseSchema);
})();
