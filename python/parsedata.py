import csv  
import json  
 
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
    }
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
		"session": ""
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
for line in lines[8:30] :
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
		allData["items"][id] = newItem
		
		for s in splitKeywords:
			if s in allKeywords:
				allKeywords[s].append(id)
			else:
				allKeywords[s] = [id]
			
print allData


#put all the keywords in the allData["labelList"]
for k in allKeywords:
	keyWordObj = {	
		"label" : k,
		"itemsUsedBy" : allKeywords[k],
		"user" : "cscw",
		"creationTime" : 0
	}
	allData["labelList"][k] = keyWordObj


print "JSON parsed!"  
# Save the JSON  
f = open( 'C:/Users/Lydia/Documents/GitHub/frenzy2/testing/cscwDataSubset.js', 'w')  
allData = json.dumps(allData) 
f.write("allData = "+allData)  
print "JSON saved!"  
