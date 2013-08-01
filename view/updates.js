function handleUpdates(result){  
/*
    if("updatedItems" in result){
        var updatedItems = result["updatedItems"]
        handleUpdatedItems(updatedItems)
    }
	*/
    //console.log("result")
	//console.log(result)
    
    var type = result["type"]
    
	if("allItems" in result){
		items = result["allItems"]
	}
	
	if("labelList" in result){
		labelList = result["labelList"]
		autocompleteLabels = makeAutocompleteListFromKeys(labelList)
	}
	if("sessions" in result){
		var sessions = result["sessions"]
		autocompleteSessions = makeAutocompleteListFromKeys(sessions)
		handleUpdatedSessions(sessions)
	}
	
	if("itemIdOrder" in result){
		itemIdOrder = result["itemIdOrder"]
	}
	if("queryResultObj" in result){
        queryResultObj = result["queryResultObj"]
        query = queryResultObj["query"]
		
	}
	
    if("hierarchy" in result){
        var hierarchy = result["hierarchy"]
        handleUpdatedHierarchy(hierarchy)
    }
	
	if("completion" in result){
		var completion = result["completion"]
		handleUpdatedCompletion(completion)
	}
    

    
    //depending on the query type, either redisplay the all the Feed
    //or just update some items with yellow backgrounds.

    if(type == "synchronous"){
        displayFeed(itemIdOrder)
        updateSearchFeedback(queryResultObj)
    }
    if(type == "asynchronous"){
        //displayFeed(itemIdOrder)
        updateItemsInFeed()        
        //updateSearchFeedback(queryResultObj)
    }
	
}

function makeAutocompleteListFromKeys(lst){
	var allLabels = []

	for(var i in lst){
		allLabels.push(i)
	}

	return allLabels
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

function updateItemsInFeed(){
    //console.log("updateItemsInFeed")
    //for all the items being displayed in this query, go find them in the list of items, and see when the last time they 
    //have been updated is.
    //if it was recently, then go to that individual UI elt and color it yellow.
    for(var i in itemIdOrder){
        var itemId = itemIdOrder[i]
        var itemObj = items[itemId]
        var itemUpdateTime = itemObj["lastUpdateTime"]
        if(itemUpdateTime > lastUpdateTime){
            markItemAsUpdated(itemId)
        }
    }
    
    //go through the items on the screen and if any of them aren't updated, 
    //color it.
    var itemsInFeed = $(".item")
    $(".item").each(function(t){
        var itemId = $(this).attr("id")
        if( !arrayContains(itemIdOrder, itemId)){
            var container = $("#containerFor-"+itemId)
            if( ! $("#overlayFor-"+itemId).length){
                var cover = $("<div class='overlay' id='overlayFor-"+itemId+"' >")
            
                var itemUI = $("#containerFor-"+itemId)
                var currentHeight = itemUI.height() 
            
                var refreshMethodContainer = $("<div class='refreshDiv'>")
                var refreshMessage = $("<span>")
                refreshMessage.html("This item has been updated.")
                
                
                var refreshClick = $("<span class='refreshText'>")
                refreshClick.html("Refresh results.")
                refreshClick.click(function(){
                    getAllData("synchronous")
                })
                
                refreshMethodContainer.append(refreshMessage)
                refreshMethodContainer.append("<br>")
                refreshMethodContainer.append(refreshClick)
                cover.append(refreshMethodContainer)
                
                container.append(cover)
            }
        }
    })
}

function markItemAsUpdated(itemId){
    var itemUI = $("#containerFor-"+itemId)
    var currentHeight = itemUI.height() 
    console.log(itemUI)
    console.log("currentHeight")
    console.log(currentHeight)
    itemUI.height(currentHeight)
    itemUI.css('overflowY', 'auto');
    var itemObj = items[itemId]
    
    var itemAndReplyDivInternals = createItemAndReplyDivInternals(itemObj) 
    itemUI.empty()
    itemUI.append(itemAndReplyDivInternals)
    /*
    if(itemUI){
        itemUI.css("background-color", "yellow")
    }
    */
}


function displayFeed(itemIds){
	//items is the recent items
	$("#feed").empty()     
    
    var resultsUnderlay = $("<div id='resultsUnderlay'>")
    //resultsUnderlay.height(200)
	$("#feed").append(resultsUnderlay)
    
    var isQueryTypeText = (query["type"] == "text")
    
    for( var i in itemIds){
		var itemId = itemIds[i]
		var itemObj = items[itemId]
		var newItemDiv = createItemAndReplyDiv(itemObj)     
        $("#feed").append(newItemDiv)
        if(isQueryTypeText){
            $("#full-abstract-"+itemId).show()
            $("#short-abstract-"+itemId).hide()
        }else{
            $("#full-abstract-"+itemId).hide()
        }
        wrap = function(id){
            $("#more-abstract-"+id).click(function(){
                $("#short-abstract-"+id).hide()
                $("#full-abstract-"+id).show()
            })
            $("#less-abstract-"+id).click(function(){
                $("#short-abstract-"+id).show()
                $("#full-abstract-"+id).hide()
            })
        }
        wrap(itemId)
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
    console.log("updateSearchFeedback*******************")
    var query = queryResultObj["query"]
    var queryType = query["type"]
    var numResults = queryResultObj["numResults"]
    var querySortOrder = query["sortOrder"]
    
    $("#searchFeedbackDiv").empty()
	
    var searchFeedbackContainer = $("<div>")
    
    var numResultsDiv = createNumResultsDiv(numResults)
    
    var refreshButton = $("<input type='button' value='refresh'>")
    refreshButton.click(function(){
        getAllData("synchronous")
    })
    numResultsDiv.append(refreshButton)
    searchFeedbackContainer.append(numResultsDiv)
    
    //Sort options
    
    var sortOptions = $("<div id='sortOptions'>")
    sortOptions.append("Sort items by: <br>")
    var sortOptionStrings = [{"name":"creation time", "sortType": "creationTime"},{"name":"most active", "sortType": "mostActive"}, {"name":"least active",  "sortType": "leastActive"}]
    
    
    for(var sortOptionIndex in sortOptionStrings){
        var sortOptionString = sortOptionStrings[sortOptionIndex]["name"]
        var sortOptionSortType = sortOptionStrings[sortOptionIndex]["sortType"]
        //name='sortOption' value='"sortOptionString"'
        var sortRadio = $("<input type='radio'  name='sortOption' value='"+sortOptionSortType+"'>")
        if(sortOptionSortType == querySortOrder){
            sortRadio.prop("checked", true)
        }
        wrap = function(radioButton, sortIndex){
            radioButton.click(function(){
                
                var sortOrder = sortOptionStrings[sortIndex]["sortType"]
                query["sortOrder"] = sortOrder
                console.log(sortOrder)
                /*
                query = {
                    "type" : "label",
                    "label" : label,
                    "checked" : true,            
                    "sortOrder" : "creationTime"
                }
                */
                getAllData("synchronous")
            })
        }
        wrap(sortRadio, sortOptionIndex)
        
        sortOptions.append(sortRadio)
        sortOptions.append(sortOptionString+"<br>")
    }
    

    
    searchFeedbackContainer.append(sortOptions)
    
    /*
    var querySortOrder = query["sortOrder"]
    console.log("querySortOrder: "+querySortOrder)
    $('input:radio[value='+querySortOrder+']').prop("checked", true)
    */
    /*
    // MASS EDIT - removed for fear of the whole interface freaking out.
    
    var addLabelUI = createAddLabelUI(queryResultObj)
    searchFeedbackContainer.append(addLabelUI)
    
    var addSessionUI = createAddSessionUI(queryResultObj)
    searchFeedbackContainer.append(addSessionUI)
    
    var selectAllButton = $("<input type='button' value='select all results'>")
    
    searchFeedbackContainer.append(selectAllButton)
    selectAllButton.click(function(){
        $(".itemCheckbox").each(function(){
            $(this).prop('checked', true);
            //$(this).attr("checked","checked")
        })
    })
    
    var unselectAllButton = $("<input type='button' value='remove all selections'>")
    searchFeedbackContainer.append(unselectAllButton)
    unselectAllButton.click(function(){
        $(".itemCheckbox").each(function(){
            $(this).prop('checked', false);
            //$(this).removeAttr("checked")
        })
    })
    */
    $("#searchFeedbackDiv").append(searchFeedbackContainer)
    
    //adjust the underlay height
    var searchFeedbackHeight = $("#searchFeedbackDiv").height()
    console.log("searchFeedbackHeight: " + searchFeedbackHeight )
    $("#resultsUnderlay").height(searchFeedbackHeight + 20)
    
    
    
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
    if(num == 1){
        numResultsText = num+" Result"
    }
    var queryType = query["type"]
    
    if(queryType == "label"){
        var label = query["label"]
        numResultsText = numResultsText + " in '"+label+"'"
    }
    if(queryType == "session"){
        var label = query["label"]
        numResultsText = numResultsText + " in '"+label+"'"
    } 
    if(queryType == "text"){
        var text = query["text"]
        numResultsText = numResultsText + " containing '"+text+"'"
    }     
    
    if(queryType == "completed"){
		numResultsText = numResultsText + " completed"
	}
	if(queryType == "incompleted"){
        var status = " need work" 
        if(num == 1){
            status = " needs work" 
        }
		numResultsText = numResultsText + status
	}
    
    numResultsDiv.text(numResultsText)
    return numResultsDiv
}

	
function createAddLabelUI(queryResultObj){

    var div = $('<div>')
    
    var addLabelText = $("<span>")
    addLabelText.text("add label: ")
    div.append(addLabelText)
  
	var uiwidgetDiv = $('<span class="ui-widget">')
 
    
    var textbox = $('<input type="textbox">')
	textbox.autocomplete({
      source: autocompleteLabels
    });
	uiwidgetDiv.append(textbox)
    div.append(uiwidgetDiv)
    
     var addLabelText2 = $("<span>")
    addLabelText2.text("to all selected items ")
    div.append(addLabelText2)
	
    
    var addButton = $('<button id="addButton">go</button>')
    addButton.click(function(){
        var textboxValue = textbox.val()
        updateNewLabelForQuery(textboxValue,itemIdOrder)
    })
    div.append(addButton)
    return div    
}

function createAddSessionUI(queryResultObj){
    var div = $('<div>')
    
    var addLabelText = $("<span>")
    addLabelText.text("add to session: ")
    div.append(addLabelText)
    
    
    var uiwidgetDiv = $('<span class="ui-widget">')
 
    
    var textbox = $('<input type="textbox">')
	textbox.autocomplete({
      source: autocompleteSessions
    });
	uiwidgetDiv.append(textbox)
    
    div.append(uiwidgetDiv)
    
     var addLabelText2 = $("<span>")
    addLabelText2.text("to all selected items ")
    div.append(addLabelText2)
    
	
	
    var addButton = $('<button id="addButton">go</button>')
    addButton.click(function(){
        var textboxValue = textbox.val()
        updateNewSessionForQuery(textboxValue,itemIdOrder)
    })
    div.append(addButton)
    return div    
}

function getSelectedItemIds(){
    var selectedItemIds = []
    $('.itemCheckbox:checked').each(function() {
        selectedItemIds.push($(this).attr("id"));
    });
    console.log(selectedItemIds.length)
    console.log(selectedItemIds)
    return selectedItemIds 
}

function updateNewLabelForQuery(textboxValue,itemIds){
    //actually, just get the selected itemIds.
    var selectedItemIds = getSelectedItemIds()
    
    var addNewLabelUpdateForQuery = {
        type : "addLabelToItemsInQuery",
        time : getTime(),
        itemIds : selectedItemIds , 
        labelText : textboxValue
    }
    pushAndPullUpdates(addNewLabelUpdateForQuery, "synchronous")
}

function updateNewSessionForQuery(textboxValue,itemIds){
    var selectedItemIds = getSelectedItemIds()

    var addNewSessionUpdateForQuery = {
        type : "addSessionToItemsInQuery",
        time : getTime(),
        itemIds : selectedItemIds , 
        labelText : textboxValue
    }
    pushAndPullUpdates(addNewSessionUpdateForQuery, "synchronous")
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

function createSessionDiv(label, counts){
    var div = $("<div class='sessionClickable'>")
    div.text(label + " ("+counts+") ")
	
	div.click(function(){
		query = {
			"type" : "session",
			"label" : label,
            "sortOrder" : "creationTime"
		}
		getAllData("synchronous")
		//filterItemsByLabel(memberItemIds)
	})
	
    return div
}


