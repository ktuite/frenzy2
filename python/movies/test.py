import json
'''
import simplejson
string = file("data.json","r").read()
d = simplejson.loads(string)
print d
'''
'''
string = file("data.json", "r").read().decode("string-escape")
string = unicode(string, "latin-1")
data = json.load(string)
print (data)
'''
'''
import json
>>> json.loads(u'{"name":"A\xf1asco"}')
{u'name': u'A\xf1asco'}
'''


import codecs
f = codecs.open("data.json", "r", "ISO-8859-1")
k = json.load(f)
print k.keys()
results = k["result"]
print len(results)
