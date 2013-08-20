function handleUpdatedCompletion(completion){
	var completedItemIds = completion["completedItemIds"]
	var incompletedItemIds = completion["incompletedItemIds"]
	
	var numCompletedItemIds = completedItemIds.length
	var numIncompletedItemIds = incompletedItemIds.length
	displayLabelCompletionProgress(numCompletedItemIds, numIncompletedItemIds)

}



var goalAchievedTime = -1

function goalSetup(){
	var goalDescription
	if (sessionMaking) {
		goalDescription = "<b>Goal:</b><br>Every paper needs to be in a session."
	} else {
	    // goalDescription = "Every paper needs to have at least one category with a vote for session-making potential (and with at least 2 papers in the category)."
	    goalDescription = "<b>Goal1:</b>  Every category must have at least 2 papers in it. (No singleton categories)<br/>" +
						"<b>Goal2:</b>  Every paper needs to be in least one category with +1 for session-making potential."
	}
	$("#goalDescription").html(goalDescription)
}

function displayLabelCompletionProgress(numCompletedItemIds, numIncompletedItemIds){
	var buttonPhrase = sessionMaking ? { complete: "Complete", needWork: "Unsessioned"} : { complete: "Complete", needWork: "Need Work"}

    $("#goalFeedback").empty()
    var happyButton = $("<input type='button' class='btn' id='matchingRequirmentsButton' value='"+numCompletedItemIds+" " + buttonPhrase.complete + "'> ")
	happyButton.click(function(){
        //ajax("logFeedbackClicks", {"uiElt":"complete", "notes":numCompletedItemIds}, function(returnData) {})
        query = {
			"type" : "completed",
			"checked" : true,
			"sortOrder" : "creationTime"
		}
		getAllData()
    })
    $("#goalFeedback").append(happyButton)
	
    // UNsatisfied Constraints
	var sadButton = $("<input type='button' class='btn' id='nonMatchingRequirmentsButton' value='"+numIncompletedItemIds+" " + buttonPhrase.needWork + "'> ")
	sadButton.click(function(){
		//ajax("logFeedbackClicks", {"uiElt":"incomplete", "notes":numIncompletedItemIds}, function(returnData) {})
        query = {
			"type" : "incompleted",
			"checked" : true,
			"sortOrder" : "creationTime"
		}
		getAllData()
	})
    $("#goalFeedback").append(sadButton)
}

/////////////////////////////
// OLD
/////////////////////////////
function displayConditionsUpdate(matchingBaseTweetObjects, nonMatchingBaseTweetObjects,likes){
    var numMatchingTweetObjects = matchingBaseTweetObjects.length
	var numNonMatchingBaseTweetObjects = nonMatchingBaseTweetObjects.length
	
	if( checkGoalsCompleted(numNonMatchingBaseTweetObjects) ){
		goalAchievedTime = getTime()
		displayGoalSuccess()
	}else{
		goalAchievedTime = -1
	}
	
	updateGoalStatus()
    
    //remove old feedback and create new completeness buttons
    $("#goalFeedback").empty()
    var happyButton = $("<input type='button' class='btn' id='matchingRequirmentsButton' value='"+numMatchingTweetObjects+" Complete'> ")
	happyButton.click(function(){
        ajax("logFeedbackClicks", {"uiElt":"complete", "notes":numMatchingTweetObjects}, function(returnData) {})
        displayFeed(matchingBaseTweetObjects,likes)
    })
    $("#goalFeedback").append(happyButton)
	
    // UNsatisfied Constraints
	var sadButton = $("<input type='button' class='btn' id='nonMatchingRequirmentsButton' value='"+numNonMatchingBaseTweetObjects+" Need work'> ")
	sadButton.click(function(){
		ajax("logFeedbackClicks", {"uiElt":"incomplete", "notes":numNonMatchingBaseTweetObjects}, function(returnData) {})
        displayFeed(nonMatchingBaseTweetObjects,likes)
	})
    $("#goalFeedback").append(sadButton)
    
    positionTwitterFeedBelowCompletenessEvaluation()
}

function checkGoalsCompleted(numNonMatchingBaseTweetObjects){
	if(numNonMatchingBaseTweetObjects > 0){
		return false
	}else if(numSingletonHashtags() > 0 ){
		return false
	}else{
		return true	
	}
}

function numSingletonHashtags(){
	var count = 0
    for(i in answer){
        var hashtagSummaryItem = answer[i]
        var hashtag = hashtagSummaryItem["hashtag"]["hashtag"]
        var counts = hashtagSummaryItem["hashtag"]["memberTweetIds"].length
        
		if(counts == 1){
			count++
		}
    } 
	return count
}

function displayGoalSuccess(){
	//calculated the time since the goal was achieved.
	var currentTime = getTime()	
	var millisecondsSinceGoalAchieved = currentTime - goalAchievedTime
	var minutesSinceGoalAchieved = millisecondsSinceGoalAchieved/(60*1000)
	
	if(minutesSinceGoalAchieved < 1 ){
		
	}else if (minutesSinceGoalAchieved < 2){
	
	}else if(minutesSinceGoalAchieved < 3){
	
	}else if(minutesSinceGoalAchieved < 4){
	
	}

}