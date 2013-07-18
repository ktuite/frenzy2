var utils = require('./node-utils');


getFeedItemsAndOrder = function(query){
	console.log("getFeedItemsAndOrder")
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
		var checked = query["label"]
		var labelInHierarchy = utils.filterArray(allData["hierarchy"], function(x){
			return x["label"]["label"] == label
		})
		if(labelInHierarchy.length > 0){
			var labelObj = labelInHierarchy[0]["label"]
			console.log(labelObj)
			itemIds = labelObj["memberItemIds"]			
		
		}else{
			console.log("error getFeedItemsAndOrder - 1")
		
		}
	}
	if(queryType == "session"){
		var label = query["label"]
		
		itemIds = allData["sessions"][label]
	}
	if(queryType == "completed"){
		itemIds = allData["completion"]["completedItemIds"]
	}
	if(queryType == "incompleted"){
		itemIds = allData["completion"]["incompletedItemIds"]
	}
	
	//////////////////////////////
	// SORT 
	//////////////////////////////
	var sortOrder = query["sortOrder"]
	if(sortOrder == "creationTime"){
		itemIds = sortItemIdsByCreationTime(itemIds)
	}
	console.log(itemIds)
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

doesItemContainText = function(itemObject, text){
    var itemReplies = itemObject["replies"]
    for(var i in itemReplies){
        var itemReply = itemReplies[i]
        console.log(itemReply)
        var itemReplyHtml = itemReply["html"]
        if(itemReplyHtml.search(text)> -1){
            console.log("TRUE")
            return true
        }
        
    }
    
    return false
}

sortItemIdsByLastUpdated = function(allItemIds){
	var itemReferences = allData["items"]
	var arrayOfItemReferences = utils.dictToArray(itemReferences)
	var itemsIdsWithLastUpdatedTimes = utils.mapArray(arrayOfItemReferences, function(x){
		return {"itemId": x["id"], "timeLastUpdated": x["lastUpdateTime"]}
	})
	//var itemsIdsWithLastUpdatedTimes = [{"itemId":"item0", "timeLastUpdated": 123456788}, {"itemId":"item1", "timeLastUpdated": 123456789}]
	itemsIdsWithLastUpdatedTimes.sort(function(a,b){return b["timeLastUpdated"]-a["timeLastUpdated"]});
	
	return itemsIdsWithLastUpdatedTimes
}

sortItemIdsByCreationTime = function(itemIds){
	var itemReferences = allData["items"]
	itemIds.sort(function(a,b){return itemReferences[b]["creationTime"] - itemReferences[b]["creationTime"]});
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