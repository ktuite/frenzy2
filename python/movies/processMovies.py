import csv  
import json  
import codecs
import pprint
pp = pprint.PrettyPrinter(indent=4)

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

#createHTML(id, title, authorList, abstract)	
def createHTML(id, title, starring, date):
    year = date[:4]
    authorListHTML = ""
    for author in starring:
        authorListHTML = authorListHTML + author + "<br>"
    return ""+id+"<br><b>"+title+"</b>("+year+")<br><span id='authors"+id+"'>"+authorListHTML+"</span><br> "




f = codecs.open("data.json", "r", "ISO-8859-1")
k = json.load(f)
results = k["result"]

counter = 0
allKeywords = {}
counter = 0
for r in results:
    title = r["name"]
    labels = r["genre"]
    #print r["starring"]
    starring = map( lambda x: x["actor"][0] , r["starring"])
    date = r["initial_release_date"]
    id = "movie"+str(counter)
    
    itemHtml = createHTML(id, title, starring, date)
    newItem = createItem(id, itemHtml, counter, labels)
    
    
    counter += 1
    
    containsAGoodLabel = False
    for keyword in labels:
        print keyword
        #if keyword in goodLabels:
        if True:
            containsAGoodLabel = True
            if keyword in allKeywords:
                if id not in allKeywords[keyword]:
                    allKeywords[keyword].append(id)
            else:
                allKeywords[keyword] = [id]
    if containsAGoodLabel:    
        allData["items"][id] = newItem                

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

pp.pprint(allData["labelList"])	

	
	
print "JSON parsed!"  
# Save the JSON  
f = open( 'C:/Users/hmslydia/Documents/GitHub/frenzy2/testing/movies1.js', 'w')  
allData = json.dumps(allData) 
f.write("allData = "+allData)  
print "JSON saved!"  


'''   
#populate allData["items"]
allKeywords = {}
counter = 0
for line in lines[8:] :
    if len(line) > 100 :
        id = line[0]
        decision = line[1]
        title = line[2]
        authorList = line[8]
        #print "authorList",authorList
        keywords =  line[99]
        abstract = line[100]
        
        itemHtml = createHTML(id, title, authorList, abstract)
        
        
        splitKeywords = map( lambda x: x.strip() , keywords.split(";"))        
        newItem = createItem(id, itemHtml, counter, splitKeywords)
        counter += 1	
 
        containsAGoodLabel = False
        for keyword in splitKeywords:
            print keyword
            if keyword in goodLabels:
                containsAGoodLabel = True
                if keyword in allKeywords:
                    if id not in allKeywords[keyword]:
                        allKeywords[keyword].append(id)
                else:
                    allKeywords[keyword] = [id]
        if containsAGoodLabel:    
            allData["items"][id] = newItem                

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
''' 