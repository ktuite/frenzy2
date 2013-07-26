var utils = require('./node-utils');

updateSessions = function(){
    allData["sessions"] = createSessions()
    allData["sessionsLastUpdated"] = getTime()
}
/*
Sessions Are denoted in two places.

item["session"] = "label"
item["labels"][label] = 

item0 = {
	"id": "item0",
    "html": "<b>item0 meow</b>",
	"replies" : [],
	"replyCounter" : 0,
	"lastUpdateTime" : 12344555,
	"creationTime": 0, 
	"labels": {},
	"session": ""
}
allData["items"]["item0"] = item0

label1Ref = {
	"label": "animal",
	"checked": true,
	"session": false,
	"likes" : [],
	"dislikes" : [],
	"lastUpdateTime" : 123456789
}
allData["items"]["item0"]["labels"]["animal"] = label1Ref
*/
createSessions = function(){
	sessions = {}
	allItems = allData["items"]
	for( var i in allItems){
		var itemObj = allItems[i]
		var id = itemObj["id"]
		var session = itemObj["session"]
		if(session in sessions){
			sessions[session].push(id)
		}else{
			sessions[session] = [id]
		}
	}
	return sessions
}

