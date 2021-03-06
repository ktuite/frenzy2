///////////////////////////
// Item and Reply Div
///////////////////////////

function createItemAndReplyDiv(itemObj){
    var itemAndReplyDiv = $("<div class='row' id='containerFor-"+itemObj["id"]+"'>")
    itemAndReplyDiv.css("position","relative")
	var itemAndReplyDivInternals = createItemAndReplyDivInternals(itemObj)
    itemAndReplyDiv.append(itemAndReplyDivInternals)
    return itemAndReplyDiv
}
function createItemAndReplyDivInternals(itemObj){
    var itemAndReplyDiv = $("<div class='itemAndReplyDiv'>")
    
    var itemDiv = createItemDiv(itemObj)
    
    var labelsAndRepliesDiv = $("<div class='span4 replyList' style='background:white'>")
    //var labelsAndRepliesDiv = $("<div class='replyList' style='background:white'>")
    //labelsAndRepliesDivContainer.append(labelsAndRepliesDiv)
    
    var itemId = itemObj["id"]
    //var itemCheckboxDiv = $("<input type='checkbox' class='itemCheckbox' id='"+itemId+"' style='position:relative;float:right;'>")
    var sessionDiv = $('<div id="sessionUI-'+itemId+'">')
    
    var labelsDiv = createLabelsDiv(itemObj)
    //var replyDiv = $("<div class='span4 replyList' style='background:white' id='replies-to-"+itemObj["id"]+"'>")    
    
    
    //var replyDivContent = createReplyDivContent(itemObj)
    //replyDiv.append(replyDivContent)
        
    itemAndReplyDiv.append(itemDiv)
    //labelsAndRepliesDiv.append(itemCheckboxDiv)
    labelsAndRepliesDiv.append(sessionDiv)
    if(sessionMaking){
        createAddSessionDiv(sessionDiv, itemObj)
    }
    labelsAndRepliesDiv.append(labelsDiv)
    //labelsAndRepliesDiv.append(replyDiv)
    itemAndReplyDiv.append(labelsAndRepliesDiv)
        
    return itemAndReplyDiv

}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function createItemHTML(itemContent, searchQuery){
    var id = itemContent["id"] 
    var url = itemContent["url"] 

    return "face#"+id+"<br><br><img src='"+url+"' />"
}

function createItemDiv(itemObj){
    //var itemHTML = itemObj["html"]
    var itemHTML = "" //createItemHTML(itemObj["content"])
    var itemId = itemObj["id"]
    
    //var clickableDiv = $("<span id='clickable-"+itemId+"'>");
    var div = $("<div class='span4 item' id= '"+itemId+"'>")
    
    /*
    itemCreatorSpan = $("<span class='user'>")
    itemCreatorSpan.text(itemCreator)
    div.append(itemCreatorSpan)
    div.append("<br>")
    */
    var itemHTMLSpan = $("<span class='itemHTML'>")
    
    var queryType = query["type"]
    if(queryType == "text"){
        var searchQuery = query["text"]
        itemHTML = createItemHTML(itemObj["content"], searchQuery)
        /*
        
        console.log(escapeRegExp(searchQuery))
        var re = new RegExp(escapeRegExp(searchQuery), "gi"); 
        itemHTML = itemHTML.replace(re ,"<span style='color:red; font-style: bold;'>\$&</span>");//"\$&"
        */
    }else{
        itemHTML = createItemHTML(itemObj["content"])
    }
    //var re = new RegExp(/\S*#(?:\[[^\]]+\]|\S+)/gi); 
	//itemHTML = itemHTML.replace(re, "<span class='user' onclick = 'search(\"$&\")' >$&</span>");
                
    itemHTMLSpan.html(itemHTML)
    div.append(itemHTMLSpan)
    
    /*
    wrap1 = function(d, twtId){
        d.click(function(){
            refreshDiscussion(twtId)
            $("#"+itemId).removeClass('newDiscussion2');
            itemClickUpdateTimes[twtId]["lastRefreshTime"] = getTime();
        })
    }
    wrap1(clickableDiv, itemId)
    
    wrap2 = function(span, creator){
        span.click(function(){
        userSearch(creator)
        })
    }
    wrap2(itemCreatorSpan, itemCreator)
    */
    //clickableDiv.append(div);
    //return clickableDiv
    return div
}


/////////////////////////
// LABELS
/////////////////////////
function createAddSessionDiv(div, itemObj){
    if(sessionMaking){
        div.empty()
        var session = itemObj["session"]
        var itemId = itemObj["id"]

        //var div = $('<div>')
        if(session == "none"){
            var initialText = ""
            createWithoutSession(div, itemId, initialText)
        }
        else{
            createWithSession(div, itemId, session)
        }
        var lineBreakDiv = $('<div>')
        var lineBreak = " <br> "
        $(lineBreakDiv).html(lineBreak)
        div.append(lineBreakDiv)
    }
    //return div
}
/*
    textbox.autocomplete({
      source: autocompleteLabels,
      select: function(event, ui) {
        textbox.val(ui.item.value)
        submitTextbox()
        event.stopPropagation()
        event.preventDefault()
      }
    });
    textbox.keypress(function(event){
        if( event.which == 13 ) submitTextbox()     
    })

*/
function createWithoutSession(div, itemId, initialText){
    var sessionText = "Session: "
    $(div).html(sessionText)
    var sessionNameTextbox = $('<input type="text" class="sessionTextbox" id="addSessionTextbox-'+itemId+'">')
    div.append(sessionNameTextbox)
    sessionNameTextbox.val(initialText)
    if(initialText != ""){
        //sessionNameTextbox.select()
        console.log(sessionNameTextbox[0])
        sessionNameTextbox[0].select()
    }
    function submitTextbox() {
        var textboxValue = sessionNameTextbox.val().trim()
        if(textboxValue!= ""){
            var sessionLabel = textboxValue
            updateSession(itemId, sessionLabel)
        }
    }
    sessionNameTextbox.autocomplete({
        source: autocompleteSessions,
        select: function(event, ui) {
            sessionNameTextbox.val(ui.item.value)
            submitTextbox()
            event.stopPropagation()
            event.preventDefault()
        }
    });
    
    var addButtonText ="add"
    if(initialText != ""){
        addButtonText ="ok"
    }
    var addButton = $('<button id="addButton">'+addButtonText+'</button>')
    addButton.click(submitTextbox)
    sessionNameTextbox.keypress(function(event){
        if( event.which == 13 ) submitTextbox()
    })
    
    var removeButton = $('<button id="removeButton"><img src="redX.png" style="height:15px; width:10px"></button>')
    removeButton.click(function(){
        updateSession(itemId, "none")
    })
    

    div.append(addButton)
        if(initialText != ""){
        div.append(removeButton)
    }
}
function createWithSession(div, itemId, session){

    var sessionText = "In Session: <span class='sessionLabel'>" + session+ "</span>"
    $(div).html(sessionText)

    var changeButton = $('<button class="changeButton">edit</button>')
    changeButton.click(function(){
        createWithoutSession(div, itemId, session)
    })
    div.append(changeButton)
}

function createLabelsDiv(itemObj){
    var labelObjDict = itemObj["labels"]
    var itemId = itemObj["id"]
	var session = itemObj["session"]
    
    var div = $('<div id="labelsUIDiv-'+itemId+'">')  
    var categoryTitle = "In Categories"
    div.append(categoryTitle)    
    
    var categoryCheckboxesDiv = $('<table class="categoriesDiv" id="inCategoriesDiv-'+itemId+'">')    
    appendCategories(categoryCheckboxesDiv, itemId, labelObjDict)
    div.append(categoryCheckboxesDiv)

    var addLabelUI = addLabel(itemId)
    div.append(addLabelUI)
        

    return div
}

function clearCategories(div) {
    div.empty()
}

function appendCategories(div, itemId, labelObjDict){
    for(var i in labelObjDict){
        var labelObj = labelObjDict[i]
		var interactiveLabelUI = makeInteractiveLabelUI(labelObj, itemId)        
		div.append(interactiveLabelUI)
    }
}

function addLabel(itemId){
    var div = $('<div>')

	var uiwidgetDiv = $('<span class="ui-widget">')
	var textbox = $('<input type="text" id="addCategoryTextbox-'+itemId+'" placeholder="add a category">')
    function submitTextbox() {
        var textboxValue = textbox.val().trim()
        if(textboxValue != ""){
            updateNewLabel(textboxValue,itemId)
        }
    }
	textbox.autocomplete({
      source: autocompleteLabels,
      select: function(event, ui) {
        textbox.val(ui.item.value)
        submitTextbox()
        event.stopPropagation()
        event.preventDefault()
      }
    });
    textbox.keypress(function(event){
        if( event.which == 13 ) submitTextbox()     
    })
	uiwidgetDiv.append(textbox)
	div.append(uiwidgetDiv)
    
	
    var addButton = $('<button id="addButton" class="btn">+</button>')
    addButton.click(submitTextbox)
    div.append(addButton)
    return div
}
function makeInteractiveLabelUI(labelObj, itemId){
    //console.log(labelObj) //checked, likes, dislikes, label, (NO SYSTEM)
    var labelText = labelObj["label"]
    var labelChecked = labelObj["checked"]
    
    var labelLikes = labelObj["likes"]
    var labelLikedByMe = ($.inArray(username, labelLikes) != -1)
    var labelLikeCount = labelLikes.length

    var labelListObj = labelList[labelText]
    
    var creator = labelListObj["creator"]
    var numItems = labelListObj["itemsUsedBy"].length
	
    var row = $('<tr>')    
	
	//make label checkbox
	var checkbox = $('<input type="checkbox" checked=true>')
    row.append($('<td>').append(checkbox))
    if(labelChecked==true){
        $(checkbox).attr('checked');
    }
    else{
        $(checkbox).removeAttr('checked');
    }
	
	checkbox.click(function() {
		var t = $(this);
		// $this will contain a reference to the checkbox   
		if (t.is(':checked')) {
			// the checkbox is now checked 
			//toggle checked in the database and refresh everything
			toggleLabelUpdate(labelText, itemId, true)
		} else {
			// the checkbox is now unchecked
			toggleLabelUpdate(labelText, itemId, false)
		}
	});
	
    var labelSpan = $('<span>')
    
    /*
	if(creator == "system"){
		labelSpan.addClass("systemLabel")//("color", "blue")
	}else{
        labelSpan.addClass("nonSystemLabel")
    }
    */
    if (labelListObj["itemsUsedBy"].length <= 1) {
        labelSpan.addClass("singletonLabel")
    } else {
        labelSpan.addClass("nonSingletonLabel")        
    }
    
    if (labelChecked) {
        labelSpan.addClass("labelChecked")
    } else {
        labelSpan.addClass("labelUnchecked")        
    }

    var numItemsSpan = $("<span class='numItemsClickable'>")
    numItemsSpan.html(numItems)
    
    //labelSpan.html(labelText+" ("+numItems+")")
    labelSpan.append(labelText+" (")
    labelSpan.append(numItemsSpan)
    labelSpan.append(")")
    
    numItemsSpan.click(function(){
        query = {
            "type" : "label",
            "label" : labelText,
            "checked" : true,            
            "labels" : [labelText],
            "sortOrder" : sessionMaking ? "mostLikesForLabels" : "creationTime"
        }
        getAllData("synchronous")
    })    
    
    row.append($('<td class="categoriesDivCategoryLabel">').append(labelSpan))

    // add like button, but only if the category is checked and not a singleton
    if (labelChecked && numItems > 1) {
        var likeButton = $('<button type="button" class="btn btn-primary likeButton" data-toggle="button"></button>')

        var tooltipPrefix = "";
        if(labelLikedByMe){
            likeButton.addClass('active')
            if (labelLikeCount == 1) {
                tooltipPrefix = "You think"
                likeButton.text('You')
            } else {
                tooltipPrefix = "You and other people think"
                likeButton.text('You+' + (labelLikeCount-1))
            }
            tooltipSuffix = "undo your vote."
        }
        else if (labelLikeCount == 0) {
            likeButton.addClass("zero")
            tooltipPrefix = "Nobody thinks"
            tooltipSuffix = "vote for it."
            likeButton.text("+0")
        } else {
            likeButton.addClass("nonzero")
            tooltipPrefix = "Other people think"
            tooltipSuffix = "vote for it too."
            likeButton.text('+' + labelLikeCount)
        }
        likeButton.attr("title", tooltipPrefix + ' "' + labelText + '" would be a good session for this paper. Click here to ' + tooltipSuffix)

        // label the button with +N if N people have liked it
        likeButton.on('click', function() {
            var t = $(this)
            var nowLiked = !t.is(".active") 
            toggleLabelLiked(labelText, itemId, nowLiked)
        })

        row.append($("<td>").append(likeButton))
    }

    return row
}

/*
update = {
	type : "session",
	user : "hmslydia",
	time : 1234567891,
	itemId : "item0" , 
	sessionLabel : "animal"
}
*/
function updateSession(itemId, sessionLabel){
    //WORK HERE
    //turn the session back to with
    var sessionDiv = $("#sessionUI-"+itemId) //$('<div id="sessionUI-'+itemId+'">')
    items[itemId]["session"] = sessionLabel
    createAddSessionDiv(sessionDiv, items[itemId] )

    if(! arrayContains(autocompleteSessions, sessionLabel)){
    
        autocompleteSessions.push(sessionLabel)
        
        autocompleteSessions.sort(function(a, b){
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
                $('#addSessionTextbox-'+id).autocomplete("option", { source: lst });
            }
            wrap(itemIdPrime, autocompleteSessions)
        }
    }  

    itemsInQueryIveChanged.push(itemId)
	var myUpdate = {"type": "session", 
				"time" : getTime(), 
				"itemId" : itemId, 
				"sessionLabel" : sessionLabel
	}

	pushAndPullUpdates(myUpdate, "asynchronous")
}



/*
update = {
	type : "toggleLabelFromItem",
	user : "hmslydia",
	time : 1234567891,
	itemId : "item0" , 
	labelText : "animal",
	checked: true,
}
*/
function toggleLabelUpdate(labelText, itemId, checked){

    itemsInQueryIveChanged.push(itemId)
    
	var myUpdate = {"type": "toggleLabelFromItem", 
				"time" : getTime(), 
				"itemId" : itemId, 
				"labelText" : labelText, 
				"checked": checked
	}

	pushAndPullUpdates(myUpdate, "asynchronous")
}

/*
update = {
    type : "toggleLabelLiked",
    user : "hmslydia",
    time : 1234567891,
    itemId : "item0" , 
    labelText : "animal",
    like : true
}
*/
function toggleLabelLiked(labelText, itemId, liked) {

    itemsInQueryIveChanged.push(itemId)
    
    var myUpdate = {"type": "toggleLabelLiked", 
                "time" : getTime(), 
                "itemId" : itemId, 
                "labelText" : labelText, 
                "liked": liked
    }

    pushAndPullUpdates(myUpdate, "asynchronous")

}

////////////////////////////////
// Replies
////////////////////////////////

var repliesDiv = $("<div>")

function findAllRepliesToReplyId(parentId, allReplies){
    var childrenOfMostRecentReply = filterArray(allReplies, function(x){
        return  x["parentId"] == parentId
    })
    return childrenOfMostRecentReply
}

function createReplyDivContent(itemObj){
    repliesDiv = $("<div>")
    var allReplies = itemObj["replies"]
    var topLevelReplies = findAllRepliesToReplyId("", allReplies)
    //var replyDiv = createReplyDiv(replyObj, level)
    //repliesDiv.append(replyDiv)
    var level = 0;
    for(var i in topLevelReplies){
        var replyObj = topLevelReplies[i]
        var replyDiv = createReplyDiv(replyObj, level)
        repliesDiv.append(replyDiv)
        createReplyDivHelper(replyObj, level + 1, allReplies)
    }
    return repliesDiv
}

function createReplyDivHelper(parentReplyObj, level, allReplies){
    var parentReplyId = parentReplyObj["id"]
    var childReplies = findAllRepliesToReplyId(parentReplyId, allReplies)
    for(var i in childReplies){
        var replyObj = childReplies[i]
        var replyDiv = createReplyDiv(replyObj, level)
        repliesDiv.append(replyDiv)
        createReplyDivHelper(replyObj, level + 1, allReplies)
    }
}

/*
reply = {
	user : "Firefox",
	time : 1234567891,
	itemId : "item0" , 
	html : "<b>my reply</b>",
	parentId : "item0",	//"" if it is a reply to the item
    likes: ["Chrome"]
}
*/
function createReplyDiv(replyObj, level){
	var replyHTML = replyObj["html"]
    var replyId= replyObj["id"]
    var replyAuthor = replyObj["user"]
    var replyLikes = replyObj["likes"]
	var itemId = replyObj["itemId"]
    
    var div = $("<div class='tweet subReplyTextArea' id= '"+replyId+"'>")
    
    //indent the reply on how deeply threaded it is
	//multiply by 30 px per level
    div.css('margin-left',5+level*30+"px");
    
	//REPLY CONTENT
    var replyContentDiv = $("<div>")
	div.append(replyContentDiv)	
    replyContentDiv.html("<b>"+replyAuthor + "</b><br>" + replyHTML)
    
	//REPLY OPTIONS
	var replyOptionsDiv = $("<div class='reply-options'>") //style='margin-top:25px;'
	div.append(replyOptionsDiv)
	
	//REPLY BUTTON
    var replyButton = $("<input type=button id='replyTo-"+replyId+"' value='reply' style='float: right;' class='unclicked'>")
    replyOptionsDiv.append(replyButton);
	wrap = function (replyButtonPrime, currentReplyDiv, itemIdPrime, replyIdPrime, levelPrime){
	    replyButtonPrime.click(function(){
		    var newReplyDiv = createDynamicReplyDiv(itemIdPrime, replyIdPrime, levelPrime)
			currentReplyDiv.after(newReplyDiv)		    
	    })
    }
    wrap(replyButton, div, itemId, replyId, level+1)
	
	//LIKE
	var likeButton = createLikesButtonForReply(replyObj)
	replyOptionsDiv.append(likeButton);
	

	
	//EDIT
	/*
    var userLikesCount = filterArray(likes, function(x){return x["id"]==replyId && x["username"]==getUserName()}).length;
    
    wrapEditButton = function (button, replyDiv, currentContent,twtId){
	    button.click(function(){
		    displayEditDialog(replyDiv, currentContent,twtId)
		    
	    })
    }
    wrapEditButton(editButton, div, tweetHTML,tweetId)	
	
	var editButton = $("<input type='button' id='edit-"+replyId+"' value='edit' style='float: right;' >")
	replyOptionsDiv.append(editButton)
	*/
    
    
    
    return div;
}

function createDynamicReplyDiv(itemId, parentReplyId, level){
	//create a new replyDiv, and append it to it's parent, and indent it some more.
	var replyDiv = createBlankReplyDiv(itemId, parentReplyId)
	replyDiv.css('margin-left',5+level*30+"px");
	return replyDiv
}



/////////////////////
// LIKES
/////////////////////
/*
var likeImage = $("<img id='likeImage' src='http://homes.cs.washington.edu/~felicia0/images/twitify/likeButton.png' height='40px' style='float: right; height:25px;'>")
var label = $("<span id='likesCount-"+replyId+"'>");
label.text("("+replyLikesCount +")");
label.css('height','25px');
label.css('float','right');
label.css('padding-top','4px');
*/

function createLikesButtonForReply(replyObj){
	var replyHTML = replyObj["html"]
    var replyId= replyObj["id"]
    var replyAuthor = replyObj["user"]
    var replyLikes = replyObj["likes"]
	var itemId = replyObj["itemId"]

	var myUsername = getUsername()
	var likeButtonContainer =  $("<span style='float: right;' >")
	var numberOfLikes = replyLikes.length
	
	
	
	//I can't like my own reply, so if this is my reply, don't let me like it
	if(myUsername == replyAuthor){
		//I can't like my own work.
		//Just say how many other people like it.
		if( numberOfLikes > 0){
			var likesFeedback = $("<span>")
			likeButtonContainer.append(likesFeedback)
			var likesFeedback = $("<span>")
			likesFeedback.text(numberOfLikes+" people like this")
		}		
		//No like Button
		
		
	}else if( arrayContains(replyLikes, myUsername) ){
		//I've already liked it, allow me to unlike it
		
		var likesFeedback = $("<span>")
		likeButtonContainer.append(likesFeedback)
		//otherwise show that you and n others like this.
		if( numberOfLikes == 1){
			//only you like it
			likesFeedback.text("You like this")
		}else{
			var numOfOtherLikes = numberOfLikes - 1
			likesFeedback.text("You and "+numOfOtherLikes+" people like this")
		}
		//add a like button
		var unlikeButton = makeUnlikeButton(replyObj)
		likeButtonContainer.append(unlikeButton)
	}else{	
		//show how many people like it and give me the option to like it
		if(numberOfLikes > 0){
			var likesFeedback = $("<span>")
			likeButtonContainer.append(likesFeedback)
			likesFeedback.text(numberOfLikes+" people like this")
		}
		//add a like button
		var likeButton = makeLikeButton(replyObj)
		likeButtonContainer.append(likeButton)		
	}
	
    return likeButtonContainer
}
/*
update = {
	type : "likeReply", //  "unlikeReply", 
	user : "hmslydia",
	time : 1234567891,
	itemId : "item0" , 
	replyId : item0-reply0"
}
*/
//LIKE
function makeLikeButton(replyObj){
	var replyHTML = replyObj["html"]
    var replyId = replyObj["id"]
    var replyAuthor = replyObj["user"]
    var replyLikes = replyObj["likes"]
	var itemId = replyObj["itemId"]

	var likeButton = $("<input type='button' id='like-"+replyId+"' value='like'>")
	wraplikeButton = function (likeButtonPrime, replyObjPrime){
		likeButtonPrime.click(function(){
			var replyId = replyObj["id"]
			var itemId = replyObj["itemId"]
			likeReply(itemId, replyId)
		})
	}
	   
	wraplikeButton(likeButton, replyObj)
	return likeButton
}

function likeReply(itemId, replyId){
	var myUpdate = {"type": "likeReply", 
				"time" : getTime(), 
				"itemId" : itemId, 
				"replyId" : replyId
	}

	pushAndPullUpdates(myUpdate, "asynchronous")
}

//UNLIKE
function makeUnlikeButton(replyObj){
	var replyHTML = replyObj["html"]
    var replyId = replyObj["id"]
    var replyAuthor = replyObj["user"]
    var replyLikes = replyObj["likes"]
	var itemId = replyObj["itemId"]

	var unlikeButton = $("<input type='button' id='unlike-"+replyId+"' value='unlike'>")
	wrapUnlikeButton = function (unlikeButtonPrime, replyObjPrime){
		unlikeButtonPrime.click(function(){
			var replyId = replyObj["id"]
			var itemId = replyObj["itemId"]
			unlikeReply(itemId, replyId)
		})
	}
	   
	wrapUnlikeButton(unlikeButton, replyObj)
	return unlikeButton
}

function unlikeReply(itemId, replyId){
	var myUpdate = {"type": "unlikeReply", 
				"time" : getTime(), 
				"itemId" : itemId, 
				"replyId" : replyId
	}

	pushAndPullUpdates(myUpdate, "asynchronous")
}


/////////////////////////
// Blank replies
/////////////////////////
function createBlankReplyDiv(itemId, parentReplyId){	
    var containerDiv = $("<div class='replyTextDiv'>")
	var div = $("<textarea class='replyTextArea' id='replyTo-"+parentReplyId+"'>")
	var replyButton = $("<input type='button' class='replyButton' value='post'>")
	

    wrap = function(replyButtonPrime,divPrime, itemId, parentItemIdPrime){
        replyButtonPrime.click(function(){
			replyText = divPrime.val();
			saveReply(replyText, itemId, parentItemIdPrime)  
        })
    }
    wrap(replyButton, div, itemId, parentReplyId)
    
    containerDiv.append(div);
	containerDiv.append(replyButton);    
    return containerDiv
    
}

function saveReply(replyText, itemId, parentReplyId){
	var myUpdate = {"type": "replyToItem", 
				"time" : getTime(), 
				"itemId" : itemId, 
				"html" : replyText, 
				"parentId": parentReplyId
	}

	pushAndPullUpdates(myUpdate, "asynchronous")
}