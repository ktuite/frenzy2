getQueryResultObj = function (query, numResults){
    var rtn = {}
    rtn["query"] = query
    rtn["numResults"] = numResults
    rtn["queryFeedback"] = getQueryFeedback(query, numResults)
    
    return rtn
}

getQueryFeedback = function(query, numResults){
    var feedback = {}

    var queryType = query["type"]
    if( queryType == "label"){
        var relevantLabels = getRelevantLabels(query)
        feedback["relevantLabels"] = relevantLabels
    }
    
    return feedback 
}

/*
{
    "type" : "text",
    "text" : searchText,        
    "sortOrder" : "creationTime"
}
*/
getRelevantLabels = function(query){
    var label = query["label"]
    
}