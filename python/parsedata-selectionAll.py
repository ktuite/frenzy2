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
f = open( 'listOfSubmissionsCut1.csv', 'r' )  
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

def createItemContent(id, title, authorList, abstract, authorAndAffiliationList):    
    itemContent = {}
    itemContent["id"] = id
    itemContent["title"] = title
    itemContent["authorList"] = authorAndAffiliationList #map( lambda x: x.strip() , authorList.split(","))
    itemContent["shortAbstract"] = abstract[:70]
    itemContent["fullAbstract"] = abstract
    return itemContent

#populate allData["items"]
allKeywords = {}
counter = 0
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
        itemHtml = createHTML(id, title, authorList, abstract)
        
        
        splitKeywords = map( lambda x: x.strip() , keywords.split(";"))        
        newItem = createItem(id, itemHtml, itemContent, counter, splitKeywords)
        counter += 1	
 
        
        allData["items"][id] = newItem
        #print allData["items"][id]
        for s in splitKeywords:
            if s in allKeywords:
                allKeywords[s].append(id)
            else:
                allKeywords[s] = [id]            

id = "tochi100"
title = "Peer and Self Assessment in Massive Online Classes"
authorList = "" 
abstract = "Peer and self assessment offer an opportunity to scale assessment and learning to global classrooms. This paper reports our experiences with two iterations of the first large online class to use peer and self assessment. In this class, peer grades correlated highly with staff-assigned grade. The second iteration had 42.9% of students' grades within 5% of the staff grade, and 65.5% within 10%. On average, students assessed their work 7% higher than staff did. Students rated peers' work from their own country 3.6% higher. We found that giving students feedback about their grading bias increased subsequent accuracy. We introduce short, customizable feedback snippets that cover common issues with assignments, providing students more qualitative peer feedback. Finally, we introduce a data-driven approach that highlights high-variance rubric items---rubrics using parallel sentence structure, unambiguous wording and well-specified dimensions have lower variance. After revising rubrics, median grading error decreased from 12.4% to 9.9%."    
authorAndAffiliationList = ["Chinmay Kulkarni, Stanford University"]           
itemContent = createItemContent(id, title, authorList, abstract, authorAndAffiliationList)
itemHtml = createHTML(id, title, authorList, abstract)


splitKeywords = []     
newItem = createItem(id, itemHtml, itemContent, counter, splitKeywords)
counter += 1
allData["items"][id] = newItem	                
                
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

    
print "JSON parsed!"  
# Save the JSON  
f = open( '../testing/cscwDataAllcut1withextra.js', 'w')  

allData = json.dumps(allData, ensure_ascii=False) 
f.write("allDataOriginal = "+allData)  
print "JSON saved!"  
