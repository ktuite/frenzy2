var utils = require('./node-utils');

//Reply CRUD
// DONE post reply
//		edit reply
//		delete reply		
// 		like an reply to an item (dislike?)
// 		unlike an reply to an item
//
// Label CRUD
// DONE add label to item
// DONE remove label from item
// DONE toggle label checkmark on item

// user Location update

// hierarchy change
// completed changes

/////////////////////////////////////
// REPLY TO ITEM
/////////////////////////////////////
/*
update = {
	type : "replyToItem",
	user : "hmslydia",
	time : 1234567891,
	itemId : "item0" , 
	html : "<b>my reply</b>",
	parentId : "item0",	//"" if it is a reply to the item
    likes: []
}

{"type": "replyToItem", "user" : "hmslydia", "time" : 1, "itemId" : "item0", "html" : "<b>my reply</b>", "parentId": ""}
{"type": "replyToItem", "user" : "hmslydia", "time" : 2, "itemId" : "item0", "html" : "<b>my reply 2</b>", "parentId": "item0-reply0"}
*/

handleReplyToItem = function(replyToItem){
	var itemId = replyToItem["itemId"]
	var time = replyToItem["time"]
	var itemReference = allData["items"][itemId]

	var newReplyObj = createNewReplyObj(replyToItem)
	itemReference["replies"].push(newReplyObj)
	itemReference["lastUpdateTime"] = time
}

/*
reply = {
	user: "hmslydia",
	time: 12345556,
	html: ",b>boo</b>",
	id: "reply0",
	parentId: ""
}
*/
function createNewReplyObj(replyToItem){
	var user = replyToItem["user"]
	var time = replyToItem["time"]
	var itemId = replyToItem["itemId"]
	var html = replyToItem["html"]
	var parentId = replyToItem["parentId"]
    var likes = []
	
	//find the parent item
	var itemReference = allData["items"][itemId]

	var replyCounter = itemReference["replyCounter"]
	var newReplyId = itemId + "-reply" + replyCounter
	itemReference["replyCounter"]++	
	var newReplyObj = {
		"user": user,
		"time": time,
		"itemId": itemId,
		"html": html,
		"id": newReplyId,
		"parentId": parentId,
        "likes": likes
       
	}
	
	return newReplyObj
}
/*
update = {
	type : "likeReply",
	user : "hmslydia",
	time : 1234567891,
	itemId : "item0" , 
	replyId : item0-reply0"
}
*/
handleLikeReply = function(likeReply){
	var user = likeReply["user"]
	var time = likeReply["time"]
	var itemId = likeReply["itemId"]
	var replyId = likeReply["replyId"]	
	var itemReference = allData["items"][itemId]

	var replies = itemReference["replies"]
	var matchingReplies = utils.filterArray(replies, function(x){
		return x["id"] == replyId
	})
	if(matchingReplies.length == 1){
		var matchingReply = matchingReplies[0]
		var matchingReplyLikes = matchingReply["likes"] 
		if(utils.arrayContains(matchingReplyLikes, user)){
			//do nothing, they already like this
			console.log("error - handleLikeReply 1")
		}else{
			matchingReplyLikes.push(user)
		}
	}
	itemReference["lastUpdateTime"] = time
}

/*
update = {
	type : "likeReply",
	user : "hmslydia",
	time : 1234567891,
	itemId : "item0" , 
	replyId : item0-reply0"
}
*/
handleUnlikeReply = function(unlikeReply){
	var user = unlikeReply["user"]
	var time = unlikeReply["time"]
	var itemId = unlikeReply["itemId"]
	var replyId = unlikeReply["replyId"]	
	var itemReference = allData["items"][itemId]

	var replies = itemReference["replies"]
	var matchingReplies = utils.filterArray(replies, function(x){
		return x["id"] == replyId
	})

	if(matchingReplies.length == 1){
		var matchingReply = matchingReplies[0]
		var matchingReplyLikes = matchingReply["likes"] 
		if(utils.arrayContains(matchingReplyLikes, user)){
			//do nothing, they already like this
			var indexOfUsernameToRemove = matchingReplyLikes.indexOf(user)
			matchingReplyLikes.splice(indexOfUsernameToRemove,1)
		}else{
			console.log("error - handleUnlikeReply 1")
		}
	}
	itemReference["lastUpdateTime"] = time
	//console.log(itemReference)
}

/////////////////////////////////////
// ADD LABEL TO ITEM
/////////////////////////////////////
/*
update = {
	type : "addLabelToItem",
	user : "hmslydia",
	time : 1234567891,
	itemId : "item0" , 
	labelText : "animal"
}

{"type" : "addLabelToItem", "user" : "hmslydia",	"time" : 1234567891, "itemId" : "item0" , "labelText" : "animal2"}

*/
handleAddLabelToItem = function(addLabelToItem){
	var user = addLabelToItem["user"]
	var time = addLabelToItem["time"]
	var itemId = addLabelToItem["itemId"]
	var labelText = addLabelToItem["labelText"]
	
	var itemReference = allData["items"][itemId]
	//does the label already exist in allData?
	//if not, create a new label object
	if( !(labelText in allData["labelList"])){
		addLabelToLabelList(labelText, user, time)
	}
	
	//attach a reference to that label object	
	var labelRef = {
		"label": labelText,
		"checked": true,
		"likes" : [],
		"dislikes" : [],
		"lastTimeUpdated" : time
	}
	itemReference["labels"][labelText] = (labelRef)
	
	//update the labelList to say that this label is on this item
	updateLabelListItemCounts(labelText, itemId, time)
	
	//updateActionableFeedback()
	//updateHierarchy()
	itemReference["lastUpdateTime"] = time
}

function addLabelToLabelList(labelText, user, time){
	var newLabelObj = {
		"label" : labelText,
		"itemsUsedBy" : [],
		"user" : user,
		"creationTime" : time
	}
	allData["labelList"][labelText] = newLabelObj
}

function updateLabelListItemCounts(labelText, item, time){
	if( !(labelText in allData["labelList"])){
		console.log("ERROR 1 - function updateAllLabels, handleUpdatesFromClient.js")		
	}else{
		var labelObj = allData["labelList"][labelText]
		//check if item is already in the counter list, if it isn't add it.
		if( !utils.arrayContains( labelObj["itemsUsedBy"], item) ){
			labelObj["itemsUsedBy"].push(item)
		}else{
			console.log("ERROR 2 - function updateAllLabels, handleUpdatesFromClient.js")		
		}
	}
}

/////////////////////////////////////
// REMOVE LABEL FROM ITEM
/////////////////////////////////////
/*
update = {
	type : "removeLabelFromItem",
	user : "hmslydia",
	time : 1234567891,
	itemId : "item0" , 
	labelText : "animal"
}

{"type" : "removeLabelFromItem", "user" : "hmslydia",	"time" : 1234567892, "itemId" : "item0" , "labelText" : "animal"}

*/

handleRemoveLabelFromItem = function(removeLabelFromItem){
	var user = removeLabelFromItem["user"]
	var time = removeLabelFromItem["time"]
	var itemId = removeLabelFromItem["itemId"]
	var labelText = removeLabelFromItem["labelText"]	
	
	var itemReference = allData["items"][itemId]
	//remove label from the item
	
	var itemReferenceLabels = itemReference["labels"]
	if(itemReferenceLabels.hasOwnProperty(labelText) ){
		delete itemReferenceLabels[labelText]
	}else{
		console.log("ERROR 1 - function handleRemoveLabelFromItem, handleUpdatesFromClient.js")
	}
	
	//remove item reference in allData["labelList"]
	var listOfItemsWithThisLabel = allData["labelList"][labelText]["itemsUsedBy"]
	var indexOfItem = listOfItemsWithThisLabel.indexOf(itemId)
	listOfItemsWithThisLabel.splice(indexOfItem, 1) 
	
	//updateActionableFeedback()
	//updateHierarchy()
	itemReference["lastUpdateTime"] = time
}

/////////////////////////////////////
// TOGGLE LABEL FROM ITEM
/////////////////////////////////////
/*
update = {
	type : "toggleLabelFromItem",
	user : "hmslydia",
	time : 1234567891,
	itemId : "item0" , 
	labelText : "animal",
	checked: true,
}

{"type" : "removeLabelFromItem", "user" : "hmslydia",	"time" : 1234567891, "itemId" : "item0" , "labelText" : "animal"}

*/
handleToggleLabelFromItem = function(toggleLabelFromItem){
	var user = toggleLabelFromItem["user"]
	var time = toggleLabelFromItem["time"]
	var itemId = toggleLabelFromItem["itemId"]
	var labelText = toggleLabelFromItem["labelText"]	
	var checked = toggleLabelFromItem["checked"]	
	console.log(toggleLabelFromItem)
	
	var itemReference = allData["items"][itemId]
	
	//update item labels
	itemReference["labels"][labelText]["lastUpdateTime"] = time
	itemReference["lastUpdateTime"] = time
	itemReference["labels"][labelText]["checked"] = checked
	
	//update itemsUsedBy
	var itemsUsedBy = allData["labelList"][labelText]["itemsUsedBy"]
	if(checked && itemsUsedBy.indexOf(itemId) == -1){
		itemsUsedBy.push(itemId)
	}
	if(!checked && itemsUsedBy.indexOf(itemId) > -1){
		itemsUsedBy.splice(itemsUsedBy.indexOf(itemId), 1)
	}
	
	//updateActionableFeedback()
	//updateHierarchy()
	
}

/////////////////////////////////////
// MARK SESSION ON ITEM
/////////////////////////////////////
/*
update = {
	type : "session",
	user : "hmslydia",
	time : 1234567891,
	itemId : "item0" , 
	sessionLabel : "animal"
}
*/
handleSessionUpdate = function(markSessionOnItem){
console.log("handleSessionUpdate")
	var user = markSessionOnItem["user"]
	var time = markSessionOnItem["time"]
	var itemId = markSessionOnItem["itemId"]
	var sessionLabel = markSessionOnItem["sessionLabel"]	
	
	var itemReference = allData["items"][itemId]

	itemReference["session"] = sessionLabel
}