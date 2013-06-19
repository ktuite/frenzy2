var utils = require('./node-utils');

hierarchy = []

createHierarchy = function(){
	var hashtagSummary = getOrderedArrayOfLabels()
	
	var allHashtags = []
	for( i in hashtagSummary){
        var hashtagObject = hashtagSummary[i]
        allHashtags.push({"label":hashtagObject, "parents":[]} )
    }
     
    orderAndEnchild(allHashtags, allHashtags);

   return hierarchy;
}

function getOrderedArrayOfLabels(){
	var arrayOfLabelObjects = utils.dictToArray(allData["labelList"])
	var hashtagCountsArray = utils.mapArray(arrayOfLabelObjects, function(x){
		return {"label": x["label"], "counts":x["itemsUsedBy"].length, "memberItemIds": x["itemsUsedBy"]}
	})
    
    hashtagCountsArray.sort(function(a,b){return b["counts"]-a["counts"]});

    return hashtagCountsArray
}
function orderAndEnchild(hashtagArray, allHTags){
    var sortedHashtagArray = hashtagArray.sort(function(a,b){return b["label"]["memberItemIds"].length - a["label"]["memberItemIds"].length});
    
    var queue = []
    for( i in sortedHashtagArray ){
        var hashtagObj = sortedHashtagArray[i]
        queue.push(hashtagObj)
    }
    
    while( queue.length > 0 ){
        var largestHashtag = queue[0]
        var largestHashtagId = largestHashtag["label"]["label"]
        hierarchy.push(largestHashtag)
        //remove largestHashtag from the array
        var index = queue.indexOf(largestHashtag);
        var eltToSplice = queue.splice(index, 1)
        
        var lookForChildrenHashtags = []
        
        for( i in sortedHashtagArray){
            var elt = sortedHashtagArray[i]
            if (elt != largestHashtag){
                lookForChildrenHashtags.push(elt)
            }
        }
        
        //find all the children of this hashtag
        var childrenOflargestHashtag = utils.filterArray(lookForChildrenHashtags, function(x){return isChildOfArray(largestHashtag["label"]["memberItemIds"], x["label"]["memberItemIds"])})
        //remove them from the queue
        for( i in childrenOflargestHashtag){
            var elt = childrenOflargestHashtag[i]
            //remove elts from queue
            var index = queue.indexOf(elt);
            if(index > -1){
                var eltToSplice2 = queue.splice(index, 1);
                //Note: we only want to remove it from the queue if it isn't already been removed (this happens when you have 
                //a hashtag that is the child of two parents.  The first time it gets enchilded, it is removed, the second time
                //it is enchilded, you can't remove it (it isn't in the queue anymore)
            }
        }
        //operate on all children
        //CHANGE THEIR PARENTAGE - I NEED COPIES
        //add parents to the children AND recurse into them
        
        var parentsParents = largestHashtag["parents"]
        var parentsForNewElts = []
        for( i in parentsParents){
            var parentParent = parentsParents[i]
            parentsForNewElts.push(parentParent)
        }
        parentsForNewElts.push(largestHashtagId)
        
        copiesOfChildrenOflargestHashtag = []
        for( i in childrenOflargestHashtag){
            child = utils.clone(childrenOflargestHashtag[i])
            child["parents"] = parentsForNewElts
            copiesOfChildrenOflargestHashtag.push(child)
        }
        
        orderAndEnchild(copiesOfChildrenOflargestHashtag, allHTags)
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