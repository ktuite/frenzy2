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
    var isComplete = function(x){
        var ans = false
        var labelsDict = x["labels"]
        for( var label in labelsDict ){
            var labelObj = labelsDict[label]
            var labelLikes = labelObj["likes"]
            if (labelLikes.length >= 2) {
                ans = true
            }
            /* old goal: at least one non-user-created label
            var labelObj = allData["labelList"][label]
            var labelCreator = labelObj["creator"]
            if (labelCreator != "system"){
                ans = true
            }*/
        }
        return ans
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