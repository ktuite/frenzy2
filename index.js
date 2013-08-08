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

////////////////////////
// Instatiate Database
////////////////////////
//var instantiateData = require('./testing/cscwData.js');
//var instantiateData = require('./testing/cscwDataAll.js');
//var instantiateData = require('./testing/cscwData12labels.js');
//var instantiateData = require('./testing/cscwData12labelsAuthors.js');
//var instantiateData = require('./testing/cscwDataSubset.js');
//var instantiateData = require('./testing/data.js');
var instantiateData = require('./testing/movies1.js');
//allData["acceptedPapers"] = ["movie0", "movie1", "movie2", "movie3", "movie4", "movie5", "movie6"] //["cscw654","cscw615"]

allData["acceptedPapers"] = [
      "cscw619",
      "cscw533",
      "cscw532",
      "cscw438",
      "cscw530",
      "cscw537",
      "cscw536",
      "cscw535",
      "cscw534",
      "cscw432",
      "cscw433",
      "cscw430",
      "cscw431",
      "cscw436",
      "cscw437",
      "cscw434",
      "cscw435",
      "cscw661",
      "cscw326",
      "cscw327",
      "cscw324",
      "cscw325",
      "cscw289",
      "cscw288",
      "cscw320",
      "cscw321",
      "cscw285",
      "cscw284",
      "cscw287",
      "cscw286",
      "cscw281",
      "cscw280",
      "cscw328",
      "cscw329",
      "cscw449",
      "cscw448",
      "cscw447",
      "cscw446",
      "cscw443",
      "cscw442",
      "cscw441",
      "cscw440",
      "cscw267",
      "cscw266",
      "cscw265",
      "cscw264",
      "cscw262",
      "cscw261",
      "cscw260",
      "cscw106",
      "cscw105",
      "cscw103",
      "cscw269",
      "cscw268",
      "cscw199",
      "cscw198",
      "cscw210",
      "cscw211",
      "cscw216",
      "cscw217",
      "cscw214",
      "cscw215",
      "cscw191",
      "cscw190",
      "cscw218",
      "cscw219",
      "cscw194",
      "cscw197",
      "cscw196",
      "cscw626",
      "cscw351",
      "cscw290",
      "cscw498",
      "cscw499",
      "cscw490",
      "cscw491",
      "cscw492",
      "cscw493",
      "cscw494",
      "cscw495",
      "cscw496",
      "cscw497",
      "cscw403",
      "cscw402",
      "cscw401",
      "cscw369",
      "cscw407",
      "cscw406",
      "cscw405",
      "cscw404",
      "cscw362",
      "cscw363",
      "cscw409",
      "cscw361",
      "cscw366",
      "cscw367",
      "cscw364",
      "cscw365",
      "cscw568",
      "cscw569",
      "cscw391" /* 100 items */
      ,
      "cscw564",
      "cscw565",
      "cscw566",
      "cscw567",
      "cscw560",
      "cscw561",
      "cscw590",
      "cscw384",
      "cscw386",
      "cscw228",
      "cscw380",
      "cscw381",
      "cscw382",
      "cscw383",
      "cscw223",
      "cscw222",
      "cscw221",
      "cscw220",
      "cscw388",
      "cscw368",
      "cscw225",
      "cscw224",
      "cscw599",
      "cscw598",
      "cscw458",
      "cscw317",
      "cscw316",
      "cscw315",
      "cscw314",
      "cscw313",
      "cscw360",
      "cscw310",
      "cscw137",
      "cscw136",
      "cscw135",
      "cscw408",
      "cscw132",
      "cscw131",
      "cscw130",
      "cscw139",
      "cscw138",
      "cscw178",
      "cscw142",
      "cscw635",
      "cscw140",
      "cscw637",
      "cscw630",
      "cscw147",
      "cscw144",
      "cscw145",
      "cscw148",
      "cscw149",
      "cscw177",
      "cscw531",
      "cscw176",
      "cscw168",
      "cscw563",
      "cscw539",
      "cscw538",
      "cscw229",
      "cscw387",
      "cscw520",
      "cscw521",
      "cscw522",
      "cscw525",
      "cscw526",
      "cscw527",
      "cscw528",
      "cscw227",
      "cscw389",
      "cscw143",
      "cscw353",
      "cscw352",
      "cscw298",
      "cscw299",
      "cscw357",
      "cscw356",
      "cscw355",
      "cscw354",
      "cscw292",
      "cscw293",
      "cscw359",
      "cscw358",
      "cscw296",
      "cscw297",
      "cscw295",
      "cscw595",
      "cscw594",
      "cscw597",
      "cscw596",
      "cscw591",
      "cscw459",
      "cscw593",
      "cscw592",
      "cscw455",
      "cscw456",
      "cscw450",
      "cscw451",
      "cscw453",
      "cscw274"
      /*,
      "cscw275",
      "cscw277",
      "cscw270",
      "cscw271",
      "cscw272",
      "cscw273",
      "cscw172",
      "cscw171",
      "cscw170",
      "cscw278",
      "cscw279",
      "cscw175",
      "cscw141",
      "cscw186",
      "cscw187",
      "cscw184",
      "cscw185",
      "cscw182",
      "cscw183",
      "cscw180",
      "cscw181",
      "cscw188",
      "cscw189",
      "cscw673",
      "cscw674",
      "cscw612",
      "cscw322",
      "cscw323",
      "cscw410",
      "cscw411",
      "cscw413",
      "cscw414",
      "cscw416",
      "cscw417",
      "cscw418",
      "cscw419",
      "cscw559",
      "cscw558",
      "cscw551",
      "cscw550",
      "cscw553",
      "cscw552",
      "cscw555",
      "cscw554",
      "cscw557",
      "cscw556",
      "cscw238",
      "cscw239",
      "cscw230",
      "cscw231",
      "cscw232",
      "cscw233",
      "cscw234",
      "cscw237",
      "cscw283",
      "cscw282",
      "cscw308",
      "cscw309",
      "cscw304",
      "cscw305",
      "cscw306",
      "cscw307",
      "cscw301",
      "cscw302",
      "cscw126",
      "cscw127",
      "cscw120",
      "cscw121",
      "cscw122",
      "cscw123",
      "cscw128",
      "cscw379",
      "cscw378",
      "cscw601",
      "cscw600",
      "cscw603",
      "cscw602",
      "cscw605",
      "cscw607",
      "cscw606",
      "cscw609",
      "cscw608",
      "cscw373",
      "cscw109",
      "cscw542",
      "cscw101",
      "cscw428",
      "cscw519",
      "cscw518",
      "cscw514",
      "cscw517",
      "cscw516",
      "cscw511",
      "cscw510",
      "cscw513",
      "cscw512",
      "cscw340",
      "cscw341",
      "cscw342",
      "cscw343",
      "cscw344",
      "cscw345",
      "cscw346",
      "cscw347",
      "cscw348",
      "cscw349",
      "cscw390",
      "cscw636",
      "cscw469",
      "cscw583",
      "cscw580",
      "cscw581",
      "cscw586",
      "cscw587",
      "cscw584",
      "cscw585",
      "cscw461",
      "cscw460",
      "cscw463",
      "cscw589",
      "cscw465",
      "cscw464",
      "cscw467",
      "cscw631",
      "cscw241",
      "cscw240",
      "cscw243",
      "cscw242",
      "cscw245",
      "cscw244",
      "cscw247",
      "cscw246",
      "cscw249",
      "cscw161",
      "cscw162",
      "cscw633",
      "cscw164",
      "cscw165",
      "cscw166",
      "cscw167",
      "cscw398",
      "cscw634",
      "cscw645",
      "cscw644",
      "cscw647",
      "cscw646",
      "cscw641",
      "cscw640",
      "cscw643",
      "cscw649",
      "cscw648",
      "cscw212",
      "cscw213",
      "cscw669",
      "cscw668",
      "cscw653",
      "cscw663",
      "cscw662",
      "cscw193",
      "cscw192",
      "cscw666",
      "cscw665",
      "cscw664",
      "cscw546",
      "cscw547",
      "cscw544",
      "cscw545",
      "cscw429",
      "cscw543",
      "cscw540",
      "cscw541",
      "cscw425",
      "cscw424",
      "cscw427",
      "cscw426",
      "cscw421",
      "cscw420",
      "cscw548",
      "cscw549",
      "cscw339",
      "cscw338",
      "cscw331",
      "cscw330",
      "cscw333",
      "cscw332",
      "cscw335",
      "cscw334",
      "cscw337",
      "cscw336",
      "cscw111",
      "cscw113",
      "cscw119",
      "cscw205",
      "cscw204",
      "cscw207",
      "cscw206",
      "cscw201",
      "cscw200",
      "cscw618",
      "cscw202",
      "cscw616",
      "cscw617",
      "cscw614",
      "cscw615",
      "cscw209",
      "cscw613",
      "cscw610",
      "cscw611",
      "cscw582",
      "cscw508",
      "cscw509",
      "cscw502",
      "cscw503",
      "cscw500",
      "cscw501",
      "cscw506",
      "cscw504",
      "cscw489",
      "cscw488",
      "cscw483",
      "cscw482",
      "cscw481",
      "cscw480",
      "cscw487",
      "cscw486",
      "cscw484",
      "cscw588",
      "cscw476",
      "cscw477",
      "cscw474",
      "cscw462",
      "cscw472",
      "cscw473",
      "cscw470",
      "cscw471",
      "cscw375",
      "cscw374",
      "cscw376",
      "cscw371",
      "cscw370",
      "cscw478",
      "cscw479",
      "cscw579",
      "cscw578",
      "cscw577",
      "cscw576",
      "cscw575",
      "cscw573",
      "cscw572",
      "cscw571",
      "cscw570",
      "cscw396",
      "cscw395",
      "cscw394",
      "cscw393",
      "cscw392",
      "cscw258",
      "cscw259",
      "cscw256",
      "cscw257",
      "cscw254",
      "cscw252",
      "cscw253",
      "cscw399",
      "cscw251",
      "cscw652",
      "cscw627",
      "cscw650",
      "cscw651",
      "cscw657",
      "cscw654",
      "cscw655",
      "cscw658",
      "cscw659",
      "cscw625",
      "cscw160",
      "cscw624",
      "cscw248",
      "cscw163",
      "cscw621",
      "cscw155",
      "cscw154",
      "cscw157",
      "cscw156",
      "cscw623",
      "cscw622",
      "cscw153",
      "cscw620",
      "cscw159",
      "cscw158",
      "cscw629",
      "cscw628"
      */
    ]
    
allData["acceptedPapers"] = []
for( var i = 0; i< 250; i++){
    allData["acceptedPapers"].push("movie"+i)
}    
allData["sessionIds"] = {} //{"email": "hmslydia@gmail.com"}

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
        console.log( allData["sessionIds"] )
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
        console.log(Object.keys(allData))
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