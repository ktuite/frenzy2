import csv  
import json  
import pprint
pp = pprint.PrettyPrinter(indent=4)

kathleensData = [
    {
        "labels": [
            {
                "id": 1, 
                "label": "Surprise"
            },
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/12894' /><h4>Face #12894</h4>", 
        "id": 12894, 
        "img": "http://www.facefrontier.com/images/12894"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1364' /><h4>Face #1364</h4>", 
        "id": 1364, 
        "img": "http://www.facefrontier.com/images/1364"
    }, 
    {
        "labels": [
            {
                "id": 98, 
                "label": "neutral"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1950' /><h4>Face #1950</h4>", 
        "id": 1950, 
        "img": "http://www.facefrontier.com/images/1950"
    }
]



allData = {
    "items":{},
    "labelList": {},
    "users":{},

    "hierarchy":{},
    "hierarchyLastUpdated":-1,
    
    "completion":{},
    "completionLastUpdated":-1,

    "chat":[],

    "history":{ 
        "locations":[], 
        "events":[]
    }    
}
'''
import csv
import codecs
f = open( 'listOfSubmissionsCut1.csv', 'r' )  
reader = csv.reader(f, skipinitialspace=True)
lines = list(reader)
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

def createContent(id, url):
    itemContent = {
        "id": id,
        "url": url
    }
    return itemContent
    
def createItem(id, url, creationTime, labels):    
    item = {
        "id": id,
        "content": createContent(id, url),
        "replies" : [],
        "replyCounter" : 0,
        "lastUpdateTime" : 0,
        "creationTime": creationTime, 
        "labels": {},
        "session": "none"
    }
    for k in labels:
        labelRef = createLabelRef(k)
        item["labels"][k] = labelRef
    return item

allLabels = {}
counter = 0

for item in kathleensData:
    id = "face"+str(item["id"])
    url = item["img"]
    labels = item["labels"]
    labelList = map(lambda x: x["label"], labels)
    newItem = createItem(id, url, counter, labelList)
    counter += 1

    allData["items"][id] = newItem
    
    #print allData["items"][id]
    for label in labelList:
        
        if label in allLabels:
            allLabels[label].append(id)
        else:
            allLabels[label] = [id]  	

'''
for line in lines[1:] :
    if len(line) > 100 :
        id = line[0]
        decision = line[1]
        title = line[2]
        authorList = line[8]
        
        authorAndAffiliationList = []
        startingIndex = 9
        
        numAuthors = len(authorList.split(","))
        for i in range(numAuthors):
            index = i*9 +startingIndex
            givenName = line[index]
            middleInitial = line[index+1]            
            familyName = line[index+2]
            aff2 = line[index+5]
            authorText = givenName+" "+familyName+", "+ aff2
            authorAndAffiliationList.append(authorText)
        
        #print "authorList",authorList
        keywords =  line[99]
        abstract = line[100]
                
        itemContent = createItemContent(id, title, authorList, abstract, authorAndAffiliationList)
        
        splitKeywords = map( lambda x: x.strip() , keywords.split(";"))        
        newItem = createItem(id, itemContent, counter, splitKeywords)
        counter += 1	
 
        
        allData["items"][id] = newItem
        #print allData["items"][id]
        for s in splitKeywords:
            if s in allKeywords:
                allKeywords[s].append(id)
            else:
                allKeywords[s] = [id]            
'''           
                
#put all the keywords in the allData["labelList"]
#initialize TFIDF
for k in allLabels:
    keyWordObj = {	
        "label" : k,
        "creator": "system",    
        "itemsUsedBy" : allLabels[k],
        "user" : "facedata",
        "creationTime" : 0
    }
    allData["labelList"][k] = keyWordObj

print "counter: ", counter

    
print "JSON parsed!"  
# Save the JSON  
f = open( '../datasets/faceData1.js', 'w')  

allData = json.dumps(allData, ensure_ascii=False) 
f.write("allDataOriginal = "+allData)  
print "JSON saved!"  
