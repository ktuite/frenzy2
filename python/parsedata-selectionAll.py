import csv  
import json  
import pprint
pp = pprint.PrettyPrinter(indent=4)


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
import codecs
#f = codecs.open("listOfSubmissions.csv", "rU", "ISO-8859-1")
f = open( 'listOfSubmissions.csv', 'r' )  
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

def createItem(id, html, content, creationTime, keywords):
	item = {
		"id": id,
		"html": html,
        "content": content,
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
def createHTML(id, title, authorList, abstract):
    shortAbstract = abstract[:70]
    splitAuthorList = map( lambda x: x.strip() , authorList.split(","))
    authorListHTML = ""
    for author in splitAuthorList:
        authorListHTML = authorListHTML + author + "<br>"
    return "<b>"+id+"</b><br><b>"+title+"</b><br><span id='authors"+id+"'>"+authorListHTML+"</span><br> <span id='short-abstract-"+id+"'> <b>Abstract: </b>"+shortAbstract+"...<span id='more-abstract-"+id+"' class='more-abstract'>(more)</span></span>   <span id='full-abstract-"+id+"' > <b>Abstract: </b>"+abstract+"<span id='less-abstract-"+id+"' class='less-abstract'>(less)</span></span>"

def createItemContent(id, title, authorList, abstract):    
    itemContent = {}
    itemContent["id"] = id
    itemContent["title"] = title
    itemContent["authorList"] = map( lambda x: x.strip() , authorList.split(","))
    itemContent["shortAbstract"] = abstract[:70]
    itemContent["fullAbstract"] = abstract
    return itemContent

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
        
        itemContent = createItemContent(id, title, authorList, abstract)
        itemHtml = createHTML(id, title, authorList, abstract)
        
        
        splitKeywords = map( lambda x: x.strip() , keywords.split(";"))        
        newItem = createItem(id, itemHtml, itemContent, counter, splitKeywords)
        counter += 1	

        '''
        only use the items if they have a keyword in the list
         
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
        '''   
        
        allData["items"][id] = newItem
        #print allData["items"][id]
        for s in splitKeywords:
            if s in allKeywords:
                allKeywords[s].append(id)
            else:
                allKeywords[s] = [id]            

#put all the keywords in the allData["labelList"]
#initialize TFIDF
for k in allKeywords:
    keyWordObj = {	
        "label" : k,
        "creator": "system",    
        "itemsUsedBy" : allKeywords[k],
        "user" : "cscw",
        "creationTime" : 0
    }
    allData["labelList"][k] = keyWordObj
    '''
    allData["tfidf"][k] = {}
    allItems = allData["items"]
    for itemId in allItems:
        allData["tfidf"][k][itemId] = {
            "frequency" :  0,
            "idf" : 0,
            "tfidf" : 0
        }
    '''
print "counter: ", counter


	
def findOutItemsIn10to30():
    midsizeCategories = []
    allLabels = []
    for label in allKeywords:
        
        items = allKeywords[label]
        numItems = len(items)
        allLabels.append({"label":label, "numItems":numItems})
        print numItems, label
        if numItems >= 10 and numItems <= 30 :
            midsizeCategories.append(label)
        
    pp.pprint(sorted(allLabels, key=lambda label: label["numItems"], reverse=True))
    
    itemsWith = []
    itemsWithout = []
    for itemId in allData["items"]:
        #labels = itemObj["labels"]
        labels = allData["items"][itemId]["labels"]
        inWith = False
        for label in labels:
            #pp.pprint(label)
            if label in midsizeCategories:
                inWith = True
        if inWith:
            itemsWith.append(itemId)
        else:
            itemsWithout.append(itemId)

    print "itemsWith: ", len(itemsWith)        
    print "itemsWithout: ", len(itemsWithout)        
#findOutItemsIn10to30()

	
print "JSON parsed!"  
# Save the JSON  
f = open( 'C:/Users/hmslydia/Documents/GitHub/frenzy2/testing/cscwDataAll.js', 'w')  

allData = json.dumps(allData, ensure_ascii=False) 
f.write("allData = "+allData)  
print "JSON saved!"  
