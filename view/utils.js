
var filterArray = function(arr, fun ){
    if (arr == null)
      throw new TypeError();
 
    var t = Object(arr);
    var len = t.length >>> 0;
    if (typeof fun != "function")
      throw new TypeError();
 
    var res = [];
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in t)
      {
        var val = t[i]; // in case fun mutates arr
        if (fun.call(thisp, val, i, t))
          res.push(val);
      }
    }
 
    return res;
  }

var filterDictionary = function(dict, fun ){
    if (dict == null)
      throw new TypeError();
 
    var t = Object(dict);
    var len = t.length >>> 0;
    if (typeof fun != "function")
      throw new TypeError();
 
    var res = {};
    for (var i in dict)
    {
        var thisp = arguments[1];
        var val = t[i]; // in case fun mutates arr
        if (fun.call(thisp, val, i, t))
          res[i] = val;
      
    }
 
    return res;
  }
  
var dictToArray = function(dict){
    if (dict == null)
      throw new TypeError();
  
    var res = [];
    for (var i in dict)
    {
        res.push(dict[i]);
    }
 
    return res;
  }
  
var map = function(arr, fun )
  {
    var len = arr.length;
    if (typeof fun != "function")
      throw new TypeError();

    var res = new Array(len);
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in arr)
        res[i] = fun.call(thisp, arr[i], i, arr);
    }

    return res;
  }; 

var getTime = function(){
	var d = new Date();
	var t = d.getTime()
	return t	
}

var arrayContains = function(arr, val){
	return arr.indexOf(val) > -1;
}

var	arrayIntersection = function(arr1, arr2){
    var intersection = []
    for( i in arr1){
        elti = arr1[i]
        if( arrayContains(arr2, elti) ){
            intersection.push(elti)
        }
    }
    return intersection
}
var clone = function(obj) {
		if (null == obj || "object" != typeof obj) return obj;
		var copy = obj.constructor();
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
		}
		return copy;
	}