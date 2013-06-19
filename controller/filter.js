var utils = require('./node-utils');

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