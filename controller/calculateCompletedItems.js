var utils = require('./node-utils');

updateCompletedItems = function(){
    allData["completion"] = calculateCompletedItems()
    allData["completionLastUpdated"] = getTime()
	console.log(allData["completion"])
}

calculateCompletedItems = function(){
	console.log("calculateCompletedItems")
	var items = allData["items"]
	var arrayOfItemObjs =  utils.dictToArray(items)
	
	var completedItemObj = utils.filterArray(arrayOfItemObjs, function(x){
		var labelsDict = x["labels"]
		var labelsArray = utils.dictToArray(labelsDict)
		var checkedLabels = utils.filterArray(labelsArray, function(x){
			return x["checked"]
		})
		var numberOfLabels = checkedLabels.length
		return numberOfLabels > 0		
	})
	var completedItemIds = utils.mapArray(completedItemObj, function (x){
		return x["id"]
	})
	
	var incompletedItemObj = utils.filterArray(arrayOfItemObjs, function(x){
		var labelsDict = x["labels"]
		var labelsArray = utils.dictToArray(labelsDict)
		var checkedLabels = utils.filterArray(labelsArray, function(x){
			return x["checked"]
		})
		var numberOfLabels = checkedLabels.length
		return numberOfLabels == 0		
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