var utils = require('./node-utils');

calculateCompletedItems = function(){
	var items = allData["items"]
	var arrayOfItemObjs =  utils.dictToArray(items)
	
	var completedItemObj = utils.filterArray(arrayOfItemObjs, function(x){
		var labelsDict = x["labels"]
		var numberOfLabels = Object.keys(labelsDict).length
		return numberOfLabels > 0		
	})
	var completedItemIds = utils.mapArray(completedItemObj, function (x){
		return x["id"]
	})
	
	var incompletedItemObj = utils.filterArray(arrayOfItemObjs, function(x){
		var labelsDict = x["labels"]
		var numberOfLabels = Object.keys(labelsDict).length
		return numberOfLabels == 0		
	})
	var incompletedItemIds = utils.mapArray(incompletedItemObj, function (x){
		return x["id"]
	})
	
	return {"completedItemIds":completedItemIds, "incompletedItemIds": incompletedItemIds}
	var completedItemIds = []
	
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