function handleUpdates(result){  

    try{

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
        if("sessions" in result){
            sessions = result["sessions"]		
            handleUpdatedSessions(sessions)
        }
        if("completion" in result){
            completion = result["completion"]
            handleUpdatedCompletion(completion)
        }
        if("labelList" in result){
            labelList = result["labelList"]
            handleUpdatedCategory(labelList)
            //createCategoryList()
        }

        
        if("itemIdOrder" in result){
            itemIdOrder = result["itemIdOrder"]
        }
        if("queryResultObj" in result){
            queryResultObj = result["queryResultObj"]
            query = queryResultObj["query"]		
        }
        /*
        if("hierarchy" in result){
            var hierarchy = result["hierarchy"]
            handleUpdatedHierarchy(hierarchy)
        }
        */

        
        if("sessionMaking" in result){
            sessionMaking = result["sessionMaking"]
            if(!sessionMaking){
                $("#sessionMakingRow").hide()
            }else{
                $("#sessionMakingRow").show()
            }
        }
        
        //depending on the query type, either redisplay the all the Feed
        //or just update some items with yellow backgrounds.

        if(type == "synchronous"){
            itemsInQueryIveChanged = [] //reset this state variable.
            displayFeed(itemIdOrder)
            updateHyperBar(queryResultObj)
        }
        if(type == "asynchronous"){
            updateItemsInFeed()
            updateHyperBar(queryResultObj)     
        }

  } catch(e) {
    console.log(e.stack)
  }	

}

function makeAutocompleteListFromKeys(lst){
	var allLabels = []

	for(var i in lst){
		allLabels.push(i)
	}
    
    allLabels.sort(function(a, b){
        var nameA = a.toLowerCase(), nameB = b.toLowerCase()
        if (nameA < nameB) {
            return -1 
        }
        if (nameA > nameB){
            return 1
        }
        return 0 
    });

	return allLabels
}

//////////////////////////////////////////
// update items in feed
//////////////////////////////////////////

function updateItemsInFeed(){
    // CHANGED ITEMS
    //for all the items being displayed in this query, go find them in the list of items, and see when the last time they 
    //have been updated is.
    //if it was recently, then go to that individual UI elt and color it yellow.
    console.log(itemsInQueryIveChanged)
    for(var i in itemIdOrder){        
        var itemId = itemIdOrder[i]
        var itemObj = items[itemId]
        var itemUpdateTime = itemObj["lastUpdateTime"]
        if(itemUpdateTime > lastUpdateTime){
                markItemAsUpdated(itemId, arrayContains(itemsInQueryIveChanged, itemId))            
        }
    }
    for(var i in itemsInQueryIveChanged){  
        var itemId = itemsInQueryIveChanged[i]
        var itemObj = items[itemId]
        var itemUpdateTime = itemObj["lastUpdateTime"]
        if(itemUpdateTime > lastUpdateTime){
            console.log("test2", "mine")
            markItemAsUpdated(itemId, true)
        }
    }    

    // DELETED ITEMS
    //go through the items on the screen and if any of them aren't updated, 
    //color it.
    var itemsInFeed = $(".item")
    var itemIdsNotFoundInFeed = itemIdOrder.slice(0) // copy the itemIdOrder array, because we're going to delete items from it as we see them on the scren
    $(".item").each(function(t){
        var itemId = $(this).attr("id")

        var p = itemIdsNotFoundInFeed.indexOf(itemId)
        if (p > -1) itemIdsNotFoundInFeed.splice(p, 1)

        if( !arrayContains(itemIdOrder, itemId) && !arrayContains(itemsInQueryIveChanged, itemId)){
            var container = $("#containerFor-"+itemId)
            if( ! $("#overlayFor-"+itemId).length){
                var cover = $("<div class='overlay' id='overlayFor-"+itemId+"' >")
            
                var itemUI = $("#containerFor-"+itemId)
                var currentHeight = itemUI.height() 
                var refreshMethodContainerPosition = currentHeight/2 - 20
            
                var refreshMethodContainer = $("<div class='refreshDiv'>")
                refreshMethodContainer.css("top", refreshMethodContainerPosition)
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
    
    // ADDED ITEMS
    // finally, look for items that aren't on the screen yet, and add them to the end of the feed
    //console.log("now we would add items " + itemIdsNotFoundInFeed)
    for (var i in itemIdsNotFoundInFeed) {
        var itemId = itemIdsNotFoundInFeed[i]
        appendItemToFeed(itemId)
    }
}

function markItemAsUpdated(itemId, myChange){
    var itemUI = $("#containerFor-"+itemId)
    var currentHeight = itemUI.height() 
    console.log(itemId, myChange)
    if (!myChange)
        itemUI.height(currentHeight)
    itemUI.css('overflowY', 'auto')
    var itemObj = items[itemId]
    
    var sessionUIDiv = $("#sessionUI-"+itemId)
    //console.log( $("#addSessionTextbox-"+itemId) )
    if ($("#addSessionTextbox-"+itemId).is(":focus")) {
        //alert('focus: '+itemId);
        console.log("don't update: "+itemId)
    }else{
        createAddSessionDiv(sessionUIDiv, itemObj)
    }
    
    //var itemAndReplyDivInternals = createItemAndReplyDivInternals(itemObj) 
    var inCategoriesDiv = $("#inCategoriesDiv-"+itemId)
    var itemObj = items[itemId]
    var labelObjDict = itemObj["labels"]
    
    clearCategories(inCategoriesDiv)
    appendCategories(inCategoriesDiv, itemId, labelObjDict)
    
    //old code from when we were updating the entire div
    //itemUI.empty()
    //itemUI.append(itemAndReplyDivInternals)
    //$("#short-abstract-"+itemId).show()
    //$("#full-abstract-"+itemId).hide()

}


function displayFeed(itemIds){
	//items is the recent items
	$("#feed").empty()     
    
    var resultsUnderlay = $("<div id='resultsUnderlay'>")
    //resultsUnderlay.height(200)
	$("#feed").append(resultsUnderlay)
    
    for( var i in itemIds){
		var itemId = itemIds[i]
        appendItemToFeed(itemId)
    }

	//from the query type, get which items to show.
	//get the order to display them in
}

function appendItemToFeed(itemId) {
    var isQueryTypeText = (query["type"] == "text")
    
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

function createNumResultsDiv(num){
    var numResultsDiv = $("<div class='numResults'>")
    var numResultsText = num+" Items"
    if(num == 1){
        numResultsText = num+" Item"
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


//////////////////////////////////////////
// hierarchy
//////////////////////////////////////////
/*
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
*/
//////////////////////////////////////////
// sessions
//////////////////////////////////////////
function handleUpdatedSessions(sessionObjs){
    autocompleteSessions = makeAutocompleteListFromKeys(sessions)

    var sortType = $('#sessionSort').val()
    displaySessionsSorted(sortType)

}

function displaySessionsSorted(sortType){
    var sessionsDiv = $("<div>")
    var sessionsArray = dictToArray(sessions)
    sortSessions(sessionsArray, sortType)
    
    for(var i in sessionsArray){
        var sessionObj = sessionsArray[i]
        var label = sessionObj["label"]
        var counts = sessionObj["numMembers"]
        var newLabelDiv = createSessionDiv(label, counts)
        sessionsDiv.append(newLabelDiv)        
    }
	$("#sessionSummary").empty()
    $("#sessionSummary").append(sessionsDiv)
}

function sortSessions(sessionsArray, sortType){
    if(sortType == "mostItems"){
        sessionsArray.sort(function(a,b){
            return b["numMembers"] - a["numMembers"]
        })
    }
    if(sortType == "leastItems"){
        sessionsArray.sort(function(a,b){
            return a["numMembers"] - b["numMembers"]
        })
    }
    if(sortType == "az"){
        sessionsArray.sort(function(a, b){
         var nameA=a["label"].toLowerCase(), nameB=b["label"].toLowerCase()
         if (nameA < nameB) //sort string ascending
          return -1 
         if (nameA > nameB)
          return 1
         return 0 //default return value (no sorting)
        });
    }
    if(sortType == "za"){
        sessionsArray.sort(function(a, b){
         var nameA=a["label"].toLowerCase(), nameB=b["label"].toLowerCase()
         if (nameA > nameB) //sort string ascending
          return -1 
         if (nameA < nameB)
          return 1
         return 0 //default return value (no sorting)
        });
    }

}

function createSessionDiv(label, counts){
    var div = $("<div>")

    var span = $("<span class='sessionLabel clickable'>")
    span.text(label + " ("+counts+") ")
	div.append(span)

	span.click(function(){
		query = {
			"type" : "session",
			"label" : label,
           /* "labels" : [label],*/
            "sortOrder" : "mostItems"
		}
		getAllData("synchronous")
	})
	
    if (label != "none") {
        div.append(makeRenameButton("session", label));
    }
    
    return div
}

//////////////////////////////
// Create Category List
//////////////////////////////
function handleUpdatedCategory(labelList){
    autocompleteLabels = makeAutocompleteListFromKeys(labelList)
    var sortType = $('#categoriesSort').val()
    displayCategoriesSorted(sortType)    
}

/*
"Virtual Worlds/Avatars/Proxies": {
      "itemsUsedBy": [
        "cscw356",
        "cscw490",
        "cscw602",
        "cscw625",
        "cscw637"
      ],
      "creator": "system",
      "creationTime": 0,
      "user": "cscw",
      "label": "Virtual Worlds/Avatars/Proxies"
    }

*/
function displayCategoriesSorted(sortType){
    var labelHierarchyDiv = $("<div>")
    var labelsArray = dictToArray(labelList)
    sortLabels(labelsArray, sortType)
    
    var closedCategories = []
    for(var i in labelsArray){
        var labelObj = labelsArray[i]   
        var counts = labelObj["itemsUsedBy"].length   
        if(counts > 0){    
            var creationOfCategoryLabelDiv = createCategoryLabelDiv(labelObj)
            var newLabelDiv = creationOfCategoryLabelDiv["div"]
            var numItemsInSession = creationOfCategoryLabelDiv["numItemsInSession"]
            labelHierarchyDiv.append(newLabelDiv) 
            /*
            if(numItemsInSession == counts){
                closedCategories.push(labelObj)
            }else{
                labelHierarchyDiv.append(newLabelDiv)   
            } */           
        }        
    }
    /*
    for(var i in closedCategories){
        var labelObj = closedCategories[i]   
        var counts = labelObj["itemsUsedBy"].length  
        
        var creationOfCategoryLabelDiv = createCategoryLabelDiv(labelObj, true)
        var newLabelDiv = creationOfCategoryLabelDiv["div"]
        
        labelHierarchyDiv.append(newLabelDiv)   
                        
                
    }
    */
	$("#labelHierarchy").empty()
    $("#labelHierarchy").append(labelHierarchyDiv)
}

function getItemsInSessions(){
    var itemsInSessions = []
    var itemsNotInSessions = []
    
    for(var itemId in items){
        var itemObj = items[itemId]
        var session = itemObj["session"]
        if(session == "none"){
            itemsNotInSessions.push(itemId)
        }else{
            itemsInSessions.push(itemId)
        }
    }
    return {"itemsInSessions":itemsInSessions, "itemsNotInSessions":itemsNotInSessions}
}

function sortLabels(labelsArray, sortType){
    if(sortType == "mostItems"){
        labelsArray.sort(function(a,b){
            return b["itemsUsedBy"].length - a["itemsUsedBy"].length
        })
    }
    if(sortType == "leastItems"){
        labelsArray.sort(function(a,b){
            return a["itemsUsedBy"].length - b["itemsUsedBy"].length
        })
    }
    if(sortType == "az"){
        labelsArray.sort(function(a, b){
         var nameA=a["label"].toLowerCase(), nameB=b["label"].toLowerCase()
         if (nameA < nameB) //sort string ascending
          return -1 
         if (nameA > nameB)
          return 1
         return 0 //default return value (no sorting)
        });
    }
    if(sortType == "za"){
        labelsArray.sort(function(a, b){
         var nameA=a["label"].toLowerCase(), nameB=b["label"].toLowerCase()
         if (nameA > nameB) //sort string ascending
          return -1 
         if (nameA < nameB)
          return 1
         return 0 //default return value (no sorting)
        });
    }
    if(sortType == "leastSessionNeeded"){
        var sessionMembership = getItemsInSessions()
        var itemsInSessions = sessionMembership["itemsInSessions"]
        var itemsNotInSessions = sessionMembership["itemsNotInSessions"]
    
        labelsArray.sort(function(a,b){
            var aMembers = a["members"]
            var bMembers = b["members"]
            
            var aItemsWithoutSessions = arrayIntersection(aMembers, itemsNotInSessions)
            var bItemsWithoutSessions = arrayIntersection(bMembers, itemsNotInSessions)
        
            return aItemsWithoutSessions.length - bItemsWithoutSessions.length
        })
    }
    if(sortType == "mostSessionNeeded"){
        sessionsArray.sort(function(a,b){
            return a["numMembers"] - b["numMembers"]
        })
    }
}

function createCategoryLabelDiv(labelObj){
    var label = labelObj["label"]
    var counts = labelObj["itemsUsedBy"].length
    var creator = labelObj["creator"]
    var div = $("<div>")
    
    var numItemsNotInSession = 0
    if(sessionMaking){
        var itemsInSession = []
        var itemsInNoSession = sessions["none"]["members"]
        var members = labelObj["itemsUsedBy"]
        for(var itemIdIndex in members){
            var memberItemId = members[itemIdIndex]
            if( !arrayContains(itemsInNoSession, memberItemId) ){
                itemsInSession.push(memberItemId)
            }
        }
        numItemsInSession = itemsInSession.length
        numItemsNotInSession = counts - numItemsInSession
        if( numItemsNotInSession> 0){
            counts = "<span class='numSessionsDisplay'>"+numItemsNotInSession+"</span> / "+counts
        }else{
            counts = "<span class=''>"+numItemsNotInSession+"</span> / "+counts
        }
    }else{
        var itemsWithPlusOne = []
        var itemsCompleted = completion["completedItemIds"]
        var members = labelObj["itemsUsedBy"]
        for(var itemIdIndex in members){
            //figure out if this item has plus one
        
            var memberItemId = members[itemIdIndex]
            if( arrayContains(itemsCompleted, memberItemId) ){
                itemsWithPlusOne.push(memberItemId)
            }
        }
        var numItemsWithPlusOne = itemsWithPlusOne.length
        counts = "<span class='numSessionsDisplay'>"+numItemsWithPlusOne+"</span> / "+counts        
    }
    
    var labelSpan = $("<span class='clickable'>")
    labelSpan.html(label + " ("+counts+") ")
    /*
    if(creator == "system"){
        labelSpan.addClass("systemLabel")
    }else{
        labelSpan.addClass("nonSystemLabel")
    }
    */
    
            
    if(numItemsNotInSession == 0){
        labelSpan.addClass("completedCategory")
        //createCategoryLabelDiv.removeClass("numSessionsDisplay")
    }
    
    if (labelObj["itemsUsedBy"].length <= 1) {
        labelSpan.addClass("singletonLabel")
    } else {
        labelSpan.addClass("nonSingletonLabel")        
    }

    div.append(labelSpan)

    labelSpan.click(function(){
        query = {
            "type" : "label",
            "label" : label,
            "checked" : true,            
            "labels" : [label],
            "sortOrder" : "creationTime"
        }
        getAllData("synchronous")
    })

    div.append(makeRenameButton("label", label))	
	
    return {"div":div, "numItemsInSession":numItemsInSession}
}

function makeRenameButton(kindOfName, // must be either "session" or "label"
                          oldName // name of session or label that will be renamed by the button
                          ) {
    var variants = {
        "label": { uiName: "category", queryType: "renameLabel", getExistingNames: function() { return labelList } },
        "session": { uiName: "session", queryType: "renameSession", getExistingNames: function() { return sessions } },
    };

    var renameButton = $('<span class="pencil-icon clickable"></span>')

    renameButton.click(function() {
        promptForName = function() {
            var newName = window.prompt("Rename this " + variants[kindOfName].uiName + ":", oldName)
            if (!newName   // null return value means user cancelled
                || !(newName.trim()) // blank names are a bad idea
                || oldName == newName) {
                return undefined;  // change nothing
            }

            if (newName in variants[kindOfName].getExistingNames()) {
                window.alert(oldName + " is already the name of another " + variants[kindOfName].uiName);
                return promptForName(); // try again
            }
            return newName;
        }

        var newName = promptForName();
        if (!newName) return
            
        console.log("renaming " + oldName + " to " + newName)

        var myUpdate = {"type": variants[kindOfName].queryType,
                    "time" : getTime(),
                    "oldName" : oldName, 
                    "newName": newName
        }
        pushAndPullUpdates(myUpdate, "synchronous")
    })    

    return renameButton
}

function updateNewLabel(textboxValue, itemId){
    $("#addCategoryTextbox-"+itemId).val("")
    if(! arrayContains(autocompleteLabels, textboxValue)){
    
        autocompleteLabels.push(textboxValue)
        
        autocompleteLabels.sort(function(a, b){
            var nameA = a.toLowerCase(), nameB = b.toLowerCase()
            if (nameA < nameB) {
                return -1 
            }
            if (nameA > nameB){
                return 1
            }
            return 0 
        });
            
        for(var index in itemIdOrder){
            
            var itemIdPrime = itemIdOrder[index]
            
            wrap = function(id, lst){
                $('#addCategoryTextbox-'+id).autocomplete("option", { source: lst });
            }
            wrap(itemIdPrime, autocompleteLabels)
        }
    }    
    $("#addCategoryTextbox-"+itemId).val("")
    
    itemsInQueryIveChanged.push(itemId)
    
    var addNewLabelUpdate = {
        type : "addLabelToItem",
        time : getTime(),
        itemId : itemId , 
        labelText : textboxValue
    }
    
    pushAndPullUpdates(addNewLabelUpdate, "asynchronous")
}

