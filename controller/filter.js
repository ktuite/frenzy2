var utils = require('./node-utils');


getFeedItemsAndOrder = function(query){
	var queryType = query["type"]
	var itemIds = []
    

    
	//////////////////////////////
	// SEARCH 
	//////////////////////////////
	if(queryType == "all"){
		for( var itemId in allData["items"]){
			itemIds.push(itemId)
		}
	}
	if(queryType == "label"){
		var label = query["label"]
        var labelsToFilter = query["labels"]        
		var checked = query["checked"]
        
        var label0 =labelsToFilter[0]      
		var itemIds = getAllItemIdsWithLabel(label0)
        
        for(var i = 1; i<labelsToFilter.length; i++){
            
            var thisLabel = labelsToFilter[i]
            var thisLabelObj = allData["labelList"][thisLabel]
            var itemIdsForThisLabel = getAllItemIdsWithLabel(thisLabel)
            itemIds = utils.arrayIntersection(itemIds, itemIdsForThisLabel)
            
        }
	}

	if(queryType == "session"){
		var label = query["label"]
        var sessionObj = lookupDespiteRenaming(allData["sessions"], label, renamedSessionCache)
        itemIds = sessionObj ? sessionObj["members"] : []
	}
    if(queryType == "text"){
        var text = query["text"]
        itemIds = getAllItemIdsWithTextT(text)
	}
	if(queryType == "completed"){
		itemIds = allData["completion"]["completedItemIds"]
	}
	if(queryType == "incompleted"){
		itemIds = allData["completion"]["incompletedItemIds"]
	}

    //////////////////////////////
	// Session Filter 
	//////////////////////////////
    if(allData["sessionMaking"]){
    //if("sessionFilter" in query){
        
        var sessionFilter = "all"
        if("sessionFilter" in query){
            sessionFilter = query["sessionFilter"]
        }
        console.log("session filter: "+sessionFilter)
        var numAll = itemIds.length 
        var numWithoutSession = 0
        var numWithSession = 0
        
        var allItemsNotInSessions = []
        if("none" in allData["sessions"]){
            var allItemsNotInSessions = allData["sessions"]["none"]["members"]
        }
        var displayedItemsInSession = []
        var displayedItemsNotInSession = []
            
        for(var itemIdIndex in itemIds){
            var memberItemId = itemIds[itemIdIndex]
            if( utils.arrayContains(allItemsNotInSessions, memberItemId) ){
                displayedItemsNotInSession.push(memberItemId)
            }else{
                displayedItemsInSession.push(memberItemId)
            }
        }
        //console.log(displayedItemsInSession)
        //console.log(displayedItemsNotInSession)
        
        
        
        if(sessionFilter == "withSessions"){
            console.log("with sessionss")
            itemIds = displayedItemsInSession
        }
        if(sessionFilter == "withoutSessions"){
            console.log("withOUT sessionss")
            itemIds = displayedItemsNotInSession
        }  
        console.log("foo")
                       
        numWithoutSession = displayedItemsNotInSession.length
        numWithSession = displayedItemsInSession.length
        query["sessionFilterData"]={
            "numAll": numAll,
            "numWithoutSession": numWithoutSession,
            "numWithSession": numWithSession
        }        
    }
   
	//////////////////////////////
	// SORT 
	//////////////////////////////
	var sortOrder = query["sortOrder"]
	if(sortOrder == "creationTime"){
		itemIds = sortItemIdsByCreationTime(itemIds)
        //console.log("creationTime")
	}
	if(sortOrder == "mostActive"){
		itemIds = sortItemIdsByMostRecentlyUpdated(itemIds)
        //console.log("mostActive")
	}
    if(sortOrder == "leastActive"){
		itemIds = sortItemIdsByLeastRecentlyUpdated(itemIds)
        //console.log("leastActive")
	}
	return itemIds
}

///////////////////////////
getMemberItemObjsForIds = function(memberItemIds){
	var itemObjs = []
	
	var itemsReferences = allData["items"]
	for(itemId in memberItemIds){
		var itemObject = itemsReferences[itemId]
		itemObjs.push(itemObject)
	}
	return itemObjs
}

filterItemIdsByLabel = function(requestedLabel){
	var itemsReferences = allData["items"]
    var itemIdsWithLabelChecked = []
	var itemIdsWithLabelUNchecked = []
    for(itemId in itemsReferences){
        var itemObject = itemsReferences[itemId]
        var itemLabels = itemObject["labels"]
        for(label in itemLabels){
            var labelObj = itemLabels[label]
            if(label == requestedLabel){ 
                var isChecked = labelObj["checked"]
                if(isChecked == false){
                    itemIdsWithLabelUNchecked.push(itemId)
                }
                else{
                    itemIdsWithLabelChecked.push(itemId)
                }     
            }                       
        }        
    }

	var rtn = {"itemIdsWithLabelChecked":itemIdsWithLabelChecked, 
				"itemIdsWithLabelUNchecked": itemIdsWithLabelUNchecked}
	return rtn
}
getAllItemIdsWithTextT = function(text){
    var itemReferences = allData["items"]
    var arrayOfItemReferences = utils.dictToArray(itemReferences)
    var itemObjectsContainingText = utils.filterArray(arrayOfItemReferences, function(x){
        return (doesItemContainText(x, text))
	})
    var itemIdsContainingText = utils.mapArray(itemObjectsContainingText, function(x){
		return x["id"]
	})
    return itemIdsContainingText
}

getAllItemIdsWithLabel = function(label){
    var labelObj = lookupDespiteRenaming(allData["labelList"], label, renamedLabelCache)
    if (!labelObj) {
        return []
    } else {
        return labelObj["itemsUsedBy"]
    }
}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  //return str
}

doesItemContainText = function(itemObject, text){
    var text = escapeRegExp(text.toLowerCase())
    var itemReplies = itemObject["replies"]
    for(var i in itemReplies){
        var itemReply = itemReplies[i]
        var itemReplyHtml = itemReply["html"]
        if(itemReplyHtml.search(text)> -1){
            return true
        }        
    }
    var itemHtml = itemObject["html"].toLowerCase()
    if(itemHtml.search(text)> -1){
        return true
    }  
    return false
}

sortItemIdsByMostRecentlyUpdated = function(itemIds){
	var itemReferences = allData["items"]
	itemIds.sort(function(a,b){return itemReferences[b]["lastUpdateTime"] - itemReferences[a]["lastUpdateTime"]});
	return itemIds
}

sortItemIdsByLeastRecentlyUpdated = function(itemIds){
	var itemReferences = allData["items"]
    itemIds.sort(function(a,b){return itemReferences[a]["lastUpdateTime"] - itemReferences[b]["lastUpdateTime"]});
	return itemIds
}

sortItemIdsByCreationTime = function(itemIds){
	var itemReferences = allData["items"]
	itemIds.sort(function(a,b){return itemReferences[b]["creationTime"] - itemReferences[a]["creationTime"]});
	return itemIds
}

getAllItemObjectsUpdatedSinceTimeT = function(t){
    var itemReferences = allData["items"]
	var arrayOfItemReferences = utils.dictToArray(itemReferences)
	var itemObjectsWithLastUpdatedTimes = utils.filterArray(arrayOfItemReferences, function(x){
        return (x["lastUpdateTime"] >= t)
	})
    return itemObjectsWithLastUpdatedTimes
}

sortItemIdsByMostReplies = function(allItemIds){
	var itemReferences = allData["items"]
	var arrayOfItemReferences = utils.dictToArray(itemReferences)
	var itemsIdsWithLastUpdatedTimes = utils.mapArray(arrayOfItemReferences, function(x){
		return {"itemId": x["id"], "replies": x["replies"].length}
	})
	
	itemsIdsWithLastUpdatedTimes.sort(function(a,b){return b["replies"].length-a["replies"].length});
	
	return itemsIdsWithLastUpdatedTimes 
}

sortItemIdsByMostLabels = function(allItemIds){
	var itemReferences = allData["items"]
    var arrayOfItemReferences = utils.dictToArray(itemReferences)
	    
   	var itemsIdsWithLabels = utils.mapArray(arrayOfItemReferences, function(x){
		var itemLabelDict = x["labels"]
        var numOfLabels = Object.keys(itemLabelDict).length
        return {"itemId": x["id"], "numOfLabels": numOfLabels}
	})
	itemsIdsWithLabels.sort(function(a,b){return b["numOfLabels"]-a["numOfLabels"]});
	
	return itemsIdsWithLabels
    
}

sortItemIdsByLeastLabels = function(allItemIds){
	var itemReferences = allData["items"]
    var arrayOfItemReferences = utils.dictToArray(itemReferences)
	    
   	var itemsIdsWithLabels = utils.mapArray(arrayOfItemReferences, function(x){
		var itemLabelDict = x["labels"]
        var numOfLabels = Object.keys(itemLabelDict).length
        return {"itemId": x["id"], "numOfLabels": numOfLabels}
	})
	itemsIdsWithLabels.sort(function(a,b){return a["numOfLabels"]-b["numOfLabels"]});
	
	return itemsIdsWithLabels
}