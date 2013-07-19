var utils = require('./node-utils');

updateTFIDF = function(){
    allData["tfidf"] = createTFIDF()
    allData["tfidfLastUpdated"] = getTime()
}

/*
	allData["tfidf"] = {
		"idf" :{
			"item0": |labels| / (# labels that have this item),
			"item1": |labels| / (# labels that have this item)
		},
		"tf":{
			"item0":{
				"label1":{
					"labelItemFrequency": 1, #does this label contain this item
					"tfidf": .333				
				},
				"label2":{
					"labelItemFrequency": 1, #does this label contain this item
					"tfidf": .333				
				},
			}
		}
	}
	
*/
function createTFIDF(){
	tfidfMatrix={
		"idf":{},
		"tf":{}
	}

	var numLabels = Object.keys(allData["labelList"]).length
	//for all items
	
	//Calculate IDF
	for(var itemId in allData["items"]){
		var itemObj = allData["items"][itemId]
		var numLabelsForObj = Object.keys(itemObj["labels"]).length 
		var idf = 0
		if(numLabels > 0){
			var innerTerm = numLabels / (1+numLabelsForObj)
			idf = Math.log(innerTerm)
		}
		tfidfMatrix["idf"][itemId] = idf
		tfidfMatrix["tf"][itemId] = {}
		
		// # labels
		for(var label in allData["labelList"]){
			tfidfMatrix["tf"][itemId][label] = {}
			
			//number of labels that have this item
			var bool = 0
			var itemsForCategory = allData["labelList"][label]["itemsUsedBy"]
			var numItemsForCategory = itemsForCategory.length
			if(utils.arrayContains(itemsForCategory, itemId)){	
				bool = 1.0/numItemsForCategory
			}
			tfidfMatrix["tf"][itemId][label]["labelItemFrequency"] = bool
			
			var tfidf = 0
			if(idf > 0 ){
				tfidf = bool * idf
			}
			tfidfMatrix["tf"][itemId][label]["tfidf"] = tfidf
		}
	}
	
	return tfidfMatrix
	
}
rankLabelsForTargetLabel = function(targetLabel){
	var itemsForTargetLabel = allData["labelList"][targetLabel]["itemsUsedBy"]
	var lsaForOtherLabels = []
	for(thisLabel in allData["labelList"]){
		if(thisLabel != targetLabel){
			var itemsForThisLabel = allData["labelList"][thisLabel]["itemsUsedBy"]
			var sum = 0
			for(i in itemsForTargetLabel){ //items with label targetLabel
				var itemId = itemsForTargetLabel[i]				
				if (utils.arrayContains(itemsForThisLabel, itemId)){									
					var tfidf = allData["tfidf"]["tf"][itemId][thisLabel]["tfidf"]
					sum += tfidf
					
				}
				//otherwise itemId is 0
			}
			lsaForOtherLabels.push({
				"label": thisLabel,
				"lsa": sum
			})
		}
	}
	//sort otherLabels by highest lsa and return
	lsaForOtherLabels.sort(function(a,b){return b["lsa"]-a["lsa"]});
	
	return lsaForOtherLabels
}