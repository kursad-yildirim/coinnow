var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var router = express.Router();

const axios = require('axios');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use('/api', router);
router.route('/record-enemy').post(function(req, res, next){
	res.json([{tripkoStatus: 'page data received'}]);
//	updateEnemy(req.body);
});

function updateEnemy(reqBody){

        var acGetEnemy =  {
                method: 'post',
                url: 'http://tripko-read-db-record-service:12380/api/read',
                data: {
                        operation: 'enemyStats',
                        data: {name: reqBody.data.name},
			columnSelect: []
                }
        };
	axios(acGetEnemy)
		.then(function (response){
		        var enemy = {};
		        var enemyAttributes = Object.keys(reqBody.data);
		        for (var attrIndex = 0; attrIndex < enemyAttributes.length; attrIndex++){
		                if (reqBody.data[enemyAttributes[attrIndex]].value != -999){
					enemy[enemyAttributes[attrIndex]] = reqBody.data[enemyAttributes[attrIndex]];	
		                } else {
					if (response.data[0].hasOwnProperty(enemyAttributes[attrIndex])){
						enemy[enemyAttributes[attrIndex]] = response.data[0][enemyAttributes[attrIndex]];
					} else {
						enemy[enemyAttributes[attrIndex]] = reqBody.data[enemyAttributes[attrIndex]];
					}
				}
		        }
			var acRecordEnemy =  {
                		method: 'post',
                		url: 'http://tripko-update-db-record-service:12380/api/update',
                		data: {
                        		operation: 'enemyStats',
                        		data: enemy
                		}
        		};
        		axios(acRecordEnemy)
                		.catch(function (error) {
                        		console.log(error);
                		});
		})
                .catch(function (error) {
                        console.log(error);
                });

}

var port = 52380;
var server = app.listen(port, function (){
	console.log('Server running at port:' + port + '/');
});
