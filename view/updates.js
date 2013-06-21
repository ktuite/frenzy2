

function handleUpdates(result){  
    var updatedItems = result["updatedItems"]
    handleUpdatedItems(updatedItems)
}

//////////////////////////////////////////
// update items in feed
//////////////////////////////////////////

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
    var itemId = updatedItem["id"]
    $("#"+itemId).html(newItemDiv)
}

/*
function createItemDiv(updatedItem){
        var id = updatedItem["id"]
        var html = updatedItem["html"]
        var replies = updatedItem["replies"]
        var replyCounter = updatedItem["replyCounter"]
        var lastUpdateTime = updatedItem["lastUpdateTime"]
        var labels = updatedItem["labels"]    
        
        var div = $("<div id='"+id+"'>")
        div.html(html)
        return div
}
*/
function pushNewItemDivsOnFeedInReverseTimeOrder(newItemDivs){
    newItemDivs.sort(function(a,b){return a["lastUpdateTime"] - b["lastUpdateTime"]})
    for( var i in newItemDivs){
        var newItemDiv = newItemDivs[i]["div"]        
        $("#feed").prepend(newItemDiv)
    }
}












/*
//////////////////////////////////////////
// completion update helpers
//////////////////////////////////////////
var int = self.setInterval(function(){checkForUpdates()},1000);

function checkForUpdates(){
	ajax("getUpdates",{"completionConditionHashtags": getCompletionConditionHashtags()}, function(returnData) {
		var count = JSON.parse(returnData)["newTweetCount"]
		var newTweetCreators = JSON.parse(returnData)["newTweetCreators"]
		
		
        colorNewTweetsInTheFeedAndUpdateNewTweetCount(newTweetCreators);
        
        var completionDataObjects = JSON.parse(returnData)["completionDataObjects"]
        var likes = JSON.parse(returnData)["likes"]
		displayCompletionData(completionDataObjects,likes)
        
        }
    )
}

function displayCompletionData(completionDataObjects,likes){
	var matchingBaseTweetObjects = completionDataObjects["matchingBaseTweetObjects"]
	var nonMatchingBaseTweetObjects = completionDataObjects["nonMatchingBaseTweetObjects"]

	displayConditionsUpdate(matchingBaseTweetObjects, nonMatchingBaseTweetObjects,likes)
}

function updateNewTweetCount(count){
	if(count>0){
		$("#countPlaceholder").empty();
		
		leftCounterDiv = $("<div id='newTweetCounter'>");
		leftCounterDiv.text(count);
		
		leftCounterDiv.click(function(){
			goToHome();
			$("#countPlaceholder").empty();
		});
		
		$("#homeButton").attr('src','http://homes.cs.washington.edu/~felicia0/images/twitify/homebuttonNewMessages5.png');
		$("#counter").text(count);
	}
	else{
		$("#countPlaceholder").empty();
		$("#homeButton").attr('src','http://homes.cs.washington.edu/~felicia0/images/twitify/homebutton.png');
		$("#counter").text("");
	}
}


function outputHierarchy(outputButton){
	ajax("getTwitterFeed", {}, function(returnData) {
		createOutput(JSON.parse(returnData)["hashtagSummary"],JSON.parse(returnData)["twitterFeed"])
	});
}



function createOutput (hashtagSummary,twitterFeed) {

  var userName = getUserName()
  var newPage = "<html><head><title>"
  newPage += userName;
  newPage += "</title></head><body>";
  newPage += "<p>Output " + userName;
  newPage += "</p></body></html>";

  newPage+=outputHashtagSummary(hashtagSummary,twitterFeed)
  
  var j = window.open();
  j.document.write(newPage);
  //j.document.close();
}


function outputHashtagSummary(hashtagSummary,twitterFeed){
	var tweetIdsWithHashTags=[]
   	var baseTweets = filterArray(twitterFeed, function(tweetObj){ return tweetObj["basetweet"]["parent"]=="none" })
   	var baseTweetIds = map(baseTweets, function(x){return x["basetweet"]["id"]})

    var newPageDiv=$("<div id='newPageDiv'>")
    
    answer = []
    var allHashtags = []
    for( i in hashtagSummary){
        var hashtagObject = hashtagSummary[i]
        allHashtags.push({"hashtag":hashtagObject, "parents":[]} )
    }
    orderAndEnchild(allHashtags, allHashtags)

    for(i in answer){
        var hashtagSummaryItem = answer[i]
        var hashtag = hashtagSummaryItem["hashtag"]["hashtag"]
        var memberTweetIds = hashtagSummaryItem["hashtag"]["memberTweetIds"]
        var indents = hashtagSummaryItem["parents"].length
        var counts = hashtagSummaryItem["hashtag"]["counts"]
        
        tweetIdsWithHashTags.push.apply(tweetIdsWithHashTags,memberTweetIds)

        var ul=$("<ul>")
        ul.css('list-style-type','none');
        hashtagDiv = createHashtagli(hashtag, counts)

        var images = getImagesInHashtagAsHtml(hashtag,indents,hashtagSummary,twitterFeed,hashtagDiv);
        ul.append(images)
        
        newPageDiv.append(ul);
    }  
    
    //remove duplicates
    tweetIdsWithHashTags=tweetIdsWithHashTags.filter(function(item, index) {
            return tweetIdsWithHashTags.indexOf(item) == index;
    });
    
    var uncategorizedTweetIds = baseTweetIds.filter(function(i) {return !(tweetIdsWithHashTags.indexOf(i) > -1);});
  
    var ul=$("<ul>")
    var li =$("<li>")
    li.text("Uncategorized");
    ul.append(li);
    ul.css('list-style-type','none');
    ul.css('margin-left',"30px")
    for(uncat in uncategorizedTweetIds){
	    tweetId = uncategorizedTweetIds[uncat]

	    var imageHtml=$("<li>");
	    var html = filterArray(twitterFeed, function(x){return x["basetweet"]["id"]==tweetId})[0]["basetweet"]["html"]
	  
	    imageHtml.css('width',"200px")
	    imageHtml.css('display','inline-block')
        imageHtml.append(html)
        ul.append(imageHtml);
    }
    newPageDiv.append(ul);

   return newPageDiv.html();
}


function getImagesInHashtagAsHtml(hashtag,indent, hashtagSummary,twitterFeed,hashtagDiv){
	var imageHtml=$("<li>");
	var tweetIds = getListOfTweetIdsForHashtag(hashtagSummary,hashtag);
	var filteredTweets = filterArray(twitterFeed, function(x){ return tweetIds.indexOf(x["basetweet"]["id"])>-1})

	var imagesDivUL=$("<ul>")
	imagesDivUL.css('list-style-type','none');
	imagesDivUL.css('margin-left',indent*30+"px")
	imagesDivUL.append(hashtagDiv);
	for(t in filteredTweets){
		var tweet = filteredTweets[t]
		var tweetHtml = tweet["basetweet"]["html"]
		
		var imagesDiv=$("<li>")
		imagesDiv.css('margin-left',indent*30+"px")
		imagesDiv.css('display','inline-block')
		imagesDiv.css('width',"200px")
        imagesDiv.append(tweetHtml);
        
        imagesDivUL.append(imagesDiv)
	}
	imageHtml.append(imagesDivUL);
	return imageHtml
}

function getListOfTweetIdsForHashtag(allHashTags,hashtag){
	var filteredArray= filterArray(allHashTags, function(x){ return (x["hashtag"])==hashtag})
	var tweetIds = map(filteredArray, function(x){return x["memberTweetIds"]})
	return tweetIds[0]
}


function getListOfHashTagsForBaseTweet(baseTweetId,allHashTags){
	var hts = getHashtagSummaryForBaseTweet(baseTweetId,allHashTags)
	var hashTags = map(hts, function(x){return x["hashtag"]})
	return hashTags
}

function getHashtagSummaryForBaseTweet(baseTweetId,allHashTags){
	//{"hashtag": hashtag, "counts":counts, "memberTweetIds": baseTweets}

	var filteredArray= filterArray(allHashTags, function(x){ return (x["memberTweetIds"]).indexOf(baseTweetId)>-1})
    return filteredArray;
    
}



function createHashtagli(hashtag, counts){
    div= $("<li>")
    div.text(hashtag + " ("+counts+") ")
    return div
}
*/