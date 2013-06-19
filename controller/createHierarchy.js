var utils = require('./node-utils');

hierarchy = []

createHierarchy = function(){
	var LabelSummary = getOrderedArrayOfLabels()
	
	var allLabels = []
	for( i in LabelSummary){
        var LabelObject = LabelSummary[i]
        allLabels.push({"label":LabelObject, "parents":[]} )
    }
     
    orderAndEnchild(allLabels, allLabels);

   return hierarchy;
}

function getOrderedArrayOfLabels(){
	var arrayOfLabelObjects = utils.dictToArray(allData["labelList"])
	var LabelCountsArray = utils.mapArray(arrayOfLabelObjects, function(x){
		return {"label": x["label"], "counts":x["itemsUsedBy"].length, "memberItemIds": x["itemsUsedBy"]}
	})
    
    LabelCountsArray.sort(function(a,b){return b["counts"]-a["counts"]});

    return LabelCountsArray
}

function orderAndEnchild(LabelArray, allHTags){
    var sortedLabelArray = LabelArray.sort(function(a,b){return b["label"]["memberItemIds"].length - a["label"]["memberItemIds"].length});
    
	//push all the labelObjects on the queue
    var queue = []
    for( i in sortedLabelArray ){
        var LabelObj = sortedLabelArray[i]
        queue.push(LabelObj)
    }
    
	//while there are still items on the queue
    while( queue.length > 0 ){
		//PUT THE LARGEST LABEL IN THE HIERARCHY
        var largestLabel = queue[0]
        var largestLabelId = largestLabel["label"]["label"]
        hierarchy.push(largestLabel)
		
        //remove largestLabel from the array
        var index = queue.indexOf(largestLabel);
        var eltToSplice = queue.splice(index, 1)
        
        var lookForChildrenLabels = []
        
        for(var i in sortedLabelArray){
            var elt = sortedLabelArray[i]
            if (elt != largestLabel){
                lookForChildrenLabels.push(elt)
            }
        }
        
        //FIND ALL CHILDREN OF THE LABEL
        var childrenOflargestLabel = utils.filterArray(lookForChildrenLabels, function(x){return isChildOfArray(largestLabel["label"]["memberItemIds"], x["label"]["memberItemIds"])})
        //remove them from the queue
        for(var i in childrenOflargestLabel){
            var elt = childrenOflargestLabel[i]
            //remove elts from queue
            var index = queue.indexOf(elt);
            if(index > -1){
                var eltToSplice2 = queue.splice(index, 1);
                //Note: we only want to remove it from the queue if it isn't already been removed (this happens when you have 
                //a Label that is the child of two parents.  The first time it gets enchilded, it is removed, the second time
                //it is enchilded, you can't remove it (it isn't in the queue anymore)
            }
        }
        //operate on all children
        //CHANGE THEIR PARENTAGE - I NEED COPIES
        //add parents to the children AND recurse into them
        
        var parentsParents = largestLabel["parents"]
        var parentsForNewElts = []
        for(var i in parentsParents){
            var parentParent = parentsParents[i]
            parentsForNewElts.push(parentParent)
        }
        parentsForNewElts.push(largestLabelId)
		
        
        copiesOfChildrenOflargestLabel = []
        for(var i in childrenOflargestLabel){
            child = utils.clone(childrenOflargestLabel[i])
            child["parents"] = parentsForNewElts
            copiesOfChildrenOflargestLabel.push(child)
        }
        
        orderAndEnchild(copiesOfChildrenOflargestLabel, allHTags)
		
		//createOtherCategory
		var parentMemberItemIds = largestLabel["label"]["memberItemsIds"]
		hierarchy.push("OTHER"+largestLabel)
		
		for(var i in copiesOfChildrenOflargestLabel){
            var child = copiesOfChildrenOflargestLabel[i]
            var childMemberItem = child["label"]["memberItemsIds"]
        }
		//which items go in other?
    }

}

function isChildOfArray(arr1, arr2){    
    rtn = true
    //all the elts of arr2 are in arr1
    for(i in arr2){
        elt2 = arr2[i]
        if (arr1.indexOf(elt2) == -1){
            rtn = false
        }
    }
    
    return rtn
}