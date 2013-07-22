///////////////////////////
// Item and Reply Div
///////////////////////////

function createItemAndReplyDiv(itemObj){
    var itemAndReplyDiv = $("<div class='row' id='containerFor"+itemObj["id"]+"'>")
	var itemAndReplyDivInternals = createItemAndReplyDivInternals(itemObj)
    itemAndReplyDiv.append(itemAndReplyDivInternals)
    return itemAndReplyDiv
}
function createItemAndReplyDivInternals(itemObj){
    var itemAndReplyDiv = $("<div >")
    
    var itemDiv = createItemDiv(itemObj)
    var labelsAndRepliesDiv = $("<div class='span4 replyList' style='background:white'>")
    
    var labelsDiv = createLabelsDiv(itemObj)
    var replyDiv = $("<div class='span4 replyList' style='background:white' id='replies-to-"+itemObj["id"]+"'>")    
    var replyDivContent = createReplyDivContent(itemObj)
    replyDiv.append(replyDivContent)
    /*
    wrap = function(div, id){
        $(div).click(function(index){
            ajax("updateLocation",{"id":id},function(){})
        })
    }
    wrap(replyDiv, itemObj["id"] )
    */
    
    var itemId = itemObj["id"]
	var parentId = ""
    var baseReplyDiv = createBlankReplyDiv(itemId, parentId)
    replyDiv.append(baseReplyDiv)
        
    itemAndReplyDiv.append(itemDiv)
    labelsAndRepliesDiv.append(labelsDiv)
    labelsAndRepliesDiv.append(replyDiv)
    itemAndReplyDiv.append(labelsAndRepliesDiv)
        
    return itemAndReplyDiv

}

function createItemDiv(itemObj){
    var itemHTML = itemObj["html"]
    var itemId= itemObj["id"]
    
    var clickableDiv = $("<span id='clickable-"+itemId+"'>");
    var div = $("<div class='span4 item' id= '"+itemId+"'>")
    
    /*
    itemCreatorSpan = $("<span class='user'>")
    itemCreatorSpan.text(itemCreator)
    div.append(itemCreatorSpan)
    div.append("<br>")
    */
    var itemHTMLSpan = $("<span class='itemHTML'>")
    
    
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
    clickableDiv.append(div);
    return clickableDiv
}


/////////////////////////
// LABELS
/////////////////////////
function createLabelsDiv(itemObj){
    var div = $('<div>')
    var labelObjDict = itemObj["labels"]
    var itemId = itemObj["id"]
	var session = itemObj["session"]
    for(var i in labelObjDict){
        var labelObj = labelObjDict[i]
		
		var label = labelObj["label"]
		var isSession = false
		if(label == session){
			isSession = true
		}
		var interactiveLabelUI = makeInteractiveLabelUI(labelObj, itemId, isSession)
        
		div.append(interactiveLabelUI)
    }
	
	var noSessionDiv = $("<div>")
	var checked = ""
	if(session=="none"){
		checked = 'checked="checked"'
	}
	var sessionRadioButton = $('<input type="radio" name="'+itemId+'-session" value="none" '+checked+'>')
	var sessionNoneSpan = $("<span>")
	sessionNoneSpan.html("(none)")
	noSessionDiv.append(sessionRadioButton)	
	noSessionDiv.append(sessionNoneSpan)
	
	div.append(noSessionDiv)
	


    var addLabelUI = addLabel(itemId)
    div.append(addLabelUI)
        

    return div
}
function addLabel(itemId){
    var div = $('<div>')
    var textbox = $('<input type="textbox">')
    div.append(textbox)
    var addButton = $('<button id="addButton">+</button>')
    addButton.click(function(){
        var textboxValue = textbox.val()
        updateNewLabel(textboxValue,itemId)
    })
    div.append(addButton)
    return div
}
function makeInteractiveLabelUI(labelObj, itemId, isSession){
    var labelText = labelObj["label"]
    var labelChecked = labelObj["checked"]
	
    var div = $('<div>')
    
	//make radio button
	var checked = ""	
	if(isSession){
		checked = 'checked="checked"'
	}	
	var sessionRadioButton = $('<input type="radio" name="'+itemId+'-session" value="'+labelText+'" '+checked+'>')
	sessionRadioButton.click(function(e){
		var sessionLabel = e.target.value
		var name = e.target.name
		var itemId = name.substring(0, name.indexOf("-"))
		updateSession(itemId, sessionLabel)
	})
	div.append(sessionRadioButton)
	
	//make label checkbox
	var checkbox = $('<input type="checkbox" checked=true>')
    div.append(checkbox)
    if(labelChecked==true){
        $(checkbox).attr('checked');
    }
    else{
        $(checkbox).removeAttr('checked');
    }
	
	checkbox.click(function() {
		var $this = $(this);
		// $this will contain a reference to the checkbox   
		if ($this.is(':checked')) {
			// the checkbox is now checked 
			//toggle checked in the database and refresh everything
			toggleLabelUpdate(labelText, itemId, true)
		} else {
			// the checkbox is now unchecked
			toggleLabelUpdate(labelText, itemId, false)
		}
	});
	
    var labelSpan = $('<span>')
	if(isSession){
		labelSpan.css("color", "red")
	}
    labelSpan.html(labelText+"<br>")
    div.append(labelSpan)
    return div
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
	var myUpdate = {"type": "session", 
				"time" : getTime(), 
				"itemId" : itemId, 
				"sessionLabel" : sessionLabel
	}

	pushAndPullUpdates(myUpdate)
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
	var myUpdate = {"type": "toggleLabelFromItem", 
				"time" : getTime(), 
				"itemId" : itemId, 
				"labelText" : labelText, 
				"checked": checked
	}

	pushAndPullUpdates(myUpdate)
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

	pushAndPullUpdates(myUpdate)
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

	pushAndPullUpdates(myUpdate)
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

	pushAndPullUpdates(myUpdate)
}