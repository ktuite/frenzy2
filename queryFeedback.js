function getQueryResultObj(query, numResults){
    var rtn = {}
    rtn["query"] = query
    rtn["numResults"] = numResults
    rtn["queryFeedback"] = getQueryFeedback(query, numResults)
    
    return rtn
}

function getQueryFeedback(query, numResults){
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
function getRelevantLabels(query){
    var label = query["label"]
    
}