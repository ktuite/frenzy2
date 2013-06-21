//start server
var express = require('express');
fs = require('fs');
app = express();

app.use(express.cookieParser()); 
app.use(express.session({ secret: "keyboard cat" }))
app.use(express.bodyParser());

allData = {
    "items":{},
	"labelList": {},
    "users":{},

    "hashtagHierarchy":{},
    "completionData":{},

    "chat":[],
    "userLocations":[], 

    "history":{ 
        "locations":[], 
        "events":[]
    }
}


item0 = {
	"id": "item0",
    "html": "<b>item0</b>",
	"replies" : [],
	"replyCounter" : 0,
	"lastUpdateTime" : 12344555,
	"labels": {}
}
allData["items"]["item0"] = item0

item1 = {
	"id": "item1",
    "html": "<b>item1</b>",
	"replies" : [],
	"replyCounter" : 0,
	"lastUpdateTime" : 12344556,
	"labels": {}
}
allData["items"]["item1"] = item1

label1 = {
	"label" : "animal",
	"itemsUsedBy" : ["item0", "item1"],
	"user" : "hmslydia",
	"creationTime" : 123456789
}

label1Ref = {
	"label": "animal",
	"checked": true,
	"likes" : [],
	"dislikes" : [],
	"lastUpdateTime" : 123456789
}

label2Ref = {
	"label": "animal",
	"checked": true,
	"likes" : [],
	"dislikes" : [],
	"lastUpdateTime" : 123456789

}

label2 = {
	"label" : "snake",
	"itemsUsedBy" : ["item1"],
	"user" : "hmslydia",
	"creationTime" : 123456789
}
snakesRef = {
	"label": "snake",
	"checked": false,
	"likes" : [],
	"dislikes" : [],
	"lastUpdateTime" : 123456789

}

label3 = {
	"label" : "horse",
	"itemsUsedBy" : ["item0"],
	"user" : "hmslydia",
	"creationTime" : 123456789
}
horseRef = {
	"label": "horse",
	"checked": false,
	"likes" : [],
	"dislikes" : [],
	"lastUpdateTime" : 123456789

}

allData["items"]["item0"]["labels"]["animal"] = label1Ref
allData["items"]["item1"]["labels"]["animal"] = label2Ref
allData["items"]["item1"]["labels"]["snake"] = snakesRef
allData["items"]["item0"]["labels"]["horse"] = horseRef

allData["labelList"]["animal"] = label1
allData["labelList"]["snake"] = label2
allData["labelList"]["horse"] = label3





var utils = require('./controller/node-utils');
var checkpoint = require('./controller/checkpoint.js');
var testingFramework = require('./testing/urlTestingRequest.js');
var handleUpdatesFromClient = require('./controller/handleUpdatesFromClient.js');
var calculateCompletedItems = require('./controller/calculateCompletedItems.js');
var hierarchyHelpers = require('./controller/createHierarchy.js');
var filter = require('./controller/filter.js');

allData["hierarchy"] = createHierarchy()

//REPLIES
var reply1 = {"type": "replyToItem", "user" : "hmslydia", "time" : 1, "itemId" : "item0", "html" : "<b>my reply</b>", "parentId": ""}
var reply2 = {"type": "replyToItem", "user" : "hmslydia", "time" : 2, "itemId" : "item0", "html" : "<b>my reply 2</b>", "parentId": "item0-reply0"}
var reply3 = {"type": "replyToItem", "user" : "hmslydia", "time" : 2, "itemId" : "item1", "html" : "<b>my reply 2 1</b>", "parentId": ""}

handleReplyToItem(reply1)
handleReplyToItem(reply2)
handleReplyToItem(reply3)

//when the client shares an update, find out what type of data it contains
//and modify the data structure
//@return void
handleClientUpdateData = function(update){
	//get update type and respond accordingly
	update = JSON.parse(update) 
	var updateType = update["type"]

	if(updateType == "replyToItem"){
		handleReplyToItem(update)
	}else if(updateType == "addLabelToItem"){
		handleAddLabelToItem(update)
	}else if(updateType == "removeLabelFromItem"){
		handleRemoveLabelFromItem(update)
	}else if(updateType == "toggleLabelFromItem"){
		handleToggleLabelFromItem(update)
	}
}

//when the client requires an update, find out how much data to send them and send it
//@return update
respondToClientUpdateRequest = function(timeOfClientLastUpdate){
	console.log("index.js - respondToClientUpdateRequest")
	console.log("timeOfClientLastUpdate = " + timeOfClientLastUpdate)
	
}



app.get('/', function(request, response){
	response.send(allData)
});
/*
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
*/
//////////////////////////////////////////
//// start serving
//////////////////////////////////////////

app.listen(3000);
console.log('Listening on port 3000');
//checkpoint.restoreData(1)