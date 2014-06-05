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

var redis, subscribe, publish, settings; 
var jsonfile = require("jsonfile");

jsonfile.readFile(__dirname + '/../../config.json', function(err, obj) {
  	
  	settings=obj; 
  	redis = require("redis");
	subscribe = redis.createClient(settings.host,settings.port);
	publish = redis.createClient(settings.host,settings.port); 

});


module.exports.subscribe = function(masterchannel, response, handle) {
	
	response.setHeader('Connection', 'Transfer-Encoding');
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.setHeader('Transfer-Encoding', 'chunked');
    response.write("{'status':'subscribed'}");
	
	subscribe.subscribe(masterchannel);

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
    
};

module.exports.publish = function(channel, data, response) {
	publish.publish(channel,data); 
	return true
};


