function updateHyperBar(queryResultObj){
    console.log(queryResultObj)
    var queryObj = queryResultObj["query"]
    var queryType = queryObj["type"]
    var numResults = queryResultObj["numResults"]
    var querySortOrder = queryObj["sortOrder"]
    var queryFeedbackObj = queryResultObj["queryFeedbackObj"]
    
    $("#searchFeedbackDiv").empty()
	
    var searchFeedbackContainer = $("<div>")
    
    //Number of Results and type of results text
    var numResultsDiv = createNumResultsDiv(numResults)
    searchFeedbackContainer.append(numResultsDiv)
    searchFeedbackContainer.append("<br>")
    
    var table = $("<table>")
    var tr = $("<tr valign='top'>")
    var td1 = $("<td width='260px'>")
    var td2 = $("<td width='400px'>")
    var td3 = $("<td width='100px'>")
    table.append(tr)
    tr.append(td1)
    tr.append(td2)
    tr.append(td3)
    searchFeedbackContainer.append(table)
    
    //Button Panel - refresh
    var buttonDiv = $("<div id='hyperbarButtonDiv'>")
    td3.append(buttonDiv)
    //Refresh button
    var refreshButton = createRefreshButton()    
    buttonDiv.append(refreshButton)
    buttonDiv.append("<br>")
    
    //Button panel - expand, collapse
    var abstractButtons = setUpAbstractHideShow()
    var expandAbstractionButton = abstractButtons[0]
    var collapseAbstractionButton = abstractButtons[1]
    buttonDiv.append(expandAbstractionButton)
    buttonDiv.append("<br>")
    buttonDiv.append(collapseAbstractionButton)
    
    
    //Sort options
    if( !sessionMaking){
        var sortOptions = createSortOptions(querySortOrder)
        //searchFeedbackContainer.append(sortOptions)  
        td1.append(sortOptions)
    }
    
    
    //session membership filter
    if(sessionMaking && queryType != "session"){
    
        var sessionFilterOption = "all"
        
        if("sessionFilter" in query){
            sessionFilterOption = query["sessionFilter"]
        }
        
        var sessionFilter = createSessionFilter(sessionFilterOption, sessionFilterOption)
        
        //searchFeedbackContainer.append(sessionFilter)  
        td1.append(sessionFilter)  
    }

    //label filter 
    if( "labelFeedback" in queryFeedbackObj){
        var labelFeedback = queryFeedbackObj["labelFeedback"]
        var label = queryObj["label"]
        var alreadyFilteredLabels = [label] //make a list of labels we don't want to show because they're already filtered
        var labelFilter = createLabelFilter(labelFeedback, alreadyFilteredLabels)
        //searchFeedbackContainer.append(labelFilter) 
        td2.append(labelFilter) 
        
    }    

    
    $("#searchFeedbackDiv").append(searchFeedbackContainer)
    
    //adjust the underlay height
    var searchFeedbackHeight = $("#searchFeedbackDiv").height()
    $("#resultsUnderlay").height(searchFeedbackHeight + 20)
    
    
}

function setUpAbstractHideShow(){
    var expandAbstractionButton = $("<button>")
    expandAbstractionButton.html("Expand<br>Abstracts")
    expandAbstractionButton.click(function(){
        $(".item").each(function(t){
            var itemId = $(this).attr("id")            
            $("#short-abstract-"+itemId).hide()
            $("#full-abstract-"+itemId).show()
            
        })
    })
    
    var collapseAbstractionButton = $("<button>")
    collapseAbstractionButton.html("Expand<br>Abstracts")
    collapseAbstractionButton.click(function(){
        $(".item").each(function(t){
            var itemId = $(this).attr("id")            
            $("#short-abstract-"+itemId).show()
            $("#full-abstract-"+itemId).hide()
            
        })    
    })
    console.log("expandAbstractionButton")
    return [expandAbstractionButton, collapseAbstractionButton]
}

function createRefreshButton(){
    var refreshButton = $("<input type='button' value='refresh'>")
    refreshButton.click(function(){
        getAllData("synchronous")
    })
    return refreshButton
}

function createSortOptions(querySortOrder){
    var sortOptions = $("<div id='sortOptions'>")
    sortOptions.append("Sort items by: <br>")
    
    var sortOptionStrings = [{"name":"most recently added", "sortType": "creationTime"},{"name":"most recently updated", "sortType": "mostActive"}, {"name":"least recently updated",  "sortType": "leastActive"}]
    
    
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
                console.log("sort order: "+sortOrder)
               
                query["sortOrder"] = sortOrder
                getAllData("synchronous")
            })
        }
        wrap(sortRadio, sortOptionIndex)
        
        sortOptions.append(sortRadio)
        sortOptions.append(sortOptionString+"<br>")
    }
    
    return sortOptions
}

/* // MASS EDIT - removed for fear of the whole interface freaking out.

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

function createNumResultsDiv(num){
    //N items (with sessions/ without sessions) in 
    //(all times OR in categories list, in session, containing text)
    var numResultsDiv = $("<div class='numResults'>")
    var numResultsText = num+" papers"
    if(num == 1){
        numResultsText = num+" paper"
    }
    var queryType = query["type"]
    
    if(sessionMaking){
        if("sessionFilter" in query){
            var sessionFilter = query["sessionFilter"]
            if(sessionFilter == "withSessions"){
                numResultsText = numResultsText + " with sessions "
            }
            if(sessionFilter == "withoutSessions"){
                numResultsText = numResultsText + " <i>without</i> sessions "
            }
            
        }
    }
    
    if(queryType == "all"){
        numResultsText = numResultsText + " in entire collection"
    }
    
    //if(queryType == "label"){
    if("labels" in query){
        var label = query["label"]
        var labels = query["labels"]
        if( labels.length > 0){
            var labelsDisplayText = "'"+labels[0]+"'"
            for(var i = 1; i< labels.length; i++){
                labelsDisplayText = labelsDisplayText+ " and <br> '"+labels[i]+"'"
            }
            numResultsText = numResultsText + " in "+labelsDisplayText
        }
    }
    if(queryType == "session"){
        var label = query["label"]
        numResultsText = numResultsText + " in '"+label+"'"
    } 
    if("text" in query){
        var text = query["text"]
        numResultsText = numResultsText + "<br> containing text '"+text+"'"
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
    
    numResultsDiv.html(numResultsText)
    return numResultsDiv
}


function createSessionFilter(defaultFilter){
    var div = $("<div id='sessionFilter' width='260px'>")
    var members = itemIdOrder
    var allItemsNotInSessions = sessions["none"]["members"]
    
    var numAll = query["sessionFilterData"]["numAll"]
    var numWithoutSession = query["sessionFilterData"]["numWithoutSession"]
    var numWithSession = query["sessionFilterData"]["numWithSession"]
        
    
    
    var allItemsText = "All papers ("+members.length+")"
    var allItemsNeedingSessions = "Papers needing sessions ("+numWithoutSession+")"
    var allItemsHavingSessions = "Papers in sessions ("+numWithSession+")"
    
    
    div.append("Showing: <br>")
    
    var sessionFilterOptions = [
        {"name":allItemsText, "filter": "all"},
        {"name":allItemsHavingSessions, "filter": "withSessions"}, 
        {"name":allItemsNeedingSessions,  "filter": "withoutSessions"}
    ]
    
    
    for(var index in sessionFilterOptions){
        var sessionFilterString = sessionFilterOptions[index]["name"]
        var sessionFilterType = sessionFilterOptions[index]["filter"]
        var sessionFilterStringSpan = "<span>"+sessionFilterString+"</span><br>"
         
        var sessionFilterRadio = $("<input type='radio'  name='sessionFilter' value='"+sessionFilterType+"'>")
        
        if(sessionFilterType == defaultFilter){
            sessionFilterRadio.prop("checked", true)
            sessionFilterStringSpan = "<span class='selectedSessionFilter'>"+sessionFilterString+"</span><br>"
        }
        
        wrap = function(sessionFilterRadioPrime, sessionFilterTypePrime){
            sessionFilterRadioPrime.click(function(){
                query["sessionFilter"] = sessionFilterTypePrime
                /*
                $(".sessionFilterText").each(function(){
                    $(this).removeClass("selectedFilter")
                })
                $('#'+sessionFilterTypePrime).addClass("selectedFilter")
                */
                getAllData("synchronous")

            })
        }
        wrap(sessionFilterRadio, sessionFilterType)
        
        div.append(sessionFilterRadio)
        div.append(sessionFilterStringSpan)
    }
    
    return div
}

//////////////////////////////////
// Overlapping Label Filter
//////////////////////////////////
function createLabelFilter(labelFeedback, alreadyFilteredLabels){
    var sortOrder = labelFeedback["sortOrder"]
    var overlappingLabels = labelFeedback["overlappingLabels"]

    var div = $("<div id='hyperbarOverlappingCategoryFilter'>")
    
    var instructions1 = "Filter to papers also in categories:<br>"
    var instructions2 = "sort by"
    
    div.append(instructions1)
    //div.append(instructions2)
    
    //create Category Filter
    var hyperbarOverlappingCategoryFilter = $("<div id='hyperbarOverlappingCategoryFilter'>")
    div.append(hyperbarOverlappingCategoryFilter)
    
        var hyperbarOverlappingCategorySort = createHyperbarOverlappingCategorySort(overlappingLabels, alreadyFilteredLabels, sortOrder) 
        //hyperbarOverlappingCategoryFilter.append(hyperbarOverlappingCategorySort)

        var hyperbarOverlappingCategoryListContainer = $("<div id='hyperbarOverlappingCategoryListContainer'>")
        hyperbarOverlappingCategoryFilter.append(hyperbarOverlappingCategoryListContainer)
        
            var hyperbarOverlappingCategoryList = createHyperbarOverlappingCategoryList(overlappingLabels, alreadyFilteredLabels)
            hyperbarOverlappingCategoryListContainer.append(hyperbarOverlappingCategoryList)    
            
    return div
    
}

function createHyperbarOverlappingCategorySort(overlappingLabels, alreadyFilteredLabels, sortOrder){
    //TO DO: autoselect the sortOrder

    var select = $("<select id='hyperbarOverlappingCategorySort'>")
    
    var option1 = $("<option value='mostItems'>")
    option1.append("most papers")
    select.append(option1)

    var option2 = $("<option value='leastItems'>")
    option2.append("least papers")
    select.append(option2)
    
    var option3 = $("<option value='az'>")
    option3.append("a-z")
    select.append(option3)
    
    var option4 = $("<option value='za'>")
    option4.append("z-a")
    select.append(option4)
    
    $(select).on('change', function() {
        var selectedSortOrder = $(this).val() 
        sortHyperbarOverlappingCategories(overlappingLabels, alreadyFilteredLabels, selectedSortOrder)
    });
    return select
}

function sortHyperbarOverlappingCategories(overlappingLabels, alreadyFilteredLabels, sortOrder){
    var hyperbarOverlappingCategoryListContainer = $("#hyperbarOverlappingCategoryListContainer")
    hyperbarOverlappingCategoryListContainer.empty()
    
    sortOverlappingLabels(overlappingLabels, sortOrder)
    var newHyperbarOverlappingCategoryList = createHyperbarOverlappingCategoryList(overlappingLabels, alreadyFilteredLabels)
    hyperbarOverlappingCategoryListContainer.append(newHyperbarOverlappingCategoryList)
    
}

function createHyperbarOverlappingCategoryList(overlappingLabels, alreadyFilteredLabels){
    var div = $("<div id='hyperbarOverlappingCategoryList'>")
    
    for(var i in overlappingLabels){
        var overlappingLabel = overlappingLabels[i]
        var label = overlappingLabel["label"]
        if(!arrayContains(alreadyFilteredLabels, label)){
            var overlappingItemIds = overlappingLabel["overlappingItemIds"]
            var numOverlappingItemIds = overlappingItemIds.length
            
            var overlappingLabelDiv = $("<div class ='overlappingLabelDiv'>")
            overlappingLabelDiv.append(label+" ("+numOverlappingItemIds+")")
            
            wrap = function(divPrime, labelPrime){
                divPrime.click(function(){
                    var filteredLabels = []
                    if("labels" in query){
                        filteredLabels = clone(query["labels"])
                    }
                    filteredLabels.push(labelPrime)
                    
                    query["labels"] = filteredLabels
                    /*
                    query = {
                        "type" : "label",
                        "label" : labelPrime,
                        "labels" : filteredLabels,
                        "sortOrder" : "mostItems"
                    }
                    */
                    getAllData("synchronous")
                })
            }
            wrap(overlappingLabelDiv, label)        
            
            div.append(overlappingLabelDiv)
        }
    }
    return div
}

function sortOverlappingLabels(overlappingLabels, sortOrder){
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
