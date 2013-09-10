import csv  
import json  
import pprint
pp = pprint.PrettyPrinter(indent=4)

kathleensData = [
    {
        "labels": [
            {
                "id": 2, 
                "label": "Contempt"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/13889' /><h4>Face #13889</h4>", 
        "id": 13889, 
        "img": "http://www.facefrontier.com/images/13889"
    }, 
    {
        "labels": [
            {
                "id": 98, 
                "label": "neutral"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1616' /><h4>Face #1616</h4>", 
        "id": 1616, 
        "img": "http://www.facefrontier.com/images/1616"
    }, 
    {
        "labels": [
            {
                "id": 5, 
                "label": "Anger"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1016' /><h4>Face #1016</h4>", 
        "id": 1016, 
        "img": "http://www.facefrontier.com/images/1016"
    }, 
    {
        "labels": [
            {
                "id": 3, 
                "label": "Disgust"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/13864' /><h4>Face #13864</h4>", 
        "id": 13864, 
        "img": "http://www.facefrontier.com/images/13864"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1294' /><h4>Face #1294</h4>", 
        "id": 1294, 
        "img": "http://www.facefrontier.com/images/1294"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1447' /><h4>Face #1447</h4>", 
        "id": 1447, 
        "img": "http://www.facefrontier.com/images/1447"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1203' /><h4>Face #1203</h4>", 
        "id": 1203, 
        "img": "http://www.facefrontier.com/images/1203"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/13876' /><h4>Face #13876</h4>", 
        "id": 13876, 
        "img": "http://www.facefrontier.com/images/13876"
    }, 
    {
        "labels": [
            {
                "id": 98, 
                "label": "neutral"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1583' /><h4>Face #1583</h4>", 
        "id": 1583, 
        "img": "http://www.facefrontier.com/images/1583"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1081' /><h4>Face #1081</h4>", 
        "id": 1081, 
        "img": "http://www.facefrontier.com/images/1081"
    }, 
    {
        "labels": [
            {
                "id": 1, 
                "label": "Surprise"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/902' /><h4>Face #902</h4>", 
        "id": 902, 
        "img": "http://www.facefrontier.com/images/902"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1098' /><h4>Face #1098</h4>", 
        "id": 1098, 
        "img": "http://www.facefrontier.com/images/1098"
    }, 
    {
        "labels": [
            {
                "id": 98, 
                "label": "neutral"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1528' /><h4>Face #1528</h4>", 
        "id": 1528, 
        "img": "http://www.facefrontier.com/images/1528"
    }, 
    {
        "labels": [
            {
                "id": 98, 
                "label": "neutral"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1644' /><h4>Face #1644</h4>", 
        "id": 1644, 
        "img": "http://www.facefrontier.com/images/1644"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1501' /><h4>Face #1501</h4>", 
        "id": 1501, 
        "img": "http://www.facefrontier.com/images/1501"
    }, 
    {
        "labels": [
            {
                "id": 98, 
                "label": "neutral"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1255' /><h4>Face #1255</h4>", 
        "id": 1255, 
        "img": "http://www.facefrontier.com/images/1255"
    }, 
    {
        "labels": [
            {
                "id": 98, 
                "label": "neutral"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1565' /><h4>Face #1565</h4>", 
        "id": 1565, 
        "img": "http://www.facefrontier.com/images/1565"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1363' /><h4>Face #1363</h4>", 
        "id": 1363, 
        "img": "http://www.facefrontier.com/images/1363"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/384' /><h4>Face #384</h4>", 
        "id": 384, 
        "img": "http://www.facefrontier.com/images/384"
    }, 
    {
        "labels": [
            {
                "id": 106, 
                "label": "slight sadness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/910' /><h4>Face #910</h4>", 
        "id": 910, 
        "img": "http://www.facefrontier.com/images/910"
    }, 
    {
        "labels": [
            {
                "id": 102, 
                "label": "sadness and fear"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/421' /><h4>Face #421</h4>", 
        "id": 421, 
        "img": "http://www.facefrontier.com/images/421"
    }, 
    {
        "labels": [
            {
                "id": 6, 
                "label": "Sadness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/13908' /><h4>Face #13908</h4>", 
        "id": 13908, 
        "img": "http://www.facefrontier.com/images/13908"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/14129' /><h4>Face #14129</h4>", 
        "id": 14129, 
        "img": "http://www.facefrontier.com/images/14129"
    }, 
    {
        "labels": [
            {
                "id": 347, 
                "label": "Focused"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1866' /><h4>Face #1866</h4>", 
        "id": 1866, 
        "img": "http://www.facefrontier.com/images/1866"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1406' /><h4>Face #1406</h4>", 
        "id": 1406, 
        "img": "http://www.facefrontier.com/images/1406"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1066' /><h4>Face #1066</h4>", 
        "id": 1066, 
        "img": "http://www.facefrontier.com/images/1066"
    }, 
    {
        "labels": [
            {
                "id": 6, 
                "label": "Sadness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/13771' /><h4>Face #13771</h4>", 
        "id": 13771, 
        "img": "http://www.facefrontier.com/images/13771"
    }, 
    {
        "labels": [
            {
                "id": 98, 
                "label": "neutral"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1892' /><h4>Face #1892</h4>", 
        "id": 1892, 
        "img": "http://www.facefrontier.com/images/1892"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1321' /><h4>Face #1321</h4>", 
        "id": 1321, 
        "img": "http://www.facefrontier.com/images/1321"
    }, 
    {
        "labels": [
            {
                "id": 98, 
                "label": "neutral"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1981' /><h4>Face #1981</h4>", 
        "id": 1981, 
        "img": "http://www.facefrontier.com/images/1981"
    }, 
    {
        "labels": [
            {
                "id": 3, 
                "label": "Disgust"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/366' /><h4>Face #366</h4>", 
        "id": 366, 
        "img": "http://www.facefrontier.com/images/366"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1462' /><h4>Face #1462</h4>", 
        "id": 1462, 
        "img": "http://www.facefrontier.com/images/1462"
    }, 
    {
        "labels": [
            {
                "id": 98, 
                "label": "neutral"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1903' /><h4>Face #1903</h4>", 
        "id": 1903, 
        "img": "http://www.facefrontier.com/images/1903"
    }, 
    {
        "labels": [
            {
                "id": 5, 
                "label": "Anger"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1041' /><h4>Face #1041</h4>", 
        "id": 1041, 
        "img": "http://www.facefrontier.com/images/1041"
    }, 
    {
        "labels": [
            {
                "id": 1, 
                "label": "Surprise"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1862' /><h4>Face #1862</h4>", 
        "id": 1862, 
        "img": "http://www.facefrontier.com/images/1862"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1427' /><h4>Face #1427</h4>", 
        "id": 1427, 
        "img": "http://www.facefrontier.com/images/1427"
    }, 
    {
        "labels": [
            {
                "id": 98, 
                "label": "neutral"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/2030' /><h4>Face #2030</h4>", 
        "id": 2030, 
        "img": "http://www.facefrontier.com/images/2030"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1984' /><h4>Face #1984</h4>", 
        "id": 1984, 
        "img": "http://www.facefrontier.com/images/1984"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1285' /><h4>Face #1285</h4>", 
        "id": 1285, 
        "img": "http://www.facefrontier.com/images/1285"
    }, 
    {
        "labels": [
            {
                "id": 98, 
                "label": "neutral"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/2025' /><h4>Face #2025</h4>", 
        "id": 2025, 
        "img": "http://www.facefrontier.com/images/2025"
    }, 
    {
        "labels": [
            {
                "id": 91, 
                "label": "fear and surprise"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/352' /><h4>Face #352</h4>", 
        "id": 352, 
        "img": "http://www.facefrontier.com/images/352"
    }, 
    {
        "labels": [
            {
                "id": 5, 
                "label": "Anger"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1046' /><h4>Face #1046</h4>", 
        "id": 1046, 
        "img": "http://www.facefrontier.com/images/1046"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/381' /><h4>Face #381</h4>", 
        "id": 381, 
        "img": "http://www.facefrontier.com/images/381"
    }, 
    {
        "labels": [
            {
                "id": 98, 
                "label": "neutral"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1883' /><h4>Face #1883</h4>", 
        "id": 1883, 
        "img": "http://www.facefrontier.com/images/1883"
    }, 
    {
        "labels": [
            {
                "id": 98, 
                "label": "neutral"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1526' /><h4>Face #1526</h4>", 
        "id": 1526, 
        "img": "http://www.facefrontier.com/images/1526"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/13804' /><h4>Face #13804</h4>", 
        "id": 13804, 
        "img": "http://www.facefrontier.com/images/13804"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1399' /><h4>Face #1399</h4>", 
        "id": 1399, 
        "img": "http://www.facefrontier.com/images/1399"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1332' /><h4>Face #1332</h4>", 
        "id": 1332, 
        "img": "http://www.facefrontier.com/images/1332"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1304' /><h4>Face #1304</h4>", 
        "id": 1304, 
        "img": "http://www.facefrontier.com/images/1304"
    }, 
    {
        "labels": [
            {
                "id": 100, 
                "label": "questioning surprise"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/356' /><h4>Face #356</h4>", 
        "id": 356, 
        "img": "http://www.facefrontier.com/images/356"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1476' /><h4>Face #1476</h4>", 
        "id": 1476, 
        "img": "http://www.facefrontier.com/images/1476"
    }, 
    {
        "labels": [
            {
                "id": 98, 
                "label": "neutral"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1994' /><h4>Face #1994</h4>", 
        "id": 1994, 
        "img": "http://www.facefrontier.com/images/1994"
    }, 
    {
        "labels": [
            {
                "id": 1, 
                "label": "Surprise"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1552' /><h4>Face #1552</h4>", 
        "id": 1552, 
        "img": "http://www.facefrontier.com/images/1552"
    }, 
    {
        "labels": [
            {
                "id": 98, 
                "label": "neutral"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1638' /><h4>Face #1638</h4>", 
        "id": 1638, 
        "img": "http://www.facefrontier.com/images/1638"
    }, 
    {
        "labels": [
            {
                "id": 98, 
                "label": "neutral"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1937' /><h4>Face #1937</h4>", 
        "id": 1937, 
        "img": "http://www.facefrontier.com/images/1937"
    }, 
    {
        "labels": [
            {
                "id": 102, 
                "label": "sadness and fear"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/399' /><h4>Face #399</h4>", 
        "id": 399, 
        "img": "http://www.facefrontier.com/images/399"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1078' /><h4>Face #1078</h4>", 
        "id": 1078, 
        "img": "http://www.facefrontier.com/images/1078"
    }, 
    {
        "labels": [
            {
                "id": 98, 
                "label": "neutral"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1568' /><h4>Face #1568</h4>", 
        "id": 1568, 
        "img": "http://www.facefrontier.com/images/1568"
    }, 
    {
        "labels": [
            {
                "id": 5, 
                "label": "Anger"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1017' /><h4>Face #1017</h4>", 
        "id": 1017, 
        "img": "http://www.facefrontier.com/images/1017"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1144' /><h4>Face #1144</h4>", 
        "id": 1144, 
        "img": "http://www.facefrontier.com/images/1144"
    }, 
    {
        "labels": [
            {
                "id": 93, 
                "label": "grumpy"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/415' /><h4>Face #415</h4>", 
        "id": 415, 
        "img": "http://www.facefrontier.com/images/415"
    }, 
    {
        "labels": [
            {
                "id": 98, 
                "label": "neutral"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1889' /><h4>Face #1889</h4>", 
        "id": 1889, 
        "img": "http://www.facefrontier.com/images/1889"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1497' /><h4>Face #1497</h4>", 
        "id": 1497, 
        "img": "http://www.facefrontier.com/images/1497"
    }, 
    {
        "labels": [
            {
                "id": 5, 
                "label": "Anger"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/14207' /><h4>Face #14207</h4>", 
        "id": 14207, 
        "img": "http://www.facefrontier.com/images/14207"
    }, 
    {
        "labels": [
            {
                "id": 98, 
                "label": "neutral"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1163' /><h4>Face #1163</h4>", 
        "id": 1163, 
        "img": "http://www.facefrontier.com/images/1163"
    }, 
    {
        "labels": [
            {
                "id": 4, 
                "label": "Fear"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/457' /><h4>Face #457</h4>", 
        "id": 457, 
        "img": "http://www.facefrontier.com/images/457"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1470' /><h4>Face #1470</h4>", 
        "id": 1470, 
        "img": "http://www.facefrontier.com/images/1470"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1355' /><h4>Face #1355</h4>", 
        "id": 1355, 
        "img": "http://www.facefrontier.com/images/1355"
    }, 
    {
        "labels": [
            {
                "id": 98, 
                "label": "neutral"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1630' /><h4>Face #1630</h4>", 
        "id": 1630, 
        "img": "http://www.facefrontier.com/images/1630"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1147' /><h4>Face #1147</h4>", 
        "id": 1147, 
        "img": "http://www.facefrontier.com/images/1147"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1225' /><h4>Face #1225</h4>", 
        "id": 1225, 
        "img": "http://www.facefrontier.com/images/1225"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/13747' /><h4>Face #13747</h4>", 
        "id": 13747, 
        "img": "http://www.facefrontier.com/images/13747"
    }, 
    {
        "labels": [
            {
                "id": 313, 
                "label": "fake happy"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1312' /><h4>Face #1312</h4>", 
        "id": 1312, 
        "img": "http://www.facefrontier.com/images/1312"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1195' /><h4>Face #1195</h4>", 
        "id": 1195, 
        "img": "http://www.facefrontier.com/images/1195"
    }, 
    {
        "labels": [
            {
                "id": 6, 
                "label": "Sadness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/13904' /><h4>Face #13904</h4>", 
        "id": 13904, 
        "img": "http://www.facefrontier.com/images/13904"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1345' /><h4>Face #1345</h4>", 
        "id": 1345, 
        "img": "http://www.facefrontier.com/images/1345"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1119' /><h4>Face #1119</h4>", 
        "id": 1119, 
        "img": "http://www.facefrontier.com/images/1119"
    }, 
    {
        "labels": [
            {
                "id": 98, 
                "label": "neutral"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1949' /><h4>Face #1949</h4>", 
        "id": 1949, 
        "img": "http://www.facefrontier.com/images/1949"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/13826' /><h4>Face #13826</h4>", 
        "id": 13826, 
        "img": "http://www.facefrontier.com/images/13826"
    }, 
    {
        "labels": [
            {
                "id": 105, 
                "label": "slight happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1238' /><h4>Face #1238</h4>", 
        "id": 1238, 
        "img": "http://www.facefrontier.com/images/1238"
    }, 
    {
        "labels": [
            {
                "id": 100, 
                "label": "questioning surprise"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1107' /><h4>Face #1107</h4>", 
        "id": 1107, 
        "img": "http://www.facefrontier.com/images/1107"
    }, 
    {
        "labels": [
            {
                "id": 4, 
                "label": "Fear"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/901' /><h4>Face #901</h4>", 
        "id": 901, 
        "img": "http://www.facefrontier.com/images/901"
    }, 
    {
        "labels": [
            {
                "id": 98, 
                "label": "neutral"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1550' /><h4>Face #1550</h4>", 
        "id": 1550, 
        "img": "http://www.facefrontier.com/images/1550"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1112' /><h4>Face #1112</h4>", 
        "id": 1112, 
        "img": "http://www.facefrontier.com/images/1112"
    }, 
    {
        "labels": [
            {
                "id": 98, 
                "label": "neutral"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1983' /><h4>Face #1983</h4>", 
        "id": 1983, 
        "img": "http://www.facefrontier.com/images/1983"
    }, 
    {
        "labels": [
            {
                "id": 98, 
                "label": "neutral"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1843' /><h4>Face #1843</h4>", 
        "id": 1843, 
        "img": "http://www.facefrontier.com/images/1843"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1243' /><h4>Face #1243</h4>", 
        "id": 1243, 
        "img": "http://www.facefrontier.com/images/1243"
    }, 
    {
        "labels": [
            {
                "id": 98, 
                "label": "neutral"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1847' /><h4>Face #1847</h4>", 
        "id": 1847, 
        "img": "http://www.facefrontier.com/images/1847"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1230' /><h4>Face #1230</h4>", 
        "id": 1230, 
        "img": "http://www.facefrontier.com/images/1230"
    }, 
    {
        "labels": [
            {
                "id": 106, 
                "label": "slight sadness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1846' /><h4>Face #1846</h4>", 
        "id": 1846, 
        "img": "http://www.facefrontier.com/images/1846"
    }, 
    {
        "labels": [
            {
                "id": 98, 
                "label": "neutral"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1857' /><h4>Face #1857</h4>", 
        "id": 1857, 
        "img": "http://www.facefrontier.com/images/1857"
    }, 
    {
        "labels": [
            {
                "id": 95, 
                "label": "happiness and surprise"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/13909' /><h4>Face #13909</h4>", 
        "id": 13909, 
        "img": "http://www.facefrontier.com/images/13909"
    }, 
    {
        "labels": [
            {
                "id": 6, 
                "label": "Sadness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1023' /><h4>Face #1023</h4>", 
        "id": 1023, 
        "img": "http://www.facefrontier.com/images/1023"
    }, 
    {
        "labels": [
            {
                "id": 98, 
                "label": "neutral"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1620' /><h4>Face #1620</h4>", 
        "id": 1620, 
        "img": "http://www.facefrontier.com/images/1620"
    }, 
    {
        "labels": [
            {
                "id": 3, 
                "label": "Disgust"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/2016' /><h4>Face #2016</h4>", 
        "id": 2016, 
        "img": "http://www.facefrontier.com/images/2016"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1244' /><h4>Face #1244</h4>", 
        "id": 1244, 
        "img": "http://www.facefrontier.com/images/1244"
    }, 
    {
        "labels": [
            {
                "id": 105, 
                "label": "slight happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1509' /><h4>Face #1509</h4>", 
        "id": 1509, 
        "img": "http://www.facefrontier.com/images/1509"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1170' /><h4>Face #1170</h4>", 
        "id": 1170, 
        "img": "http://www.facefrontier.com/images/1170"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1348' /><h4>Face #1348</h4>", 
        "id": 1348, 
        "img": "http://www.facefrontier.com/images/1348"
    }, 
    {
        "labels": [
            {
                "id": 7, 
                "label": "Happiness"
            }
        ], 
        "html": "<img src='http://www.facefrontier.com/images/1461' /><h4>Face #1461</h4>", 
        "id": 1461, 
        "img": "http://www.facefrontier.com/images/1461"
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
