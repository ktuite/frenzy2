//start server
var express = require('express');
var fs = require('fs');
var app = express();

app.use(express.cookieParser()); 
app.use(express.session({ secret: "keyboard cat" }))
app.use(express.bodyParser());

var allData = {
    "items":{},
    "replies":{},
    "users":{},

    "hashtagHierarchy":{},
    "completionData":{},

    "chat":[],
    "currentLocations":[], 

    "history":{ 
        "locations":[], 
        "events":[]
    }
}

var utils = require('./controller/node-utils');
//var Checkpoint = require('./controller/checkpoint'), cp = new Checkpoint(app, utils, fs, allData);
//console.log(cp.asdf())

var Checkpointer = require('./controller/checkpoint.js');
var checkpoint = new Checkpointer(app, utils, fs, allData);
console.log(checkpoint.asdf([2,3,12])); // Ozzy is 62 years old

/*
var counting = require('./controller/checkpoint')
console.log(counting.getCount()); // 1
counting.increment();
console.log(counting.getCount()); // 2
*/


/*


*/

// handle uncaught exceptions to keep Node from crashing
/*
process.on('uncaughtException', function(err) {
  console.log(err);
  console.log(err.stack);
  // TODO: send email about the exception
});
*/

app.get('/home.html', function(request, response){
	if (request.session.logged){
		console.log('Welcome back: '+request.session.id)
    }else {
        request.session.logged = true;
        console.log('new session: '+request.session.id);
    }
	request.session.lastUpdateTime = 0
    response.sendfile('home.html')
});

//////////////////////////////////////////
//// start serving
//////////////////////////////////////////

app.listen(3000);
console.log('Listening on port 3000');
//checkpoint.restoreData(1)