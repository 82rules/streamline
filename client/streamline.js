window['StreamLine'] = window['StreamLine'] ? window['StreamLine'] : {}; 
(function(StreamLine){

	StreamLine = StreamLine ? StreamLine : {}; 
	StreamLine.handlers = {}; 

	StreamLine.events = function(stream){
		console.log(stream); 
	}

	StreamLine.request = function() {
		return window.XMLHttpRequest ? new XMLHttpRequest()  : new XMLHttpRequest();
	}

	StreamLine.subscribe = function(channel, handle){
		
		console.log("subscribing to " + channel);

		var filterLoaded = ''; 

		setTimeout(function(){

			var xhr = StreamLine.request(); 

			xhr.open("GET", channel, true)

			xhr.onprogress = function () {
			  var command =  xhr.responseText.toString().replace(filterLoaded,'');
			  filterLoaded = xhr.responseText.toString(); 
			  handle(command);
			}

			xhr.onreadystatechange = function() {//Call a function when the state changes.
		    if(xhr.readyState == 4) {
		    	/// connection drop, reconnecting
		        StreamLine.subscribe(channel,handle);
		        filterLoaded = ''; 
		    }
		}

			xhr.send();

		},1000);


	}

	StreamLine.publish = function(channel,data, handle){
		
		var xhr = StreamLine.request(); 
		xhr.open("POST", channel, true)
		
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.setRequestHeader("Content-length", data.length);
		xhr.setRequestHeader("Connection", "close");

		xhr.onreadystatechange = function() {//Call a function when the state changes.
		    if(xhr.readyState == 4 && xhr.status == 200) {
		        handle(xhr.responseText);
		    }
		}

		xhr.send(data);
	}



})(window['StreamLine']); 