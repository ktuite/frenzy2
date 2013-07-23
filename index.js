//start server
var express = require('express');
fs = require('fs');
app = express();

app.use(express.cookieParser()); 
app.use(express.session({ secret: "keyboard cat" }))
app.use(express.bodyParser());

var testing = true;
////////////////////////
// Data structure
////////////////////////

allData = {
    "items":{},
	"labelList": {},
    "users":{},

    "hierarchy":{},
    "hierarchyLastUpdated":-1,
	
    "completion":{},
	"completionLastUpdated":-1,

    "chat":[],
    "userLocations":[], 

    "history":{ 
        "locations":[], 
        "events":[]
    },
	"sessions": {}
}




////////////////////////
// Client side includes
////////////////////////
app.get('/home.html', function(request, response){
	if(testing){
		//set a session with a username that is random
		if (request.session.logged){
			console.log('Welcome back: '+request.session.id)
		}else {
			request.session.logged = true;
			console.log('new session: '+request.session.id);
			request.session.user = ""
			request.session.timeSinceLastUpdate = -1
		}
		request.session.lastUpdateTime = 0
	}
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
/*
app.get('/filter.js', function(request, response){
	response.sendfile('view/filter.js')
});
*/
app.get('/hierarchy.js', function(request, response){
	response.sendfile('view/hierarchy.js')
});

app.get('/completionFeedback.js', function(request, response){
	response.sendfile('view/completionFeedback.js')
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
var sessionsHelpers = require('./controller/sessions.js');
var tfidfHelpers = require('./controller/tfidf.js');
var filter = require('./controller/filter.js');
var actionableFeedback = require('./controller/actionableFeedback.js');


////////////////////////
// Instatiate Database
////////////////////////
//var instantiateData = require('./testing/cscwData.js');
var instantiateData = require('./testing/cscwData12labels.js');
//var instantiateData = require('./testing/cscwDataSubset.js');
//var instantiateData = require('./testing/data.js');
updateActionableFeedback()


//console.log(rankLabelsForTargetLabel("Workflow management"))

/////////////////////////////////
// Client Communication Handling
/////////////////////////////////
app.post('/home.html', function(request, response){
	var command = request.body["command"]
	var args = JSON.parse(request.body["args"])
	
	if(command == "update"){
		var message = JSON.parse(request.body["args"])
		var update = message["update"]
		var query = message["query"]
		
		if(update){
			update["user"] = request.session.user
		}
		
		var timeSinceLastUpdate = request.session.timeSinceLastUpdate //message["timeSinceLastUpdate"]
		
		//first handle update
		handleClientUpdateData(update)
		
		//then push all new updates to the client
		//var serverUpdates = getAllServerUpdatesSinceT(-1)//getAllServerUpdatesSinceT(timeSinceLastUpdate)
		var getServerData = getAllServerData(query)
		
		request.session.timeSinceLastUpdate = getTime()
		response.send(JSON.stringify(getServerData))
	}else if(command == "signIn"){
		var user = args["user"]
		request.session.user = user
		var rtn = {"user": request.session.user}
		
		response.send(JSON.stringify(rtn))
	}
	/*
	else if(command == "filter"){
		var memberItemIds = JSON.parse(request.body["args"])
		var memberItemObjs = getMemberItemObjsForIds(memberItemIds)
		response.send(JSON.stringify(memberItemObjs))
	}
	*/
});


//when the client shares an update, find out what type of data it contains
//and modify the data structure
//@return void
handleClientUpdateData = function(update){
	//get update type and respond accordingly
    if(update != null){
        //update = JSON.parse(update) 
        var updateType = update["type"]

        if(updateType == "replyToItem"){
            handleReplyToItem(update)
        }else if(updateType == "likeReply"){
            handleLikeReply(update)
        }else if(updateType == "unlikeReply"){
            handleUnlikeReply(update)
        }else if(updateType == "addLabelToItem"){
            handleAddLabelToItem(update)
        }else if(updateType == "addLabelToItemsInQuery"){
            handleAddLabelToItemsInQuery(update)
        }else if(updateType == "removeLabelFromItem"){
            handleRemoveLabelFromItem(update)
        }else if(updateType == "toggleLabelFromItem"){
            handleToggleLabelFromItem(update)
        }else if(updateType == "session"){
            handleSessionUpdate(update)
        }
    }
	
	updateActionableFeedback()
}

//when the client requires an update, find out how much data to send them and send it
//@return update
/*
respondToClientUpdateRequest = function(timeOfClientLastUpdate){
	console.log("index.js - respondToClientUpdateRequest")
	console.log("timeOfClientLastUpdate = " + timeOfClientLastUpdate)
	
}
*/

/*
function getAllServerUpdatesSinceT(t){
    var rtn = {}
    
    //types of updates:
    //1. items
    var updatedItems = getAllItemObjectsUpdatedSinceTimeT(t)
    if(updatedItems.length > 0){
        rtn["updatedItems"] = updatedItems
    }
    
    //2. hierarchy    
    if(allData["hierarchyLastUpdated"] >= t){
        rtn["hierarchy"] = allData["hierarchy"]
    }
    
    //3. completion conditions
    //4. chat
    //5. userLocations
    //6. recently edited items
    //7. order of items
	if(true){
		rtn["itemOrder"] = []
	}
    

    return rtn
}
*/

function getAllServerData(query){
    var rtn = {}
    
    //types of updates:
    //1. items
    rtn["allItems"] = allData["items"]
    
    //2. hierarchy 
	rtn["hierarchy"] = allData["hierarchy"]	

    //2. hierarchy 
	rtn["sessions"] = allData["sessions"]
    
    //3. completion conditions
	rtn["completion"] = allData["completion"]	
	
    //4. chat
    //5. userLocations
    //6. recently edited items
    //7. order of items
	rtn["itemIdOrder"] = getFeedItemsAndOrder(query)
    
    var numberOfResults = rtn["itemIdOrder"].length
	rtn["queryResultObj"] = getQueryResultObj(query, numberOfResults)
	console.log("rtn")
    console.log(rtn)

    return rtn
}

function getQueryResultObj(query, numResults){
    var rtn = {}
    rtn["query"] = query
    rtn["numResults"] = numResults
    
    return rtn
}



//////////////////////////////////////////
//// start serving
//////////////////////////////////////////

app.listen(3000);
console.log('Listening on port 3000');
//checkpoint.restoreData(1)