//start server
var express = require('express');
fs = require('fs');
app = express();

app.use(express.compress());
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
allData["deprecatedItems"] = {}
allData["sessionMaking"] = true

function updateAllDataForAcceptedPapers(listOfAcceptedPapers){    
    allData["acceptedPapers"] = listOfAcceptedPapers
    var removedItems = []
    //limit the items to just the ones in the listOfAcceptedPapers
    
    //DEPRICATE ITEMS 
    for (var itemId in allData["items"]){
        if(itemId in allData["items"]){
            if( utils.arrayContains(listOfAcceptedPapers,itemId)){
                //keep it
            }else{
                allData["deprecatedItems"][itemId] = clone(allData["items"][itemId])
                
                delete allData["items"][itemId]
                removedItems.push(itemId)
                
                //remove this itemId from all the LabelList[label]["itemsUsedBy"] that it appears in.
                var labelsForItem = allData["deprecatedItems"][itemId]["labels"]
                for(var labelText in labelsForItem){
                    var itemsUsedBy = allData["labelList"][labelText]["itemsUsedBy"]
                    
                    if(utils.arrayContains(itemsUsedBy, itemId)){
                        var indexOfItemId = itemsUsedBy.indexOf(itemId)
                        allData["labelList"][labelText]["itemsUsedBy"].splice(indexOfItemId,1)
                    }
                    
                }
                
            }
        }
    }
    
    //BRING ITEMS BACK TO LIFE
    var resussitatedItems = []
    var currentItems = Object.keys(allData["items"])
    var itemsToBeResussitated = utils.arrayMinus(listOfAcceptedPapers, currentItems)
    for(var i in itemsToBeResussitated){
        var itemId = itemsToBeResussitated[i]
        console.log("resussitate "+itemId)
        //check if it's in the deprecatedItems and recussitate it
        if(itemId in allData["deprecatedItems"]){
            
            var itemObj = clone( allData["deprecatedItems"][itemId] )
            allData["items"][itemId] = itemObj
            delete allData["deprecatedItems"][itemId];
            resussitatedItems.push(itemId)
            
            var labelsForItem = itemObj["labels"]
            for(var labelText in labelsForItem){
                var itemsUsedBy = allData["labelList"][labelText]["itemsUsedBy"]
                
                if(! utils.arrayContains(itemsUsedBy, itemId)){
                    allData["labelList"][labelText]["itemsUsedBy"].push(itemId)
                }
                
            }
        }
    }

    
    return {"removedItems":removedItems, "resussitatedItems":resussitatedItems}
}

function removePaper(itemId){
    if(itemId in allData["items"]){
        allData["deprecatedItems"][itemId] = clone(allData["items"][itemId])
        
        delete allData["items"][itemId]
        //removedItems.push(itemId)
        
        //remove this itemId from all the LabelList[label]["itemsUsedBy"] that it appears in.
        var labelsForItem = allData["deprecatedItems"][itemId]["labels"]
        for(var labelText in labelsForItem){
            var itemsUsedBy = allData["labelList"][labelText]["itemsUsedBy"]
            
            if(utils.arrayContains(itemsUsedBy, itemId)){
                var indexOfItemId = itemsUsedBy.indexOf(itemId)
                allData["labelList"][labelText]["itemsUsedBy"].splice(indexOfItemId,1)
            }
            
        }
            
        
        return true
    }
    return false

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
    
    if(command == "removeItem"){
		var badItemId = args["itemId"]
        console.log(badItemId)
        var numAcceptedPapersOld = Object.keys(allData["items"]).sort().length
        
        //allData["acceptedPapers"].push(newItemId)
        var removalSuccess = removePaper(badItemId)
        var acceptedPapers = Object.keys(allData["items"]).sort()
       
        var feedback = "Failure"
        if(removalSuccess){
            feedback = "Sucessfully removed "+badItemId+".\nThere were "+numAcceptedPapersOld+" papers. \nThere are now "+acceptedPapers.length+" papers"		
        }
        
        var ret = {}
        ret["acceptedPapers"] = acceptedPapers
        ret["feedback"] = feedback
		response.send(JSON.stringify(ret))       
	}else if(command == "getAcceptedPapers"){
    
        var acceptedPapers = Object.keys(allData["items"]).sort()
        var ret = {}
        ret["acceptedPapers"] = acceptedPapers
        ret["feedback"] = "Showing "+acceptedPapers.length+" papers"
		response.send(JSON.stringify(ret)) 
        
	}else if(command == "editAcceptedPapers"){
        var papers = args["papers"]
        var numAcceptedPapersOld = Object.keys(allData["items"]).sort().length
        
        var removalFeedback = updateAllDataForAcceptedPapers(papers)
        var removedItems = removalFeedback["removedItems"]
        var resussitatedItems = removalFeedback["resussitatedItems"]
        
        //console.log(papers.length)
        //allData["acceptedPapers"] = papers
        var acceptedPapers = Object.keys(allData["items"]).sort()
        var ret = {}
        ret["acceptedPapers"] = acceptedPapers
        ret["feedback"] = "Removed items "+ JSON.stringify(removedItems)+". \nResussitatedItems: "+JSON.stringify(resussitatedItems)+"\nThere were "+numAcceptedPapersOld+" papers. \nThere are now "+acceptedPapers.length+" papers"
		response.send(JSON.stringify(ret)) 
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
    
    rtn["sessionMaking"] = allData["sessionMaking"]	
    
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