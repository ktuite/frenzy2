///////////////////////
// ITEMS
///////////////////////

item0 = {
	"id": "item0",
    "html": "<b>item0 meow</b>",
	"replies" : [],
	"replyCounter" : 0,
	"lastUpdateTime" : 12344555,
	"labels": {}
}
allData["items"]["item0"] = item0

item1 = {
	"id": "item1",
    "html": "<b>item1 woof</b>",
	"replies" : [],
	"replyCounter" : 0,
	"lastUpdateTime" : 12344556,
	"labels": {}
}
allData["items"]["item1"] = item1

label1 = {
	"label" : "animal",
	"itemsUsedBy" : ["item0", "item1"],
	"user" : "hmslydia",
	"creationTime" : 123456789
}

label1Ref = {
	"label": "animal",
	"checked": true,
	"likes" : [],
	"dislikes" : [],
	"lastUpdateTime" : 123456789
}

label2Ref = {
	"label": "animal",
	"checked": true,
	"likes" : [],
	"dislikes" : [],
	"lastUpdateTime" : 123456789

}

label2 = {
	"label" : "snake",
	"itemsUsedBy" : ["item1"],
	"user" : "hmslydia",
	"creationTime" : 123456789
}
snakesRef = {
	"label": "snake",
	"checked": false,
	"likes" : [],
	"dislikes" : [],
	"lastUpdateTime" : 123456789

}

label3 = {
	"label" : "horse",
	"itemsUsedBy" : ["item0"],
	"user" : "hmslydia",
	"creationTime" : 123456789
}
horseRef = {
	"label": "horse",
	"checked": true,
	"likes" : [],
	"dislikes" : [],
	"lastUpdateTime" : 123456789

}

allData["items"]["item0"]["labels"]["animal"] = label1Ref
allData["items"]["item1"]["labels"]["animal"] = label2Ref
allData["items"]["item1"]["labels"]["snake"] = snakesRef
allData["items"]["item0"]["labels"]["horse"] = horseRef

allData["labelList"]["animal"] = label1
allData["labelList"]["snake"] = label2
allData["labelList"]["horse"] = label3

///////////////////////
// REPLIES
///////////////////////

var reply1 = {"type": "replyToItem", "user" : "hmslydia", "time" : 1, "itemId" : "item0", "html" : "<b>my reply</b>", "parentId": ""}
var reply2 = {"type": "replyToItem", "user" : "hmslydia", "time" : 2, "itemId" : "item0", "html" : "<b>my reply 2 </b>", "parentId": "item0-reply0"}
var reply3 = {"type": "replyToItem", "user" : "hmslydia", "time" : 2, "itemId" : "item1", "html" : "<b>my reply 2 1</b>", "parentId": ""}

handleReplyToItem(reply1)
handleReplyToItem(reply2)
handleReplyToItem(reply3)