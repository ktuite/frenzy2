var utils = require('./node-utils');


getFeedItemsAndOrder = function(query){
	var queryType = query["type"]
	var itemIds = []
    
    //by default put everything on the queue
    for( var itemId in allData["items"]){
			itemIds.push(itemId)
    }
    
	//////////////////////////////
	// SEARCH 
	//////////////////////////////
    /*
	if(queryType == "all"){
		for( var itemId in allData["items"]){
			itemIds.push(itemId)
		}
	}
    */
    if(queryType == "session"){
		var label = query["label"]
        var sessionObj = lookupDespiteRenaming(allData["sessions"], label, renamedSessionCache)
        itemIds = sessionObj ? sessionObj["members"] : []
	}
    //if(queryType == "text"){
    if("text" in query){
        var text = query["text"]
        itemIds = getAllItemIdsWithTextT(text)
	}
	if(queryType == "completed"){
		itemIds = allData["completion"]["completedItemIds"]
	}
	if(queryType == "incompleted"){
		itemIds = allData["completion"]["incompletedItemIds"]
	}
    
	//if(queryType == "label"){
    if("labels" in query){
		var label = query["label"]
        var labelsToFilter = query["labels"]  
        if(labelsToFilter.length > 0){
            var checked = query["checked"]
            
            var label0 =labelsToFilter[0]      
            //var labelObj = allData["labelList"][label0]
            // label might have been renamed or deleted, so return empty list if so
            var itemIdsForThisLabel = getAllItemIdsWithLabel(label0)
            //itemIds = labelObj["itemsUsedBy"]
            itemIds = utils.arrayIntersection(itemIds, itemIdsForThisLabel)
            
            for(var i = 1; i<labelsToFilter.length; i++){
                
                var thisLabel = labelsToFilter[i]
                //var thisLabelObj = allData["labelList"][thisLabel]
                var itemIdsForThisLabel = getAllItemIdsWithLabel(thisLabel)
                itemIds = utils.arrayIntersection(itemIds, itemIdsForThisLabel)
                
            }
        }        
	}

    //////////////////////////////
	// Plus One Filter 
	//////////////////////////////
    if(!allData["sessionMaking"]){
    //if("sessionFilter" in query){
        
        var plusOneFilter = "all"
        if("plusOneFilter" in query){
            plusOneFilter = query["plusOneFilter"]
        }
        
        var numAll = itemIds.length 
        var numWithoutPlusOne = 0
        var numWithPlusOne = 0
        
        var allItemsWithoutPlusOne = allData["completion"]["incompletedItemIds"]
        /*
        if("none" in allData["sessions"]){
            var allItemsNotInSessions = allData["sessions"]["none"]["members"]
        }
        */
        var displayedItemsWithPlusOne = []
        var displayedItemsWithoutPlusOne = []
            
        for(var itemIdIndex in itemIds){
            var memberItemId = itemIds[itemIdIndex]
            if( utils.arrayContains(allItemsWithoutPlusOne, memberItemId) ){
                displayedItemsWithoutPlusOne.push(memberItemId)
            }else{
                displayedItemsWithPlusOne.push(memberItemId)
            }
        }        
        
        if(plusOneFilter == "withPlusOne"){
            itemIds = displayedItemsWithPlusOne
        }
        if(plusOneFilter == "withoutPlusOne"){
            itemIds = displayedItemsWithoutPlusOne
        }  
                       
        numWithoutPlusOne = displayedItemsWithoutPlusOne.length
        numWithPlusOne = displayedItemsWithPlusOne.length
        query["plusOneFilterData"]={
            "numAll": numAll,
            "numWithoutPlusOne": numWithoutPlusOne,
            "numWithPlusOne": numWithPlusOne
        }        
    }

    /*
    if(allData["sessionMaking"]){
    //if("sessionFilter" in query){
        
        var sessionFilter = "all"
        if("sessionFilter" in query){
            sessionFilter = query["sessionFilter"]
        }
        
        var displayedItemsInSession = []
        var displayedItemsNotInSession = []
        
        if(sessionFilter == "all"){
            //do nothing
        }else{
            var allItemsNotInSessions = []
            if("none" in allData["sessions"]){
                var allItemsNotInSessions = allData["sessions"]["none"]["members"]
            }
            
                
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
                itemIds = displayedItemsInSession
            }
            if(sessionFilter == "withoutSessions"){
                itemIds = displayedItemsNotInSession
            }  
        }  

        query["sessionFilterData"]={
            "numAll": numAll,
            "numWithoutSession": displayedItemsNotInSession.length,
            "numWithSession": displayedItemsInSession.length
        }         
    }
    */
    if(allData["sessionMaking"]){
    //if("sessionFilter" in query){
        
        var sessionFilter = "all"
        if("sessionFilter" in query){
            sessionFilter = query["sessionFilter"]
        }
        var numWithoutSession = 0
        var numWithSession = 0
        
        var allItemsNotInSessions = []
        if("none" in allData["sessions"]){
            allItemsNotInSessions = allData["sessions"]["none"]["members"]
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
        
        if(sessionFilter == "withSessions"){
            itemIds = displayedItemsInSession
        }
        if(sessionFilter == "withoutSessions"){
            itemIds = displayedItemsNotInSession
        }  
                       
        numWithoutSession = displayedItemsNotInSession.length
        numWithSession = displayedItemsInSession.length
        query["sessionFilterData"]={
            "numAll": numWithoutSession+numWithSession,
            "numWithoutSession": numWithoutSession,
            "numWithSession": numWithSession
         }        
     }    
    
	//////////////////////////////
	// SORT 
	//////////////////////////////
	var sortOrder = query["sortOrder"]
    //console.log("sort order is " + sortOrder)
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
    if (sortOrder == "mostLikesForLabels") {
        itemIds = sortItemIdsByMostLikesForLabels(itemIds, query["labels"])        
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
    //console.log(itemObject)
    itemObject = itemObject["content"]
    var displayId = itemObject["id"] .toLowerCase()
    var title = itemObject["title"].toLowerCase()
    var authorList = itemObject["authorList"]
    var fullAbstract = itemObject["fullAbstract"].toLowerCase()      
    
    /*
    var itemReplies = itemObject["replies"]
    for(var i in itemReplies){
        var itemReply = itemReplies[i]
        var itemReplyHtml = itemReply["html"]
        if(itemReplyHtml.search(text)> -1){
            return true
        }        
    }
    var itemHtml = itemObject["html"].toLowerCase()
    */
    if(displayId.search(text)> -1){
        return true
    }  
    if(title.search(text)> -1){
        return true
    }    
    if(fullAbstract.search(text)> -1){
        return true
    }  
    for(var i in authorList){
        var authorNameAndAffiliation = authorList[i].toLowerCase()
        if(authorNameAndAffiliation.search(text)> -1){
            return true
        }
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

// sort in decreasing order by the total number of likes each item has for the given labels
// for example, if labels=["A","B"] and an item is labeled with A,B,C,D with 3 likes for A, 2 likes for B, and 1 like for C, then its
// value for sorting is 3(A)+2(B) = 5.
sortItemIdsByMostLikesForLabels = function(itemIds, labels) {
    var itemReferences = allData["items"]
    itemIds.sort(function(a,b) { return totalLikesForLabels(itemReferences[b], labels) - totalLikesForLabels(itemReferences[a], labels)})
    return itemIds
}

totalLikesForLabels = function(item, labels) {
    var count = 0
    for (var i in labels) {
        var label = labels[i]
        var labelObj = item["labels"][label]
        if (labelObj) {
            count += labelObj["likes"].length
        }
    }
    return count
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