// app/streamline.js

// sample express routes
/*
	app.get('/streamline/',function(req,res){
		fs = require('fs');
		fs.readFile('./node_modules/streamline/client/streamline.js', 'utf8', function (err,data) {
		  if (err) {
		    return console.log(err);
		  }
		  res.send(data);
		});
	});

	app.get('/streamline/:channel',function(req,res){
		var streamline = require("streamline"); 
		streamline.subscribe("/chat/channel/"+req.params.channel,res, function(message){
			console.log(message)
			res.write(message);
		}); 
	});

	app.post('/streamline/:channel',function(req,res){
		var streamline = require("streamline"); 
		res.send({status:streamline.publish("/chat/channel/"+req.params.channel,req.rawBody,res)}); 
	});
*/

var redis = require("redis"), subscribe, publish, settings; 
var fs = require("fs"); 
var settings = JSON.parse(fs.readFileSync(__dirname + '/../../config.json').toString());

subscribe = redis.createClient(settings.port, settings.host);
publish = redis.createClient(settings.port, settings.host); 

module.exports.subscribe = function(masterchannel, response, handle) {
	
	response.setHeader('Connection', 'Transfer-Encoding');
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.setHeader('Transfer-Encoding', 'chunked');


	subscribe.subscribe(masterchannel);

	response.write("{'status':'subscribed'}");

   	subscribe.on("error", function(){
	  response.send("{'status':'disconnected'}");
	})

	subscribe.on("message", function(channel, message){
		if (channel == masterchannel) {
			if (handle) {
				handle(message);
			}
		  	else {
		  		response.write(message);;
		  	}
		}

	});

}

module.exports.publish = function(channel, data, response) {

	publish.publish(channel,data); 
	return true; 
}




