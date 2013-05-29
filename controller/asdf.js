module.exports = {
//module.exports = function(app, utils, fs, allData){
//////////////////////////////////////////
//// visualize, checkpoint and restore
//////////////////////////////////////////    
    asdf: function(){
        return "asdf"
    }
    

    
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

    var checkpoint = function () {
        writeToFile(allData);
    }

    // force a checkpoint
    app.get('/checkpoint', function(request, response){
        checkpoint();
        response.send("checkpointed");
    });

    // restore takes the timestamp that should be restored (from the
    // filename saved/dataTIMESTAMP.js)
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
                var currentResultsJSON = JSON.stringify(results);
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
                results = newResults;
                
                response.send(message)
            }
        });
    });

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