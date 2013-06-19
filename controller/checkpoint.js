app.get('/checkpoint', function(){ 
	checkpoint()
});  

app.get(/^\/restore\/(\d+)$/, function(request, response) {
	var timestamp = request.params[0]
	console.log("timestamp = " + timestamp);
	// restore the timestamp
	fs.readFile("./saved/data"+timestamp+".js", function(err, restoredData) {
		if(err) {
			console.log(err);
			response.send("can't restore");
		} else {
			// restoredData may begin with "variable = ", so strip that
			restoredData = restoredData.toString().replace(/^\w+\s*=\s*/, "");
			var newResults = JSON.parse(restoredData);

			// see whether this actually changed anything
			var currentResultsJSON = JSON.stringify(allData);
			var newResultsJSON = JSON.stringify(newResults);
			var message = "restored " + timestamp +
				" which " +
				(currentResultsJSON != newResultsJSON ? "changed" : "didn't change") +
				" the results state";
			console.log(message)

			// make sure the current state is checkpointed, so we don't
			// lose anything by restoring
			checkpoint();
			
			// now replace the results variable
			allData = newResults;
			
			response.send(message)
		}
	});
});

var checkpoint = function(){
	writeToFile(allData);
	console.log("checkpointed")
}

var writeToFile = function (json){
	var ret = "data = "+JSON.stringify(json)
	var d = new Date();
	var t = d.getTime()
	fs.writeFile("./saved/data"+t+".js", ret, function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log("The file was saved!");
		}
	}); 
}

var restoreData = function(timestamp){
	fs.readFile("./datasets/data"+timestamp+".js", function(err, restoredData) {
			if(err) {
				console.log(err);
				response.send("can't restore");
			} else {
				// restoredData may begin with "variable = ", so strip that
				restoredData = restoredData.toString().replace(/^\w+\s*=\s*/, "");
				var newResults = JSON.parse(restoredData);

				// see whether this actually changed anything
				var currentResultsJSON = JSON.stringify(allData);
				var newResultsJSON = JSON.stringify(newResults);
				var message = "restored " + timestamp +
					" which " +
					(currentResultsJSON != newResultsJSON ? "changed" : "didn't change") +
					" the results state";
				console.log(message)

				// make sure the current state is checkpointed, so we don't
				// lose anything by restoring
				//checkpoint();
				
				// now replace the results variable
				allData = newResults;
				
				//response.send(message)
			}
		});
}



    
