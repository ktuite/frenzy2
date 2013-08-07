function createLabelDiv(labelObj){
    var labelParents = labelObj["parents"]
    var label = labelObj["label"]["label"]
    var labelHTML = labelObj["label"]["labelHTML"]
    var counts = labelObj["label"]["counts"]
	var memberItemIds = labelObj["label"]["memberItemIds"]
    
    var div = $("<div class='categoryClickable'>")
    //div.text(label + " ("+counts+") ")
	div.append(labelHTML)
    
	var numParents = labelParents.length
    div.css('margin-left',(30*numParents)+"px")
	div.click(function(){
		//console.log(label)
		//console.log(memberItemIds)
		query = {
			"type" : "label",
			"label" : label,
			"checked" : true,            
            "sortOrder" : "creationTime"
		}
		getAllData("synchronous")
		//filterItemsByLabel(memberItemIds)
	})
    return div
}



/*
function filterItemsByLabel(memberItemIds){
	
	var newItemDivs = []    
    
	for(var i in memberItemIds){
		var memberItemId = memberItemIds[i]
		console.log(memberItemId)
		console.log(items)
		var memberItemObj = items[memberItemId]
		var newItemDiv = createItemAndReplyDiv(memberItemObj)
		newItemDivs.push(newItemDiv)
		//$("#feed").append(newItemDiv)
	}
	console.log(newItemDivs)
	pushNewItemDivsOnFeed(newItemDivs)

}
*/
/*
function handleUpdatedItems(updatedItems){  
	var newItemDivs = []    
    for( var i in updatedItems){  
		
        var updatedItemObj = updatedItems[i]
        var id = updatedItemObj["id"]
        var lastUpdateTime = updatedItemObj["lastUpdateTime"]
        
		//push the item to the top of the stack in the order it is given to you
		var newItemDiv = createItemAndReplyDiv(updatedItemObj)
		newItemDivs.push(newItemDiv)	
        
        //update the local data structure
        items[id] = updatedItemObj        
    }    
    pushNewItemDivsOnFeed(newItemDivs)
}
function pushNewItemDivsOnFeed(newItemDivs){
    $("#feed").empty()     
	
    for( var i in newItemDivs){
        var newItemDiv = newItemDivs[i]      
        $("#feed").prepend(newItemDiv)
    }
}
*/