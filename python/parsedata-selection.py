import csv  
import json  
import pprint
pp = pprint.PrettyPrinter(indent=4)

goodLabels = [
"Legal/historical/philosophical aspects",
"Concurrency control",
"B2B / information systems"
]

'''
"Studies of Wikipedia/Web",
"Entertainment/games",
"Development Tools / Toolkits / Programming Environments",
"Virtual Worlds/Avatars/Proxies",
"Workflow management",
"Tabletop and Large Wall Displays",
"Recommender and Filtering Systems",
"Collaborative visualization",
"Telepresence/video/desktop conferencing",
"Legal/historical/philosophical aspects",
"Concurrency control",
"B2B / information systems"
''' 
 
print goodLabels
''' 
# Open the CSV  
f = open( 'listOfSubmissions.csv', 'rU' )  
# Change each fieldname to the appropriate field name. I know, so difficult.  
reader = csv.DictReader( f)  
# Parse the CSV into JSON  
out = json.dumps( [ row for row in reader ] )  
'''

allData = {
    "items":{},
	"labelList": {},
    "users":{},

    "hierarchy":{},
    "hierarchyLastUpdated":-1,
	
    "completion":{},
	"completionLastUpdated":-1,

    "chat":[],
    "userLocations":[], 

    "history":{ 
        "locations":[], 
        "events":[]
    },
	
	"tfidf":{},
	"tfidfLastUpdated":-1,
	
}

import csv
f = open( 'listOfSubmissions.csv', 'rU' )  
reader = csv.reader(f, skipinitialspace=True)
lines = list(reader)

'''

item1 = {
	"id": "item1",
    "html": "<b>item1 woof</b>",
	"replies" : [],
	"replyCounter" : 0,
	"lastUpdateTime" : 12344556,
	"creationTime": 1, 
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

allData["items"]["item1"] = item1
allData["items"]["item0"]["labels"]["animal"] = label1Ref
allData["labelList"]["animal"] = label1
'''

def createLabelRef(label):
	labelRef = {
		"label": label,
		"checked": True,
		"likes" : [],
		"dislikes" : [],
		"lastUpdateTime" : 123456789
	}
	return labelRef

def createItem(id, html, creationTime, keywords):
	item = {
		"id": id,
		"html": html,
		"replies" : [],
		"replyCounter" : 0,
		"lastUpdateTime" : 0,
		"creationTime": creationTime, 
		"labels": {},
		"session": "none"
	}
	for k in keywords:
		labelRef = createLabelRef(k)
		item["labels"][k] = labelRef
	return item
	
def createHTML(id, title):
	return "<b>"+id+"</b><br>"+title

#populate allData["items"]
allKeywords = {}
counter = 0
for line in lines[8:] :
	if len(line) > 100 :
		id = line[0]
		decision = line[1]
		title = line[2]
		keywords =  line[99]
		abstract = line[100]
        
        itemHtml = createHTML(id, title)
        
        splitKeywords = map( lambda x: x.strip() , keywords.split(";"))        
        newItem = createItem(id, itemHtml, counter, splitKeywords)
        counter += 1	

        '''
        only use the items if they have a keyword in the list
        '''    
        containsAGoodLabel = False
        
        for keyword in splitKeywords:
            if keyword in goodLabels:
                containsAGoodLabel = True
                if keyword in allKeywords:
                    if id not in allKeywords[keyword]:
                        allKeywords[keyword].append(id)
                else:
                    allKeywords[keyword] = [id]

        if containsAGoodLabel:    
            allData["items"][id] = newItem                
			

#print pp.pprint(allData["items"])    

#put all the keywords in the allData["labelList"]
#initialize TFIDF
for k in allKeywords:
	keyWordObj = {	
		"label" : k,
		"itemsUsedBy" : allKeywords[k],
		"user" : "cscw",
		"creationTime" : 0
	}
	allData["labelList"][k] = keyWordObj
	
	
	
	allData["tfidf"][k] = {}
	allItems = allData["items"]
	for itemId in allItems:
		allData["tfidf"][k][itemId] = {
			"frequency" :  0,
			"idf" : 0,
			"tfidf" : 0
		}
	
#print allData["tfidf"]

pp.pprint(allData["labelList"])	

	
	
print "JSON parsed!"  
# Save the JSON  
f = open( 'C:/Users/hmslydia/Documents/GitHub/frenzy2/testing/cscwData12labels.js', 'w')  
allData = json.dumps(allData) 
f.write("allData = "+allData)  
print "JSON saved!"  
