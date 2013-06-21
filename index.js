//start server
var express = require('express');
fs = require('fs');
app = express();

app.use(express.cookieParser()); 
app.use(express.session({ secret: "keyboard cat" }))
app.use(express.bodyParser());

////////////////////////
// Data structure
////////////////////////
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

////////////////////////
// Client side includes
////////////////////////
app.get('/home.html', function(request, response){
	response.sendfile('view/home.html')
});

app.get('/', function(request, response){
	response.send(allData)
});

app.get('/styles.css', function(request, response){
	response.sendfile('view/styles.css')
});

app.get('/utils.js', function(request, response){
	response.sendfile('view/utils.js')
});

app.get('/updates.js', function(request, response){
	response.sendfile('view/updates.js')
});

app.get('/feed.js', function(request, response){
	response.sendfile('view/feed.js')
});


////////////////////////
// Server side includes
////////////////////////
var utils = require('./controller/node-utils');
var checkpoint = require('./controller/checkpoint.js');
var testingFramework = require('./testing/urlTestingRequest.js');
var handleUpdatesFromClient = require('./controller/handleUpdatesFromClient.js');
var calculateCompletedItems = require('./controller/calculateCompletedItems.js');
var hierarchyHelpers = require('./controller/createHierarchy.js');
var filter = require('./controller/filter.js');



////////////////////////
// Instatiate Database
////////////////////////
var instantiateData = require('./testing/data.js');
allData["hierarchy"] = createHierarchy()

//REPLIES
var reply1 = {"type": "replyToItem", "user" : "hmslydia", "time" : 1, "itemId" : "item0", "html" : "<b>my reply</b>", "parentId": ""}
var reply2 = {"type": "replyToItem", "user" : "hmslydia", "time" : 2, "itemId" : "item0", "html" : "<b>my reply 2</b>", "parentId": "item0-reply0"}
var reply3 = {"type": "replyToItem", "user" : "hmslydia", "time" : 2, "itemId" : "item1", "html" : "<b>my reply 2 1</b>", "parentId": ""}



/////////////////////////////////
// Client Communication Handling
/////////////////////////////////
app.post('/home.html', function(request, response){
    var message = JSON.parse(request.body["args"])
	var update = message["update"]
    var timeSinceLastUpdate = message["timeSinceLastUpdate"]
    
    //first handle update
    handleClientUpdateData(update)
    
    //then push all new updates to the client
    var serverUpdates = getAllServerUpdatesSinceT(timeSinceLastUpdate)
    //console.log(serverUpdates)
    response.send(JSON.stringify(serverUpdates))
});


//when the client shares an update, find out what type of data it contains
//and modify the data structure
//@return void
handleClientUpdateData = function(update){
	//get update type and respond accordingly
    if(update != null){
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
}

//when the client requires an update, find out how much data to send them and send it
//@return update
/*
respondToClientUpdateRequest = function(timeOfClientLastUpdate){
	console.log("index.js - respondToClientUpdateRequest")
	console.log("timeOfClientLastUpdate = " + timeOfClientLastUpdate)
	
}
*/
function getAllServerUpdatesSinceT(t){
    //types of updates:
    //1. items
    var updatedItems = getAllItemObjectsUpdatedSinceTimeT(t)
    
    //2. hierarchy    
    //3. completion conditions
    //4. chat
    //5. userLocations
    //6. recently edited items
    //7. order of items
    
    var rtn = {
        "updatedItems": updatedItems
    
    
    }
    return rtn
}







//////////////////////////////////////////
//// start serving
//////////////////////////////////////////

app.listen(3000);
console.log('Listening on port 3000');
//checkpoint.restoreData(1)