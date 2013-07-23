var utils = require('./node-utils');

updateSessions = function(){
    allData["sessions"] = createSessions()
    allData["sessionsLastUpdated"] = getTime()
}
/*
Sessions Are denoted in two places.

item["session"] = "label"
item["labels"][label] = 

item0 = {
	"id": "item0",
    "html": "<b>item0 meow</b>",
	"replies" : [],
	"replyCounter" : 0,
	"lastUpdateTime" : 12344555,
	"creationTime": 0, 
	"labels": {},
	"session": ""
}
allData["items"]["item0"] = item0

label1Ref = {
	"label": "animal",
	"checked": true,
	"session": false,
	"likes" : [],
	"dislikes" : [],
	"lastUpdateTime" : 123456789
}
allData["items"]["item0"]["labels"]["animal"] = label1Ref
*/
createSessions = function(){
	sessions = {}
	allItems = allData["items"]
	for( var i in allItems){
		var itemObj = allItems[i]
		var id = itemObj["id"]
		var session = itemObj["session"]
		//console.log(itemObj)
		if(id in sessions){
			sessions[session].push(id)
		}else{
			sessions[session] = [id]
		}
	}
	//console.log(sessions)
	return sessions
}

/*
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
	var labelCountsArray = utils.mapArray(arrayOfLabelObjects, function(x){
		return {"label": x["label"], "counts":x["itemsUsedBy"].length, "memberItemIds": x["itemsUsedBy"]}
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
}*/