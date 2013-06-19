/*
app.get('/getUpdates', function(request, response) { 
	var d = new Date();
	var n = d.getTime();
	respondToClientUpdateRequest(n)
	response.send(allData)
}); 
*/

app.get(/^\/sendUpdate\/(.+)$/, function(request, response) { 
	var update = request.params[0]
	handleClientUpdateData(update)
	response.send(allData)
}); 

app.get('/completionData', function(request, response) { 
	var completedItems = calculateCompletedItems()
	response.send(completedItems)
}); 

app.get('/hierarchy', function(request, response) { 
	var hierarchy = createHierarchy()
	response.send(hierarchy)
}); 

app.get('/singletonLabels', function(request, response) { 
	var singleton = calculateSingletonLabels()
	response.send(singleton)
}); 


app.get(/^\/filterItemsByLabel\/(.+)$/, function(request, response) { 
	var label = request.params[0]
    /*console.log(label)*/
	var filteredItemIds = filterItemIdsByLabel(label)
    console.log(filteredItemIds)
	response.send(filteredItemIds)
}); 

//TODO
app.get('/sortItemIdsByLastUpdated', function(request, response) { 
	var allItemIds = Object.keys(allData["items"])
	//console.log(allItemIds)
	var itemIdsSortedByLastUpdated = sortItemIdsByLastUpdated(allItemIds)
	response.send(itemIdsSortedByLastUpdated)
}); 

app.get(/^\/getAllItemObjectsUpdatedSinceTimeT\/(.+)$/, function(request, response) { 
	var t = request.params[0]
    /*console.log(label)*/
	var allItemObjectsUpdated = getAllItemObjectsUpdatedSinceTimeT(t)
    
	response.send(allItemObjectsUpdated)
});

app.get('/sortItemIdsByMostReplies', function(request, response) { 
	var allItemIds = Object.keys(allData["items"])
	//console.log(allItemIds)
	var itemIdsSortedByMostReplies = sortItemIdsByMostReplies(allItemIds)
	response.send(itemIdsSortedByMostReplies)
});

app.get('/sortItemIdsByMostLabels', function(request, response) { 
	var allItemIds = Object.keys(allData["items"])
	//console.log(allItemIds)
	var itemIdsSortedByMostLabels = sortItemIdsByMostLabels(allItemIds)
	response.send(itemIdsSortedByMostLabels)
});

app.get('/sortItemIdsByLeastLabels', function(request, response) { 
	var allItemIds = Object.keys(allData["items"])
	//console.log(allItemIds)
	var itemIdsSortedByLeastLabels = sortItemIdsByLeastLabels(allItemIds)
	response.send(itemIdsSortedByLeastLabels)
});

app.get(/^\/findItemsWithTextT\/(.+)$/, function(request, response) { 
	var t = request.params[0]
    /*console.log(label)*/
	var allItemIdsWithText = getAllItemIdsWithTextT(t)
    
	response.send(allItemIdsWithText)
});