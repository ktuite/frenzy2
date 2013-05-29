module.exports = function(app, utils, fs, allData) {
    this.asdf = function(arr) {
        return utils.arrayContains(arr, 1)
    };
};


//////////////////////////////////////////
//// visualize, checkpoint and restore
//////////////////////////////////////////    




/*
var count = 1;
exports.increment = function() { count++; };
exports.getCount = function() { return count; };
*/
