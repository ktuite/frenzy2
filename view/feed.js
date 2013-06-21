function createItemAndReplyDiv(itemObj){
    var itemAndReplyDiv = $("<div class='row'>")
    
    var itemDiv = createItemDiv(itemObj)
    var labelsAndRepliesDiv = $("<div class='span5 replyList' style='background:white'>")
    
    var labelsDiv = createLabelsDiv(itemObj)
    var replyDiv = $("<div class='span5 replyList' style='background:white' id='replies-to-"+itemObj["id"]+"'>")    
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
    var baseReplyDiv = createBlankReplyDiv(itemId)
    replyDiv.append(baseReplyDiv)
        
    itemAndReplyDiv.append(itemDiv)
    labelsAndRepliesDiv.append(labelsDiv)
    labelsAndRepliesDiv.append(replyDiv)
    itemAndReplyDiv.append(labelsAndRepliesDiv)
    
    
    return itemAndReplyDiv
}

function createLabelsDiv(itemObj){
    var div = $('<div>')
    var labelObjDict = itemObj["labels"]
    var itemId = itemObj["id"]
    for(var i in labelObjDict){
        var labelObj = labelObjDict[i]
        var interactiveLabelUI = makeInteractiveLabelUI(labelObj)
        div.append(interactiveLabelUI)
    }
    var addLabelUI = addLabel(itemId)
    div.append(addLabelUI)
        
    return div
}
function addLabel(itemId){
    var div = $('<div>')
    var textbox = $('<input type="textbox" name="textbox1" >')
    div.append(textbox)
    var addButton = $('<button id="addButton">+</button>')
    addButton.click(function(){
        var textboxValue = textbox.val()
        console.log()
        updateNewLabel(textboxValue,itemId)
        console.log(textbox.val())
    })
    div.append(addButton)
    return div
}
function makeInteractiveLabelUI(labelObj){
    var labelName = labelObj["label"]
    var labelChecked = labelObj["checked"]
    var div = $('<div>')
    var checkbox = $('<input type="checkbox" name="checkbox1" checked=true>')
    div.append(checkbox)
    if(labelChecked==true){
        $(checkbox).attr('checked');
    }
    else{
        $(checkbox).removeAttr('checked');
    }
    var labelSpan = $('<span>')
    labelSpan.html(labelName+"<br>")
    div.append(labelSpan)
    return div
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

function createBlankReplyDiv(parentTweetId){
	
    var containerDiv = $("<div class='replyTextDiv'>")
	var div = $("<textarea class='replyTextArea' id='replyTo-"+parentTweetId+"'>")
	var replyButton = $("<input type='button' class='replyButton' value='post'>")
	

    wrap = function(d,divCopy, twtId){
        d.click(function(){
        replyText = divCopy.val();
        saveReply(replyText,twtId)  
        })
    }
    wrap(replyButton, div,parentTweetId)
    
    containerDiv.append(div);
	containerDiv.append(replyButton);
    
    return containerDiv
    
}


function saveReply(replyText,parentTweetId){
    /*
	username=getUserName();
	if(username!="" && $("#signInOut").val()!="Sign In"){
		
		ajax("saveTweet", {"parentTweetId" : parentTweetId, "replyText":replyText,"username":username}, function(returnData) {	
			
			parsedReturnData = JSON.parse(returnData)
			var baseTweetFeed=parsedReturnData["twitterFeed"]
			var discussionFeed=parsedReturnData["discussionFeed"]
			var likes =  parsedReturnData["likes"]
			
			var baseTweetId = discussionFeed[0]["tweetObject"]["id"]
			
			updateDiscussionFeed(baseTweetId,discussionFeed,likes)
            
			displayHashtagSummary(JSON.parse(returnData)["hashtagSummary"])
			checkForUpdates();

		});
	}
	else{
		alert("Please Sign In Before Commenting")
	}
    */
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

function createReplyDiv(replyObj, level){
	var replyHTML = replyObj["html"]
    var replyId= replyObj["id"]
    var replyAuthor = replyObj["user"]
    var replyLikesCount = replyObj["likes"].length
    
    div = $("<div class='tweet subReplyTextArea' id= '"+replyId+"'>")
    barDiv = $("<div style='margin-top:25px;'>")
    //indent the tweet based on how deeply threaded it is
	//multiply by 30 px per level
    div.css('margin-left',5+level*30+"px");
    
    replyContentDiv = $("<div>")
    replyContentDiv.html("<b>"+replyAuthor + "</b><br>" + replyHTML)
    
    var replyButton = $("<input type=button id='replyTo-"+replyId+"' value='reply' style='float: right;' class='unclicked'>")
    var postPlaceholderDiv = $("<div class='postPlaceholder unclicked'>")
    
    /*    
    wrap = function (button, placeholderDiv,twtId){
	    button.click(function(){
		    toggleReplyDiv(placeholderDiv,twtId)
		    
	    })
    }
    wrap(replyButton, postPlaceholderDiv,replyId)
    */
    /*
    var likesCount = filterArray(likes, function(x){return x["id"]==replyId}).length;
    
    var userLikesCount = filterArray(likes, function(x){return x["id"]==replyId && x["username"]==getUserName()}).length;
    */
    
    var editButton = $("<input type='button' id='edit-"+replyId+"' value='edit' style='float: right;' >")
    var likeButton = $("<input type='button' id='like-"+replyId+"' value='like' style='float: right;' >")
   
    
    var likeImage = $("<img id='likeImage' src='http://homes.cs.washington.edu/~felicia0/images/twitify/likeButton.png' height='40px' style='float: right; height:25px;'>")
    
    
    var label = $("<span id='likesCount-"+replyId+"'>");
    label.text("("+replyLikesCount +")");
    label.css('height','25px');
    label.css('float','right');
    label.css('padding-top','4px');
    /*
    if(userLikesCount>0){
	    likeButton.val("Unlike");
    }
    else{
	    likeButton.val("like");
    }
    */
    /*
    wrapEditButton = function (button, replyDiv, currentContent,twtId){
	    button.click(function(){
		    displayEditDialog(replyDiv, currentContent,twtId)
		    
	    })
    }
    wrapEditButton(editButton, div, tweetHTML,tweetId)
    
    
    wrapLikeButton = function (button,twtId,usrLikesCount){
    button.click(function(){
    	if(usrLikesCount==0){
		    ajax("updateLikes", {"tweetId" : twtId}, function(returnData) {
			    refreshDiscussion(twtId); 
		    });
	    }
	    
    })
    }
    
    wrapLikeButton(likeButton,tweetId,userLikesCount)
    */
    div.append(replyContentDiv)
    barDiv.append(replyButton);
    barDiv.append(editButton)
    barDiv.append(likeButton);
    /*
    if(likesCount >0){
        barDiv.append(likeImage);
	    barDiv.append(label);
    }
    */
    barDiv.append(postPlaceholderDiv);
    div.append(barDiv)
    return div;
}