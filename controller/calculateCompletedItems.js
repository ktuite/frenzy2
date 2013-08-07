var utils = require('./node-utils');

updateCompletedItems = function(){
    allData["completion"] = calculateCompletedItems()
    allData["completionLastUpdated"] = getTime()
	//console.log(allData["completion"])
}

calculateCompletedItems = function(){
	var items = allData["items"]

	var arrayOfItemObjs =  utils.dictToArray(items)
    
	arrayOfItemObjs = utils.filterArray(arrayOfItemObjs, function(x){
        return utils.arrayContains(allData["acceptedPapers"], x["id"])
    })
    
	var completedItemObj = utils.filterArray(arrayOfItemObjs, function(x){
        var ans = false
        /*
        var labelsDict = x["labels"]
        for( var label in labelsDict){
            
            var labelObj = allData["labelList"][label]
            var labelsMembers = labelObj["itemsUsedBy"]
            labelsMembers = utils.filterArray(labelsMembers, function(x){
                return utils.arrayContains(allData["acceptedPapers"], x)
            })
            
            if(labelsMembers.length == 5){
                ans = true
            }
            
        }
        */
        return ans
      
	})
    
	var completedItemIds = utils.mapArray(completedItemObj, function (x){
		return x["id"]
	})
	
	var incompletedItemObj = utils.filterArray(arrayOfItemObjs, function(x){
        var ans = true
        /*
        var labelsDict = x["labels"]
        for( var label in labelsDict){
            var labelObj = allData["labelList"][label]
            var labelsMembers = labelObj["itemsUsedBy"]
            labelsMembers = utils.filterArray(labelsMembers, function(x){
                return utils.arrayContains(allData["acceptedPapers"], x)
            })
            
            if(labelsMembers.length == 5){
                ans = false
            }
        }
        */
        return ans
	})
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