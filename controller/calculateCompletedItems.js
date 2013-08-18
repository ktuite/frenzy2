var utils = require('./node-utils');

updateCompletedItems = function(){
    allData["completion"] = calculateCompletedItems()
    allData["completionLastUpdated"] = getTime()
	//console.log(allData["completion"])
}

calculateCompletedItems = function(){
	var items = allData["items"]

	var arrayOfItemObjs =  utils.dictToArray(items)
    /*
	arrayOfItemObjs = utils.filterArray(arrayOfItemObjs, function(x){
        return utils.arrayContains(allData["acceptedPapers"], x["id"])
    })
    */

    var isComplete; // defined next
    if (allData["sessionMaking"]) {
        // goal for session-making Frenzy: a completed paper has a session 
        isComplete = function(item) {
            //console.log(item["session"])
            if (item["session"] && item["session"] != "none") {
                return true
            } else {
                return false
            }
        }
    } else {
        // goal for paper-tagging Frenzy: a completed paper has at least one non-singletone category with a +1 vote 
        isComplete = function(item){
            var allLabels = allData["labelList"]
            var labelsOnThisItem = item["labels"]
            for( var label in labelsOnThisItem ){
                if (labelsOnThisItem[label]["likes"].length > 0 // somebody voted for this label
                    && allLabels[label]["itemsUsedBy"].length > 1 // and the label isn't a singleton
                    ) {
                    return true
                }
            }
            return false // couldn't find a label with session-making potential
        }
    }

	var completedItemObj = utils.filterArray(arrayOfItemObjs, isComplete)
    
	var completedItemIds = utils.mapArray(completedItemObj, function (x){
		return x["id"]
	})
	
	var incompletedItemObj = utils.filterArray(arrayOfItemObjs, function(x){ return !isComplete(x) })

	var incompletedItemIds = utils.mapArray(incompletedItemObj, function (x){
		return x["id"]
	})
    	
	return {"completedItemIds":completedItemIds, "incompletedItemIds": incompletedItemIds}	
	
}

calculateSingletonLabels = function(){
	var items = allData["labelList"]
	var arrayOfItemObjs =  utils.dictToArray(items)
	
	var singletonItemObj = utils.filterArray(arrayOfItemObjs, function(x){
		var numberOfItemsWithLabel = x["itemsUsedBy"].length
		return numberOfItemsWithLabel == 1		
	})

	return singletonItemObj
}