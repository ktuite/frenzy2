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
/*
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
	"sessions": {},
    "acceptedItems": []
}

*/


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

app.get('/acceptedPapers.html', function(request, response){
	response.sendfile('view/acceptedPapers.html')
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
var queryFeedback = require('./controller/queryFeedback.js');

function clone(a) {
   return JSON.parse(JSON.stringify(a));
}

////////////////////////
// Instatiate Database
////////////////////////
//var instantiateData = require('./testing/cscwData.js');
var instantiateData = require('./testing/cscwDataAllcut1.js');
//var instantiateData = require('./testing/cscwData12labels.js');
//var instantiateData = require('./testing/cscwData12labelsAuthors.js');
//var instantiateData = require('./testing/cscwDataSubset.js');
//var instantiateData = require('./testing/data.js');

//var instantiateData = require('./testing/movies1.js');
//allData["acceptedPapers"] = ["movie0", "movie1", "movie2", "movie3", "movie4", "movie5", "movie6", ] //["cscw654","cscw615"]

//var instantiateData = require('./testing/movies1.js');
//allData["acceptedPapers"] = ["movie0", "movie1", "movie2", "movie3", "movie4", "movie5", "movie6"] //["cscw654","cscw615"]

//var instantiateAcceptedPapers = require('./testing/cscwAccepted100.js');
//var instantiateAcceptedPapers = require('./testing/cscwAccepted200.js');
//var instantiateAcceptedPapers = require('./testing/cscwAccepted500.js');

allData = clone(allDataOriginal)





       

/*
for( var i = 0; i< 250; i++){
    allData["acceptedPapers"].push("movie"+i)
} 
*/   
//allData["sessionIds"] = {} //{"email": "hmslydia@gmail.com"}


function updateAllDataForAcceptedPapers(listOfAcceptedPapers){
    
    
    allData["acceptedPapers"] = listOfAcceptedPapers
    
    //limit the items to just the ones in the listOfAcceptedPapers
    
    //console.log(Object.keys(allData["items"]).length)
    var items = allData["items"]
    for (var itemId in items){
        if( utils.arrayContains(allData["acceptedPapers"],itemId)){
            //keep it
        }else{
            delete allData["items"][itemId];
        }
    }
    //console.log(Object.keys(allData["items"]).length)
    
    //parse out items in allData["labelList"][label]["itemsUsedBy"]
    var labelObjs = allData["labelList"]
    for(var labelName in labelObjs){
        var itemsUsedBy = labelObjs[labelName]["itemsUsedBy"]
        //console.log(labelName)
        //console.log("a: "+itemsUsedBy.length)
        //console.log(itemsUsedBy)
        allData["labelList"][labelName]["itemsUsedBy"] = utils.arrayIntersection(itemsUsedBy, allData["acceptedPapers"])
        //console.log("b: "+allData["labelList"][labelName]["itemsUsedBy"].length)
        
        //console.log(allData["labelList"][labelName]["itemsUsedBy"])
        
        //console.log("")
    }
    
}
//updateAllDataForAcceptedPapers(acceptedPapers)
updateActionableFeedback()



//console.log(rankLabelsForTargetLabel("Workflow management"))

/////////////////////////////////
// Client Communication Handling
/////////////////////////////////
app.get('/login.html', function(request, response){
	response.sendfile('view/login.html')
});

app.post('/login.html', function(request, response){
    var command = request.body["command"]
	var args = JSON.parse(request.body["args"])
    
    if( command == "checkLogin"){
        res = {"hasEmail": "no"}

        if (request.session.logged){
            console.log('Welcome back: '+request.session.id)
            //check if there is already an email for this session id
            if (request.session.id in allData["sessionIds"]){
                res["hasEmail"] = "yes"
                var email = allData["sessionIds"][request.session.id]["email"]
                res["email"] = email
            }
        }else {
            request.session.logged = true;
            console.log('new session: '+request.session.id);            
        }
        response.send(JSON.stringify(res))
    }
    if(command == "signIn"){
        var email = args["email"]
        res = {"success": "no"}
        if( true ){
            allData["sessionIds"][request.session.id] = {"email":email}
            request.session.email = email
            
            res = {"success": "yes"}
            
        }
        response.send(JSON.stringify(res))
        
    }
});

app.post('/home.html', function(request, response){
    //if they are not logged in to a session, send them to /login

	var command = request.body["command"]
	var args = JSON.parse(request.body["args"])
	
    if( command == "checkLogin"){
        res = {"hasEmail": "no"}

        if (request.session.logged){
            console.log('Welcome back: '+request.session.id)
            //check if there is already an email for this session id
            if (request.session.id in allData["sessionIds"]){
                res["hasEmail"] = "yes"
                var email = allData["sessionIds"][request.session.id]["email"]
                res["email"] = email
            }
        }else {
            request.session.logged = true;
            console.log('new session: '+request.session.id);            
        }
        response.send(JSON.stringify(res))
    }else if(command == "update"){
		var message = JSON.parse(request.body["args"])
		var update = message["update"]
		var query = message["query"]
        var type = message["type"]
		
		if(update){
			update["user"] = request.session.user
		}
		
		var timeSinceLastUpdate = request.session.timeSinceLastUpdate //message["timeSinceLastUpdate"]
		
		//first handle update
		handleClientUpdateData(update)
		
		//then push all new updates to the client
		//var serverUpdates = getAllServerUpdatesSinceT(-1)//getAllServerUpdatesSinceT(timeSinceLastUpdate)
		var getServerData = getAllServerData(query, type)
		
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

app.post('/acceptedPapers.html', function(request, response){
	var command = request.body["command"]
	var args = JSON.parse(request.body["args"])
    
    if(command == "newItem"){
		var newItemId = args["newItemId"]
        allData["acceptedPapers"].push(newItemId)
        response.send(JSON.stringify(allData["acceptedPapers"]))        
	}else if(command == "getAcceptedPapers"){
		response.send(JSON.stringify(allData["acceptedPapers"])) 
	}else if(command == "editAcceptedPapers"){
        var papers = args["papers"]
        allData["acceptedPapers"] = papers
        
		response.send(JSON.stringify(allData["acceptedPapers"])) 
	}
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
        }else if(updateType == "addSessionToItemsInQuery"){
            handleAddSessionToItemsInQuery(update)
        }
        
        else if(updateType == "removeLabelFromItem"){
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

function getAllServerData(query, type){
    var rtn = {}
    
    rtn["type"] = type
    //types of updates:
    //1. items
    rtn["allItems"] = allData["items"]
    
    //2. hierarchy 
	rtn["hierarchy"] = allData["hierarchy"]	

    //2. hierarchy 
	rtn["sessions"] = allData["sessions"]
    
    //3. completion conditions
	rtn["completion"] = allData["completion"]	
	
	rtn["labelList"] = allData["labelList"]	
	
    //4. chat
    //5. userLocations
    //6. recently edited items
    //7. order of items
	rtn["itemIdOrder"] = getFeedItemsAndOrder(query)
    
    var numberOfResults = rtn["itemIdOrder"].length
	rtn["queryResultObj"] = getQueryResultObj(query, numberOfResults)
	//console.log("rtn")
    //console.log(rtn)

    return rtn
}




//////////////////////////////////////////
//// start serving
//////////////////////////////////////////

app.listen(3000);
console.log('Listening on port 3000');
//checkpoint.restoreData(1)