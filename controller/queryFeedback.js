var utils = require('./node-utils');

/*
query = {
    "type" : "text",
    "text" : searchText,        
    "sortOrder" : "creationTime"
}

query = {
    "type" : "label",
    "label" : label,
    "checked" : true,            
    "sortOrder" : "creationTime"
}

query = {
    "type" : "all",      
    "sortOrder" : "creationTime"
}

query = {
    "type" : "completed",
    "checked" : true,
    "sortOrder" : "creationTime"
}

query = {
    "type" : "session",
    "label" : label,
    "sortOrder" : "mostItems"
}
*/

/*
    query["extraQueryParameters"] = "initialize"
*/

getQueryResultObj = function (query, itemIdOrder){
    var rtn = {}
    rtn["query"] = query
    rtn["numResults"] = itemIdOrder.length
    
    if( query["extraQueryParameters"] == "initialize" ){
        rtn["queryFeedbackObj"] = initializeQueryFeedbackObj(query, itemIdOrder)     
    }else{
        //WORK HERE
    }
    
    return rtn
}

initializeQueryFeedbackObj = function(query, itemIdOrder){
    var queryType = query["type"]
    
    var queryFeedbackObject = {}
    if(queryType == "label"){
        var label = query["label"]
        queryFeedbackObject["sessionsDisplayed"] = initializeSessionsDisplayedForLabel(label, itemIdOrder)
        queryFeedbackObject["labelFeedback"] = initializeLabelFeedbackForLabel(label, itemIdOrder)
        queryFeedbackObject["sessionFeedback"] = initializeSessionFeedbackForLabel(label, itemIdOrder)
    }
    if(queryType == "session"){
        //WORK HERE
        console.log("error - not implemented: queryFeedback for session")
    }
    if(queryType == "text"){
        //WORK HERE
        console.log("error - not implemented: queryFeedback for text")
    }
    if(queryType == "all"){
        //WORK HERE
        console.log("error - not implemented: queryFeedback for all")
    }
    if(queryType == "completed"){
        //WORK HERE
        console.log("error - not implemented: queryFeedback for completed")
    }
    /*
    if(queryType == "incompleted"){
        //WORK HERE
        console.log("error - not implemented: queryFeedback for completed")
    }
    */
    return queryFeedbackObject
}


/////////////////////////////////
// Sessions Displayed
/////////////////////////////////

//For a given label, find out how many items are in sessions, and are not in sessions
initializeSessionsDisplayedForLabel = function(label, itemIdOrder){
    //WORK HERE
}

/////////////////////////////////
// Label Feedback
/////////////////////////////////

//for a given label, find the overlapping labels and the size of the overlap 
initializeLabelFeedbackForLabel = function(label, itemIdOrder){
    var initialSortOrder = "mostItems"    
    var labelFeedback = {
        "sortOrder" : initialSortOrder,
        "overlappingLabels": []
    }
    var overlappingLabels = findOverlappingLabels(itemIdOrder)
    sortOverlappingLabels(overlappingLabels, initialSortOrder)
    labelFeedback["overlappingLabels"] = overlappingLabels
    
    return labelFeedback
}

/*
overlappingLabels = [
    {
        "label": "Education",
        "overlappingItemIds" : ["cscw123", "cscw321"]
    }
]

*/
findOverlappingLabels = function(itemIdOrder){
    var overlappingLabels = []
    
    //for all labels, find out the number of labels all
    for(var label in allData["labelList"]){
        var labelObj = allData["labelList"][label]
        var itemsUsedByLabel = labelObj["itemsUsedBy"]
        
        var overlappingItemIds = utils.arrayIntersection(itemIdOrder, itemsUsedByLabel)
        if( overlappingItemIds.length > 0 ){
            overlappingLabels.push(
                {
                    "label" : label,
                    "overlappingItemIds" : overlappingItemIds
                }        
            )
        }
    }
    return overlappingLabels
}

sortOverlappingLabels = function(overlappingLabels, sortOrder){
    if(sortOrder == "mostItems"){
        overlappingLabels.sort(function(a,b){
            return b["overlappingItemIds"].length - a["overlappingItemIds"].length
        })
    }
    if(sortOrder == "leastItems"){
        overlappingLabels.sort(function(a,b){
            return a["overlappingItemIds"].length - b["overlappingItemIds"].length
        })
    }
    if(sortOrder == "az"){
        overlappingLabels.sort(function(a, b){
         var nameA=a["label"].toLowerCase(), nameB=b["label"].toLowerCase()
         if (nameA < nameB) //sort string ascending
          return -1 
         if (nameA > nameB)
          return 1
         return 0 //default return value (no sorting)
        });
    }
    if(sortOrder == "za"){
        overlappingLabels.sort(function(a, b){
         var nameA=a["label"].toLowerCase(), nameB=b["label"].toLowerCase()
         if (nameA > nameB) //sort string descending
          return -1 
         if (nameA < nameB)
          return 1
         return 0 //default return value (no sorting)
        });
    }

}



initializeSessionFeedbackForLabel = function(label, itemIdOrder){
    //WORK HERE
}
