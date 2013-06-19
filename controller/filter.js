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