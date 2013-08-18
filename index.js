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

app.get('/log', function(request, response){
	response.send(log)
});

app.get('/styles.css', function(request, response){
	response.sendfile('view/styles.css')
});

app.get('/utils.js', function(request, response){
	response.sendfile('view/utils.js')
});

app.get('/bootstrap.min.js', function(request, response){
    response.sendfile('view/refs/bootstrap/js/bootstrap.min.js')
});

////

app.get('/jquery-1.10.2.min.js', function(request, response){
    response.sendfile('view/refs/jquery/jquery-1.10.2.min.js')
});

app.get('/jquery-ui.min.js', function(request, response){
    response.sendfile('view/refs/jquery/jquery-ui-1.10.3/ui/minified/jquery-ui.min.js')
});

app.get('/jquery-ui.css', function(request, response){
    response.sendfile('view/refs/jquery/jquery-ui-1.10.3/themes/smoothness/jquery-ui.css')
});

app.get('/bootstrap.css', function(request, response){
    response.sendfile('view/refs/bootstrap/css/bootstrap.min.css')
});

app.get('/bootstrap-responsive.css', function(request, response){
    response.sendfile('view/refs/bootstrap/css/bootstrap-responsive.min.css')
});

app.get('/images/ui-bg_flat_75_ffffff_40x100.png', function(request, response){
    response.sendfile('view/refs/jquery/jquery-ui-1.10.3/themes/base/images/ui-bg_flat_75_ffffff_40x100.png')
});

app.get('/spring.jpg', function(request, response){
    response.sendfile('view/spring.jpg')
});

app.get('/pencil.png', function(request, response){
    response.sendfile('view/pencil.png')
});

////

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

app.get('/hyperbar.js', function(request, response){
	response.sendfile('view/hyperbar.js')
});

////////////////////////
// Server side includes
////////////////////////
var utils = require('./controller/node-utils');
var checkpoint = require('./controller/checkpoint.js');
var testingFramework = require('./testing/urlTestingRequest.js');
var handleUpdatesFromClient = require('./controller/handleUpdatesFromClient.js');
var calculateCompletedItems = require('./controller/calculateCompletedItems.js');
var renameCache = require('./controller/renameCache.js');
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
//var instantiateData = require('./testing/cscwDataAllcut1.js');
var instantiateData = require('./testing/cscwDataAllcut1withextra.js');
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
allData["sessionMaking"] = false //true
allData["categories"] = {}
allData["sessionIds"] = {}

var log = []
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

var accepted98 = [
"cscw100","cscw147","cscw210","cscw223","cscw240","cscw244","cscw248","cscw277","cscw285","cscw295","cscw299","cscw305","cscw348","cscw355","cscw358","cscw387","cscw389","cscw390","cscw395","cscw411","cscw432","cscw471","cscw499","cscw517","cscw530","cscw550","cscw558","cscw566","cscw576","cscw579","cscw609","cscw624","cscw647","cscw668","tochi100","cscw204","cscw317","cscw252","cscw588","cscw130","cscw221","cscw227","cscw234","cscw356","cscw391","cscw241","cscw440","cscw482","cscw526","cscw527","cscw542","cscw559","cscw584","cscw590","cscw608","cscw290","cscw625","cscw602","cscw648","cscw145","cscw178","cscw188","cscw209","cscw243","cscw293","cscw315","cscw254","cscw354","cscw399","cscw253","cscw413","cscw431","cscw228","cscw493","cscw492","cscw369","cscw191","cscw310","cscw494","cscw599","cscw637","cscw663","cscw108","cscw161","cscw222","cscw274","cscw302","cscw211","cscw339","cscw443","cscw119","cscw487","cscw486","cscw597","cscw622","cscw233","cscw409","cscw535"
]
updateAllDataForAcceptedPapers(accepted98)
updateActionableFeedback()

/////////////////////////////////
// Client Communication Handling
/////////////////////////////////
app.get('/login.html', function(request, response){
	response.sendfile('view/login.html')
});

app.post('/login.html', function(request, response){
    var command = request.body["command"]
	var args = JSON.parse(request.body["args"])
    log.push({
        "page": "login",
        "command": command,
        "args": args
    })
    
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
		
		if(update || type == "synchronous"){
			//update["user"] = request.session.user
            log.push({
                "page": "home",
                "command": command,
                "args": args
            })
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
        log.push({
            "page": "home",
            "command": command,
            "args": args
        })
    
		var user = args["user"]
        request.session.user = user
        console.log("signed in as user " + user)
        var rtn = {"user": request.session.user}
		
		response.send(JSON.stringify(rtn))
	}
});

app.post('/acceptedPapers.html', function(request, response){
	var command = request.body["command"]
	var args = JSON.parse(request.body["args"])
    
    if(command == "removeItem"){
		var badItemId = args["itemId"]
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
        }else if(updateType == "toggleLabelLiked"){
            handleToggleLabelLiked(update)
        }else if(updateType == "renameSession"){
            handleRenameSession(update)
        }else if(updateType == "renameLabel"){
            handleRenameLabel(update)
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
	//rtn["hierarchy"] = allData["hierarchy"]	
    rtn["categories"] = allData["categories"]
    
    //2. hierarchy 
	rtn["sessions"] = allData["sessions"]
    
    //3. completion conditions
	rtn["completion"] = allData["completion"]	
	
	rtn["labelList"] = allData["labelList"]	
	
    //4. chat
    //5. userLocations
    //6. recently edited items
    //7. order of items
    //WORK HERE (extraQueryParameters is temporary.  Find a better place to put it.)
    query["extraQueryParameters"] = "initialize"
    
    var itemIdOrder = getFeedItemsAndOrder(query)
	rtn["itemIdOrder"] = itemIdOrder
    
    rtn["sessionMaking"] = allData["sessionMaking"]	
    
    
	rtn["queryResultObj"] = getQueryResultObj(query, itemIdOrder)
	//console.log("rtn")
    //console.log(rtn)

    return rtn
}

//testing queryFeedbackObj


app.get('/test', function(request, response){
    var label = "Entertainment/games"
    var query = {
        "type" : "label",
        "label" : label,
        "labels": [label],
        "checked" : true,            
        "sortOrder" : "creationTime"
    }
    query["extraQueryParameters"] = "initialize"
    var itemIdOrder = getFeedItemsAndOrder(query)
    console.log(itemIdOrder)

    var queryResultObj = getQueryResultObj(query, itemIdOrder)
    //console.log(queryResultObj)
	//response.send(JSON.stringify(queryResultObj))
    response.send(queryResultObj)
});

//////////////////////////////////////////
//// start serving
//////////////////////////////////////////

app.listen(3000);
console.log('Listening on port 3000');
//checkpoint.restoreData(1)