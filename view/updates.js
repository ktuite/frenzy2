function handleUpdates(result){  
/*
    if("updatedItems" in result){
        var updatedItems = result["updatedItems"]
        handleUpdatedItems(updatedItems)
    }
	*/
    console.log("result")
	console.log(result)
    
	if("allItems" in result){
		items = result["allItems"]
	}
	if("itemIdOrder" in result){
		itemIdOrder = result["itemIdOrder"]
		displayFeed(itemIdOrder)		
	}
	if("queryResultObj" in result){
        queryResultObj = result["queryResultObj"]
        query = queryResultObj["query"]
		updateSearchFeedback(queryResultObj)
	}
	
    if("hierarchy" in result){
        var hierarchy = result["hierarchy"]
        handleUpdatedHierarchy(hierarchy)
    }
	
	if("completion" in result){
		var completion = result["completion"]
		handleUpdatedCompletion(completion)
	}

	if("sessions" in result){
		var sessions = result["sessions"]
		handleUpdatedSessions(sessions)
	}
    
}

//////////////////////////////////////////
// update items in feed
//////////////////////////////////////////
/*
function handleUpdatedItems(updatedItems){  
	var updatedItemObjs = []    
    for( var i in updatedItems){  
		
        var updatedItemObj = updatedItems[i]
        var id = updatedItemObj["id"]
        var lastUpdateTime = updatedItemObj["lastUpdateTime"]
        
		//push the item to the top of the stack in the order it is given to you
		//var newItemDiv = createItemAndReplyDiv(updatedItemObj)
		//newItemDivs.push(newItemDiv)	
        updatedItemObjs.push(updatedItemObj)
		
        //update the local data structure
        items[id] = updatedItemObj        
    }    
    displayFeed()
}
*/
function displayFeed(itemIds){
	//items is the recent items
	$("#feed").empty()     
	
    for( var i in itemIds){
		var itemId = itemIds[i]
		var itemObj = items[itemId]
		var newItemDiv = createItemAndReplyDiv(itemObj)        
        $("#feed").append(newItemDiv)
    }

	//from the query type, get which items to show.
	//get the order to display them in
}
/*
function pushNewItemDivsOnFeed(newItemDivs){
    $("#feed").empty()     
	
    for( var i in newItemDivs){
        var newItemDiv = newItemDivs[i]    
        $("#feed").append(newItemDiv)
    }
	updateSearchFeedback()	
}
*/

function updateSearchFeedback(queryResultObj){
	console.log("queryResultObj")
    console.log(queryResultObj)
    var query = queryResultObj["query"]
    var queryType = query["type"]
    var numResults = queryResultObj["numResults"]

    $("#searchFeedbackDiv").empty()
	
    var searchFeedbackContainer = $("<div>")
    
    var numResultsDiv = createNumResultsDiv(numResults)
    searchFeedbackContainer.append(numResultsDiv)
    
    var addLabelUI = createAddLabelUI(queryResultObj)
    searchFeedbackContainer.append(addLabelUI)
    
    $("#searchFeedbackDiv").append(searchFeedbackContainer)
    
    /*
    
	if(queryType == "all"){
		var numberOfItems = itemIdOrder.length
		searchFeedbackText = "Showing all items ("+numberOfItems+")"
	}
	if(queryType == "label"){
		var numberOfItems = itemIdOrder.length
		var label = query["label"]
		console.log(numberOfItems)
		searchFeedbackText = "Showing items labeled '"+label+"' ("+numberOfItems+")"
	}
	if(queryType == "session"){
		var numberOfItems = itemIdOrder.length
		var label = query["label"]
		console.log(numberOfItems)
		searchFeedbackText = "Showing items in session '"+label+"' ("+numberOfItems+")"
	}
	if(queryType == "completed"){
		var numberOfItems = itemIdOrder.length
		console.log(numberOfItems)
		searchFeedbackText = "Showing all items with at least one label ("+numberOfItems+")"
	}
	if(queryType == "incompleted"){
		var numberOfItems = itemIdOrder.length
		console.log(numberOfItems)
		searchFeedbackText = "Showing all items with no labels ("+numberOfItems+")"
	}
	
    var searchFeedbackUI = makeSearchFeedbackUI(query)
    
	//$("#searchFeedbackDiv").text(searchFeedbackText)
    */
    
    
}

function createNumResultsDiv(num){
    var numResultsDiv = $("<div class='numResults'>")
    var numResultsText = num+" Results"
    numResultsDiv.text(numResultsText)
    return numResultsDiv
}

function createAddLabelUI(queryResultObj){

    var div = $('<div>')
    
    var addLabelText = $("<span>")
    addLabelText.text("add label: ")
    div.append(addLabelText)
    
    
    var textbox = $('<input type="textbox">')
    div.append(textbox)
    var addButton = $('<button id="addButton">go</button>')
    addButton.click(function(){
        var textboxValue = textbox.val()
        updateNewLabelForQuery(textboxValue,itemIdOrder)
    })
    div.append(addButton)
    return div    
}


function updateNewLabelForQuery(textboxValue,itemIds){
    var addNewLabelUpdateForQuery = {
        type : "addLabelToItemsInQuery",
        time : getTime(),
        itemIds : itemIds , 
        labelText : textboxValue
    }
    pushAndPullUpdates(addNewLabelUpdateForQuery)
}

function handleUpdatedSessions(sessions){

}
/*
//DEPRICATED
//this was a way to only update new items rather than repost everything.
//the problem was that if you pressed refresh, all the items would go away :(
//Also
function handleUpdatedItems(updatedItems){       
    var newItemDivs = []    
    for( var i in updatedItems){  
		
        var updatedItemObj = updatedItems[i]
        var id = updatedItemObj["id"]
        var lastUpdateTime = updatedItemObj["lastUpdateTime"]
        if( id in items){
            updateExistingItemDiv(updatedItemObj)            
        }else{
            //push the item to the top of the stack in the order it is given to you
            var newItemDiv = createItemAndReplyDiv(updatedItemObj)
            newItemDivs.push({"div": newItemDiv, "lastUpdateTime": lastUpdateTime})
        }
        
        //update the local data structure
        items[id] = updatedItemObj        
    }
    
    pushNewItemDivsOnFeedInReverseTimeOrder(newItemDivs)
}

function updateExistingItemDiv(updatedItemObj){
    var newItemDiv = createItemAndReplyDiv(updatedItemObj)
    var itemId = updatedItemObj["id"]
	var itemAndReplyDivInternals = createItemAndReplyDivInternals(updatedItemObj)
    //itemAndReplyDiv.append(itemAndReplyDivInternals)
    $("#containerFor"+itemId).html(itemAndReplyDivInternals)
}

function pushNewItemDivsOnFeedInReverseTimeOrder(newItemDivs){
    newItemDivs.sort(function(a,b){return a["lastUpdateTime"] - b["lastUpdateTime"]})
    for( var i in newItemDivs){
        var newItemDiv = newItemDivs[i]["div"]        
        $("#feed").prepend(newItemDiv)
    }
}
*/



function updateNewLabel(textboxValue,itemId){
    var addNewLabelUpdate = {
        type : "addLabelToItem",
        time : getTime(),
        itemId : itemId , 
        labelText : textboxValue
    }
    pushAndPullUpdates(addNewLabelUpdate)
}

//////////////////////////////////////////
// hierarchy
//////////////////////////////////////////
function handleUpdatedHierarchy(hierarchy){
    var labelHierarchyDiv = $("<div>")
    for( var i in hierarchy){
        var labelObj = hierarchy[i]
        var newLabelDiv = createLabelDiv(labelObj)
        labelHierarchyDiv.append(newLabelDiv)        
    }
	$("#labelHierarchy").empty()
    $("#labelHierarchy").append(labelHierarchyDiv)
}

//////////////////////////////////////////
// sessions
//////////////////////////////////////////
function handleUpdatedSessions(sessionObjs){

    var sessionsDiv = $("<div>")
    for( var label in sessionObjs){
        var counts = sessionObjs[label].length
        var newLabelDiv = createSessionDiv(label, counts)
        sessionsDiv.append(newLabelDiv)        
    }
	$("#sessionSummary").empty()
    $("#sessionSummary").append(sessionsDiv)
}

function updateSession(session, itemId){

}


