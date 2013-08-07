var utils = require('./node-utils');

hierarchy = []

updateHierarchy = function(){
    allData["hierarchy"] = createHierarchy()
    allData["hierarchyLastUpdated"] = getTime()
}

createHierarchy = function(){
    hierarchy = []
	var labelSummary = getOrderedArrayOfLabelObjs()
	var labelSummary = utils.filterArray(labelSummary, function(x){
        return x["memberItemIds"].length > 0
    })
    
	var allLabels = []
	for( i in labelSummary){
        var labelObject = labelSummary[i]
        allLabels.push({"label":labelObject, "parents":[]} )
    }
     
    orderAndEnchild(allLabels, allLabels);

    return hierarchy;
}

function getOrderedArrayOfLabelObjs(){
	var arrayOfLabelObjects = utils.dictToArray(allData["labelList"])

    //only push member items that are in allData["acceptedPapers"]
	var labelCountsArray = utils.mapArray(arrayOfLabelObjects, function(x){
        var itemsUsedBy = x["itemsUsedBy"]
        //filter itemsUsedBy by 
        var itemsUsedBy = utils.filterArray(itemsUsedBy, function(x){
            //console.log(allData["acceptedPapers"])
            //console.log(x)
            return utils.arrayContains(allData["acceptedPapers"], x)
        })
        
        var memberItemIds = []
        for (var i in itemsUsedBy){
            var memberItemId = itemsUsedBy[i]
            var thisItem = allData["items"][memberItemId]
            var thisItemsSession = thisItem["session"]
            if (thisItemsSession == "none"){
                memberItemIds.push(memberItemId)
            }
        }
    
        var userClass = 'nonSystemLabel'
        if (x["creator"] == "system"){
            userClass = 'systemLabel'
        }
        var counts = memberItemIds.length
        var labelText = x["label"]+ " ("+counts+")"
        var label = "<span class='"+userClass+"'>"+labelText+"<span>"
        
        
		return {    "label": label, 
                    "counts": memberItemIds.length, 
                    "memberItemIds": memberItemIds
        }
	})
    
    //Filter out the labels that have 0 members
    labelCountsArray = utils.filterArray(labelCountsArray, function(x){
        return x["counts"] > 0
    })
    
    labelCountsArray.sort(function(a,b){return b["counts"]-a["counts"]});

    return labelCountsArray
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
		
        
        var copiesOfChildrenOflargestLabel = []
        for(var i in childrenOflargestLabel){
            child = utils.clone(childrenOflargestLabel[i])
            child["parents"] = parentsForNewElts
            copiesOfChildrenOflargestLabel.push(child)
        }
        
        orderAndEnchild(copiesOfChildrenOflargestLabel, allHTags)
		
		//createOtherCategory
		
		/*
        if(copiesOfChildrenOflargestLabel.length > 0){     
            var parentMemberItemIds = largestLabel["label"]["memberItemIds"]
            for(var i in copiesOfChildrenOflargestLabel){
                var child = copiesOfChildrenOflargestLabel[i]
                var childMemberItems = child["label"]["memberItemIds"]
                //hierarchy.push("childMemberItems")
                //hierarchy.push( JSON.stringify(childMemberItems) )
                parentMemberItemIds = utils.arrayMinus(parentMemberItemIds, childMemberItems)
            }
            
            //hierarchy.push(parentMemberItemIds)
            //utils.arrayMinus
            //which items go in other?
            var otherLabelObj = {
                "label": "other ("+largestLabel["label"]["label"]+")",
                "counts": parentMemberItemIds.length,
                "memberItemIds": parentMemberItemIds
            }
            if(parentMemberItemIds.length > 0){
                var otherObj = {"label": otherLabelObj, "parents": parentsForNewElts}
                hierarchy.push(otherObj)
            }
        }
        */
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