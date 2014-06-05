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
		streamline.subscribe("/chat/channel/"+req.params.channel,res); 
	});

	app.post('/streamline/:channel',function(req,res){
		var streamline = require("streamline"); 
		res.send({status:streamline.publish("/chat/channel/"+req.params.channel,req.rawBody,res)}); 
	});
*/
var redis = require("redis"), 
subscribe = redis.createClient(),
publish = redis.createClient(); 

module.exports.subscribe = function(masterchannel, response) {
	
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
		  response.write(message);;
		}
	});
    
};

module.exports.publish = function(channel, data, response) {
	publish.publish(channel,data); 
	return true
};

