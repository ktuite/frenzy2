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



getQueryResultObj = function (query, numResults){
    var rtn = {}
    rtn["query"] = query
    rtn["numResults"] = numResults
    //rtn["queryFeedback"] = getQueryFeedback(query, numResults)
    
    return rtn
}

/*
getQueryFeedback = function(query, numResults){
    var feedback = {}

    var queryType = query["type"]
    if( queryType == "label"){
        var relevantLabels = getRelevantLabels(query)
        feedback["relevantLabels"] = relevantLabels
    }
    if( queryType == "session"){
        var relevantLabels = getRelevantLabels(query)
        feedback["relevantLabels"] = relevantLabels
    }
    
    return feedback 
}
*/
/*
{
    "type" : "text",
    "text" : searchText,        
    "sortOrder" : "creationTime"
}
*/
/*
getRelevantLabels = function(query){
    var label = query["label"]
    
}
*/