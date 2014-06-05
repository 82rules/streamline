// app/subscribe.js

// sample express routes
/*
	app.get('/streamline/:channel',function(req,res){
		var subscribe = require("./streamline.js"); 
		subscribe.subscribe("/chat/channel/"+req.params.channel,res); 
	});

	app.post('/streamline/:channel',function(req,res){
		var streamline = require("./streamline.js"); 
		streamline.publish("/chat/channel/"+req.params.channel,req.rawBody,res); 
	});
*/
var redis = require("redis"), 
subscribe = redis.createClient(),
publish = redis.createClient(); 

module.exports.subscribe = function(channel, response) {
	
	response.setHeader('Connection', 'Transfer-Encoding');
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.setHeader('Transfer-Encoding', 'chunked');
    response.write("{'status':'subscribed'}");

   	subscribe.on("error", function(){
	  response.send("{'status':'disconnected'}");
	})
	subscribe.on("message", function(channel, message){
	  response.write(message);;
	});
	subscribe.subscribe(channel);
    
};

module.exports.publish = function(channel, data, response) {
	publish.publish(channel,data); 
	return true
};

