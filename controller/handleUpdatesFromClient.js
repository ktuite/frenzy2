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
// ADD LABEL(S) TO ITEM
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

handleAddLabelToItemsInQuery = function(addLabelToItems){
	var user = addLabelToItems["user"]
	var time = addLabelToItems["time"]
	var itemIds = addLabelToItems["itemIds"]
	var labelText = addLabelToItems["labelText"]
    
    for(var i in itemIds){
        var itemId = itemIds[i]
        var addLabelToItem = {
            "user" : user,
            "time" : time,
            "itemId" : itemId, 
            "labelText": labelText
        }
        handleAddLabelToItem(addLabelToItem)
    }

}

handleAddSessionToItemsInQuery = function(addSessionToItems){
	var user = addSessionToItems["user"]
	var time = addSessionToItems["time"]
	var itemIds = addSessionToItems["itemIds"]
	var labelText = addSessionToItems["labelText"]
    
    //add each 
    /*
    for(var i in itemIds){
        var itemId = itemIds[i]
        var addLabelToItem = {
            "user" : user,
            "time" : time,
            "itemId" : itemId, 
            "labelText": labelText
        }
        handleAddLabelToItem(addLabelToItem)
    }
    */
    //mark those items as the session
    for(var i in itemIds){
        var itemId = itemIds[i]
        var sessionUpdate = {
            "user" : user,
            "time" : time,
            "itemId" : itemId, 
            "sessionLabel": labelText
        }
        handleSessionUpdate(sessionUpdate)
    }
    
    

}


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
    if( itemId in allData["items"] ){
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
}

function addLabelToLabelList(labelText, user, time){
	var newLabelObj = {
		"label" : labelText,
		"itemsUsedBy" : [],
		"user" : user,
        "creator" : user,
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
	
    if( itemId in allData["items"] ){
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
	
    if( itemId in allData["items"] ){
        var itemReference = allData["items"][itemId]
        
        //update item labels
        itemReference["labels"][labelText]["lastUpdateTime"] = time
        itemReference["lastUpdateTime"] = time
        itemReference["labels"][labelText]["checked"] = checked
        
        //update itemsUsedBy
        if(labelText in allData["labelList"]){
            var itemsUsedBy = allData["labelList"][labelText]["itemsUsedBy"]
            if(checked && itemsUsedBy.indexOf(itemId) == -1){
                itemsUsedBy.push(itemId)
            }
            if(!checked && itemsUsedBy.indexOf(itemId) > -1){
                itemsUsedBy.splice(itemsUsedBy.indexOf(itemId), 1)
            }
        }else{
            console.log("ERROR - handleUpdatesFromClient, handleToggleLabelFromItem - 1")
        }
        //updateActionableFeedback()
        //updateHierarchy()
    }
	
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
	var user = markSessionOnItem["user"]
	var time = markSessionOnItem["time"]
	var itemId = markSessionOnItem["itemId"]
	var sessionLabel = markSessionOnItem["sessionLabel"]	
	
    if( itemId in allData["items"] ){
        var itemReference = allData["items"][itemId]
        itemReference["lastUpdateTime"] = time
        
        itemReference["session"] = sessionLabel
    }
}


/////////////////////////////////////
// TOGGLE LIKE OF LABEL ON ITEM 
/////////////////////////////////////
/*
update = {
	type : "toggleLabelLiked",
	user : "hmslydia",
	time : 1234567891,
	itemId : "item0" , 
	labelText : "animal",
	liked : true
}
*/
handleToggleLabelLiked = function(toggleLabelLiked){
	var user = toggleLabelLiked["user"]
	var time = toggleLabelLiked["time"]
	var itemId = toggleLabelLiked["itemId"]
	var labelText = toggleLabelLiked["labelText"]	
	var liked = toggleLabelLiked["liked"]	
	
    if( itemId in allData["items"] ){
        var itemReference = allData["items"][itemId]
        itemReference["lastUpdateTime"] = time

        var usersLiking = itemReference["labels"][labelText]["likes"]
        //console.log("usersLiking was")
        //console.log(usersLiking)
        
        // first remove all occurrences of the user from the list
        var i
        while ((i = usersLiking.indexOf(user)) != -1) {
            usersLiking.splice(i,1)
        }

        // then add back if looking liking move (Act 1 Scene 3)
        if (liked) {
            usersLiking.push(user)
        }

        //console.log("usersLiking is now")
        //console.log(usersLiking)
    }
}


/////////////////////////////////////
// RENAME SESSION
/////////////////////////////////////
/*
update = {
	type : "renameSession",
	user : "hmslydia",
	time : 1234567891,
	oldName : "animal",
	newName : "vegetable",
}
*/
handleRenameSession = function(renameSession){
	var user = renameSession["user"]
	var time = renameSession["time"]
	var oldName = renameSession["oldName"]	
	var newName = renameSession["newName"]	

    if (!newName   // null return value means user cancelled
        || !(newName.trim()) // blank names are a bad idea
        || newName in allData["sessions"] // new name is already in use
        ) {
    	console.log("error - illegal session rename from " + oldName + " to " + newName)
        return;  // change nothing
    }

	console.log("renaming " + oldName + " to " + newName)

	// first rename the label in labelList
	var sessions = allData["sessions"]
	var sessionObj = sessions[oldName]
	if (!sessionObj) {
		console.log("error - can't find " + oldName + " to rename it, maybe somebody already renamed it")
		return
	}

	sessionObj["label"] = newName
	delete sessions[oldName]
	sessions[newName] = sessionObj

	// now rename the session on every item where it occurs
	var items = allData["items"]
	var itemsInThisSession = sessionObj["members"]
	for (var i = 0; i < itemsInThisSession.length; ++i) {
		var itemId = itemsInThisSession[i]
		var itemReference = items[itemId]
		itemReference["lastUpdateTime"] = time

		if (itemReference["session"] != oldName) {
			console.log("error - " + itemId + " doesn't seem to be in session " + oldName + " for renaming the session")
			continue
		}

		itemReference["session"] = newName
	}

	// now store the old/new name pair in the cache
	renamedSessionCache[oldName] = newName;
}

/////////////////////////////////////
// RENAME LABEL
/////////////////////////////////////

/*
update = {
	type : "renameLabel",
	user : "hmslydia",
	time : 1234567891,
	oldName : "animal",
	newName : "vegetable",
}
*/
handleRenameLabel = function(renameLabel){
	var user = renameLabel["user"]
	var time = renameLabel["time"]
	var oldName = renameLabel["oldName"]	
	var newName = renameLabel["newName"]	

    if (!newName   // null return value means user cancelled
        || !(newName.trim()) // blank names are a bad idea
        || newName in allData["labelList"] // new name is already in use
        ) {
    	console.log("error - illegal label rename from " + oldName + " to " + newName)
        return;  // change nothing
    }

	console.log("renaming " + oldName + " to " + newName)

	// first rename the label in labelList
	var labelList = allData["labelList"]
	var labelObj = labelList[oldName]
	if (!labelObj) {
		console.log("error - can't find " + oldName + " to rename it, maybe somebody already renamed it")
		return
	}

	labelObj["label"] = newName
	delete labelList[oldName]
	labelList[newName] = labelObj

	// now rename the label on every item where it occurs
	var items = allData["items"]
	var itemsWithThisLabel = labelObj["itemsUsedBy"]
	for (var i = 0; i < itemsWithThisLabel.length; ++i) {
		var itemId = itemsWithThisLabel[i]
		var itemReference = items[itemId]
		itemReference["lastUpdateTime"] = time

		var itemLabelList = itemReference["labels"]
		var itemLabelObj = itemLabelList[oldName]
		if (!itemLabelObj) {
			console.log("error - can't find " + oldName + " on " + itemId + "to rename it")
			continue
		}

		itemLabelObj["label"] = newName
		delete itemLabelList[oldName]
		itemLabelList[newName] = itemLabelObj
	}

	// now store the old/new name pair in the cache
	renamedLabelCache[oldName] = newName;
}

