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

//TODO
app.get(/^\/filterItemsByLabel\/(.+)$/, function(request, response) { 
	var label = request.params[0]
    /*console.log(label)*/
	var filteredItemIds = filterItemIdsByLabel(label)
    console.log(filteredItemIds)
	response.send(filteredItemIds)
}); 