//////////////////////////////////////////
// visualizing other editor helpers
//////////////////////////////////////////
var userLocationUpdateTimer = setInterval(function(){updateUserLocations()}, 5000);

function updateUserLocations(){
    ajax("getLocations", {}, function(returnData) {
        var locations = JSON.parse(returnData)["locations"];
        var username = getUserName()
        var idsInUse = filterArray(locations, function(x){return x["user"] != username})
        var idsInUse = map(idsInUse, function(x){return x["id"]})       
        highlightBaseTweets(idsInUse)
   });   
}

function highlightBaseTweets(listOfBasetweetIdsToHighlight){
    //remove all highlights
    $(".basetweet").each(function( index){
        $(this).removeClass("beingEdited")
    });
    
    //highlight the ones we being discussed
    for(i in listOfBasetweetIdsToHighlight){
        var idToHightlight = listOfBasetweetIdsToHighlight[i] 
        $("#"+idToHightlight).addClass("beingEdited")

    }    
}
