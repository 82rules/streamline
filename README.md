# StreamLine
## Redis Sub/Pub Push Data - Stream Data Synching for Javascript 


###Quick Background
I needed data sync capabilities in the likes of firebase and other nosql services without
the additional data storage facilities. 

The goal was to create a fast message broadcast system that would be push to browser and not
polling or pinging for server status on interval. 

The solution came in utilizing redis im memory broadcast for subscription and publish services. 
By pairing that capability with a simple javascript data stream you can achieve a fast message
broadcast for data sync, chat, notifiers ect.. on your application. 

The usage is simple, simply subscribe to a channel via "/path/you/can/deterime" and then publish to the same channel. 
By pairing this with your application, you can create secure member only access to channels and token based channels.

## how to use
So far the installation is really based on how you'd like to use it. 
I've made the library to be integrated into a already existing application, however
you can set it up to be standalone. 
Install redis however you'd like
clone the repo, set up a server with docroot to the repo
You can use the .htaccess to modify which server you'd like to be resposible for handling responses. 

Then include the javascript contained in client into the client-side and 
use the .subscribe(channel,handling function) or .publish(channel, data, handling function) methods
to push data to different clients. 

I've included a index.html which assumes the application is loaded under http://localhost/streamline
to give it a try, load http://localhost/streamline/index.html into different browsers and change
the text of the input box (set to onblur event atm) 

Please feel free to contribute additional server listeners and javascript. 

I'm really happy with how this solution turned out. 
Questions, comments, just ask. 
