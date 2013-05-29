{
"items" : {
	"item0": {
        "creationTime": 0, 
        "html": "<b>Gesture Output: Eyes-Free Output: Using a Force Feedback Touch Surface</b><br><br>", 
        "id": "item0", 
        "creator": "frenzy",
        "lastUpdatedTime": 0,
        "replies": ["reply0", "reply1"],
        "selectableHashtags": [{
            "hashtag":"blue", 
            "selected": "true",
            "attentionLevel": "high"
            "likes" : [{}]
            }
        ]        
    }, 
    "item1": {
        "creationTime": 1, 
        "html": "<b>iMuscle: Mobile Force-Feedback based on Electrical Muscle Stimulation</b><br><br>", 
        "id": "item1", 
        "creator": "frenzy",
        "lastUpdatedTime": 0,
        "replies": [],
        "selectableHashtags": []
    }
},
"replies" : {
    "reply0" : {
        "creationTime" : 2,
        "text": "asdf",
        "creator" : "user1",
        "likes" : [{"username": "user2", "time": 3 }]
        "item": "item0",
        "parent": "item0"
    }
    "reply1" : {
        "creationTime" : 3,
        "text": "asdf2",
        "creator" : "user2",
        "likes" : []
        "item": "item0",
        "parent": "reply0"
    }    
},
"hashtagHierarchy": [],
"completionFeedback": {}, //{"complete":0, "incomplete":0}

"users": {
	"user1":{
		"id":"user1",
		"counter":0,
        "creationTime": 0
	}
	"user2":{
		"id":"user2",
		"counter":0,
        "creationTime": 0
	}    
},
"chat" : [
	{	"user":"user1",
		"comment":"Hello World!",
		"time":0
	},
    {	"user":"user2",
		"comment":"meow",
		"time":1
	}
],
"currentLocations" : [
	{	"user":"user1",
		"location":"item0"
	},
	{	"user":"user2",
		"location":"item1"
	}     
]
}