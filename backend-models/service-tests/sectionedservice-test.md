
# sectionedservice.php
====================
---
## getGroupsTest (line 100):
===================
---

---
## Prerequisite
---

### pre-req:
 
```
(checklogin) IS TRUE
```

---
## send parameters inputs to sectionedservice.php 
---

### send
```
{
    $opt = "GRP"
    $courseid = "1"
    $coursevers = "45656"
} 
```

---
## Service output:
---

## Gather service output
--- 

#### Output
```
{
    "entries": [],
    "debug": "NONE!",
    "writeaccess": false,
    "studentteacher": false,
    "readaccess": false,
    "coursename": "UNK",
    "coursevers": "UNK",
    "coursecode": "UNK",
    "courseid": "UNK",
    "links": [],
    "duggor": [],
    "results": [],
    "versions": [
        {
            "cid": "1",
            "coursecode": "DV12G",
            "vers": "45656",
            "versname": "HT15",
            "coursename": "Webbprogrammering",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Webbprogrammering - HT15"
        },
        {
            "cid": "1",
            "coursecode": "DV12G",
            "vers": "45657",
            "versname": "HT16",
            "coursename": "Webbprogrammering",
            "coursenamealt": "UNK",
            "startdate": "2015-12-29 00:00:00",
            "enddate": "2016-03-08 00:00:00",
            "motd": "Webbprogrammering - HT16"
        },
        {
            "cid": "2",
            "coursecode": "IT118G",
            "vers": "97731",
            "versname": "HT14",
            "coursename": "Webbutveckling - datorgrafik",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Webbutveckling - datorgrafik - HT14"
        },
        {
            "cid": "2",
            "coursecode": "IT118G",
            "vers": "97732",
            "versname": "HT15",
            "coursename": "Webbutveckling - datorgrafik",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Webbutveckling - datorgrafik - HT15"
        },
        {
            "cid": "3",
            "coursecode": "IT500G",
            "vers": "1337",
            "versname": "HT15",
            "coursename": "Datorns grunder",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Datorns grunder - HT15"
        },
        {
            "cid": "4",
            "coursecode": "IT301G",
            "vers": "1338",
            "versname": "HT15",
            "coursename": "Software Engineering",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Software Engineering - HT15"
        },
        {
            "cid": "305",
            "coursecode": "IT308G",
            "vers": "12305",
            "versname": "HT15",
            "coursename": "Objektorienterad programmering",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "307",
            "coursecode": "IT115G",
            "vers": "12307",
            "versname": "HT15",
            "coursename": "Datorns grunder",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "308",
            "coursecode": "MA161G",
            "vers": "12308",
            "versname": "HT15",
            "coursename": "Diskret matematik",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "309",
            "coursecode": "DA322G",
            "vers": "12309",
            "versname": "HT15",
            "coursename": "Operativsystem",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "312",
            "coursecode": "IT326G",
            "vers": "12312",
            "versname": "HT15",
            "coursename": "Distribuerade system",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "319",
            "coursecode": "DV736A",
            "vers": "12319",
            "versname": "HT15",
            "coursename": "Examensarbete i datavetenskap",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "324",
            "coursecode": "IT108G",
            "vers": "12324",
            "versname": "HT15",
            "coursename": "Webbutveckling - webbplatsdesign",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "1885",
            "coursecode": "G1337",
            "vers": "1337",
            "versname": "",
            "coursename": "Testing-Course",
            "coursenamealt": "Course for testing codeviewer",
            "startdate": "2020-05-01 00:00:00",
            "enddate": "2020-06-30 00:00:00",
            "motd": "Code examples shows both templateid and boxid!"
        },
        {
            "cid": "1894",
            "coursecode": "G420",
            "vers": "52432",
            "versname": "ST20",
            "coursename": "Demo-Course",
            "coursenamealt": "Chaos Theory - Conspiracy 64k Demo",
            "startdate": "2020-05-01 00:00:00",
            "enddate": "2020-06-30 00:00:00",
            "motd": "Demo Course 2020 - All current duggas"
        }
    ],
    "codeexamples": [],
    "unmarked": 0,
    "startdate": "UNK",
    "enddate": "UNK",
    "groups": [],
    "grpmembershp": "UNK",
    "grplst": [],
    "userfeedback": [],
    "feedbackquestion": "UNK",
    "avgfeedbackscore": 0
}
```

====================
---
## deleteTest (line 181):
===================
---

---
## Prerequisite
---

### pre-req:
 
``` 
(checklogin) IS TRUE
AND $ha || $studentTeacher IS TRUE
```

---
## send parameters inputs to sectionedservice.php 
---

### send
```
{
    $opt = "DEL"
    $lid = "5020"
}
You also need to gather all listentries to compare if deleted.
```

---
## SQL Query: 
---

```
"SELECT FROM listentries WHERE lid=:lid" or "SELECT FROM listentries" save into beforeDeleted
```

---
## Get deleted listentries
---

## SQL Query: 
---

```
"SELECT FROM listentries WHERE lid=:lid" or "SELECT FROM listentries" (depends on which was used earlier) save into afterDeleted
```

---
## Service output:
---

## Gather service output
---

#### Output
```
{
    "entries": [],
    "debug": "NONE!",
    "writeaccess": false,
    "studentteacher": false,
    "readaccess": false,
    "coursename": "UNK",
    "coursevers": "UNK",
    "coursecode": "UNK",
    "courseid": "UNK",
    "links": [],
    "duggor": [],
    "results": [],
    "versions": [
        {
            "cid": "1",
            "coursecode": "DV12G",
            "vers": "45656",
            "versname": "HT15",
            "coursename": "Webbprogrammering",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Webbprogrammering - HT15"
        },
        {
            "cid": "1",
            "coursecode": "DV12G",
            "vers": "45657",
            "versname": "HT16",
            "coursename": "Webbprogrammering",
            "coursenamealt": "UNK",
            "startdate": "2015-12-29 00:00:00",
            "enddate": "2016-03-08 00:00:00",
            "motd": "Webbprogrammering - HT16"
        },
        {
            "cid": "2",
            "coursecode": "IT118G",
            "vers": "97731",
            "versname": "HT14",
            "coursename": "Webbutveckling - datorgrafik",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Webbutveckling - datorgrafik - HT14"
        },
        {
            "cid": "2",
            "coursecode": "IT118G",
            "vers": "97732",
            "versname": "HT15",
            "coursename": "Webbutveckling - datorgrafik",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Webbutveckling - datorgrafik - HT15"
        },
        {
            "cid": "3",
            "coursecode": "IT500G",
            "vers": "1337",
            "versname": "HT15",
            "coursename": "Datorns grunder",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Datorns grunder - HT15"
        },
        {
            "cid": "4",
            "coursecode": "IT301G",
            "vers": "1338",
            "versname": "HT15",
            "coursename": "Software Engineering",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Software Engineering - HT15"
        },
        {
            "cid": "305",
            "coursecode": "IT308G",
            "vers": "12305",
            "versname": "HT15",
            "coursename": "Objektorienterad programmering",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "307",
            "coursecode": "IT115G",
            "vers": "12307",
            "versname": "HT15",
            "coursename": "Datorns grunder",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "308",
            "coursecode": "MA161G",
            "vers": "12308",
            "versname": "HT15",
            "coursename": "Diskret matematik",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "309",
            "coursecode": "DA322G",
            "vers": "12309",
            "versname": "HT15",
            "coursename": "Operativsystem",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "312",
            "coursecode": "IT326G",
            "vers": "12312",
            "versname": "HT15",
            "coursename": "Distribuerade system",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "319",
            "coursecode": "DV736A",
            "vers": "12319",
            "versname": "HT15",
            "coursename": "Examensarbete i datavetenskap",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "324",
            "coursecode": "IT108G",
            "vers": "12324",
            "versname": "HT15",
            "coursename": "Webbutveckling - webbplatsdesign",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "1885",
            "coursecode": "G1337",
            "vers": "1337",
            "versname": "",
            "coursename": "Testing-Course",
            "coursenamealt": "Course for testing codeviewer",
            "startdate": "2020-05-01 00:00:00",
            "enddate": "2020-06-30 00:00:00",
            "motd": "Code examples shows both templateid and boxid!"
        },
        {
            "cid": "1894",
            "coursecode": "G420",
            "vers": "52432",
            "versname": "ST20",
            "coursename": "Demo-Course",
            "coursenamealt": "Chaos Theory - Conspiracy 64k Demo",
            "startdate": "2020-05-01 00:00:00",
            "enddate": "2020-06-30 00:00:00",
            "motd": "Demo Course 2020 - All current duggas"
        }
    ],
    "codeexamples": [],
    "unmarked": 0,
    "startdate": "UNK",
    "enddate": "UNK",
    "groups": [],
    "grpmembershp": "UNK",
    "grplst": [],
    "userfeedback": [],
    "feedbackquestion": "UNK",
    "avgfeedbackscore": 0
}
```

=============================
---
## deletedTest (line 197):
=============================
---

---
## Prerequisite
---

### pre-req:
```
(checklogin) IS TRUE
AND $ha || $studentTeacher IS TRUE
```

---
## send parameters inputs to sectionedservice.php 
---

### send
```
{
    opt = "DELETED"
    lid = "5020"
}
You also need to gather all listentries to compare if deleted.
```

---
## SQL Query: 
---

```
"SELECT visible FROM listentries WHERE lid=:lid" or "SELECT visible FROM listentries" save into beforeMarkedDeleted
```

---
## Get deleted listentries
---

## SQL Query: 
---

```
"SELECT FROM listentries WHERE lid=:lid" or "SELECT FROM listentries" (depends on which was used earlier) save into afterMarkedDeleted
```

---
## Service output:
---

## Gather service output
---

#### Output
```
{
    "entries": [],
    "debug": "NONE!",
    "writeaccess": false,
    "studentteacher": false,
    "readaccess": false,
    "coursename": "UNK",
    "coursevers": "UNK",
    "coursecode": "UNK",
    "courseid": "UNK",
    "links": [],
    "duggor": [],
    "results": [],
    "versions": [
        {
            "cid": "1",
            "coursecode": "DV12G",
            "vers": "45656",
            "versname": "HT15",
            "coursename": "Webbprogrammering",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Webbprogrammering - HT15"
        },
        {
            "cid": "1",
            "coursecode": "DV12G",
            "vers": "45657",
            "versname": "HT16",
            "coursename": "Webbprogrammering",
            "coursenamealt": "UNK",
            "startdate": "2015-12-29 00:00:00",
            "enddate": "2016-03-08 00:00:00",
            "motd": "Webbprogrammering - HT16"
        },
        {
            "cid": "2",
            "coursecode": "IT118G",
            "vers": "97731",
            "versname": "HT14",
            "coursename": "Webbutveckling - datorgrafik",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Webbutveckling - datorgrafik - HT14"
        },
        {
            "cid": "2",
            "coursecode": "IT118G",
            "vers": "97732",
            "versname": "HT15",
            "coursename": "Webbutveckling - datorgrafik",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Webbutveckling - datorgrafik - HT15"
        },
        {
            "cid": "3",
            "coursecode": "IT500G",
            "vers": "1337",
            "versname": "HT15",
            "coursename": "Datorns grunder",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Datorns grunder - HT15"
        },
        {
            "cid": "4",
            "coursecode": "IT301G",
            "vers": "1338",
            "versname": "HT15",
            "coursename": "Software Engineering",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Software Engineering - HT15"
        },
        {
            "cid": "305",
            "coursecode": "IT308G",
            "vers": "12305",
            "versname": "HT15",
            "coursename": "Objektorienterad programmering",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "307",
            "coursecode": "IT115G",
            "vers": "12307",
            "versname": "HT15",
            "coursename": "Datorns grunder",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "308",
            "coursecode": "MA161G",
            "vers": "12308",
            "versname": "HT15",
            "coursename": "Diskret matematik",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "309",
            "coursecode": "DA322G",
            "vers": "12309",
            "versname": "HT15",
            "coursename": "Operativsystem",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "312",
            "coursecode": "IT326G",
            "vers": "12312",
            "versname": "HT15",
            "coursename": "Distribuerade system",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "319",
            "coursecode": "DV736A",
            "vers": "12319",
            "versname": "HT15",
            "coursename": "Examensarbete i datavetenskap",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "324",
            "coursecode": "IT108G",
            "vers": "12324",
            "versname": "HT15",
            "coursename": "Webbutveckling - webbplatsdesign",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "1885",
            "coursecode": "G1337",
            "vers": "1337",
            "versname": "",
            "coursename": "Testing-Course",
            "coursenamealt": "Course for testing codeviewer",
            "startdate": "2020-05-01 00:00:00",
            "enddate": "2020-06-30 00:00:00",
            "motd": "Code examples shows both templateid and boxid!"
        },
        {
            "cid": "1894",
            "coursecode": "G420",
            "vers": "52432",
            "versname": "ST20",
            "coursename": "Demo-Course",
            "coursenamealt": "Chaos Theory - Conspiracy 64k Demo",
            "startdate": "2020-05-01 00:00:00",
            "enddate": "2020-06-30 00:00:00",
            "motd": "Demo Course 2020 - All current duggas"
        }
    ],
    "codeexamples": [],
    "unmarked": 0,
    "startdate": "UNK",
    "enddate": "UNK",
    "groups": [],
    "grpmembershp": "UNK",
    "grplst": [],
    "userfeedback": [],
    "feedbackquestion": "UNK",
    "avgfeedbackscore": 0
}
```

=============================
---
## newCodeExampleTest (line 210):
=============================
---

---
## Prerequisite
---

### pre-req:
```
(checklogin) IS TRUE
AND $ha || $studentTeacher IS TRUE
```

---
## send parameters inputs to sectionedservice.php 
---

### send
```
{
    $opt = "NEW"
    $courseid = 1885
    $coursevers = 1337
    $sectname = "New group9019"
    $sname = "examplename"
    $gradesys = 0
    $tabs = null
    $userid = 2
    $link = null
    $kind = 7
    $comments = "Top"
    $visibility = 1
    $highscoremode = 0
    $pos = 5
}
You also need to gather all codeexamples to compare if any new.
```

---
## SQL Query: 
---

```
"SELECT * FROM codeexample" save into beforeNew
You also need to fetch all listentries with:
"SELECT * FROM listentries"
```

---
## Get new code examples and listentries
---

## SQL Query: 
---

```
"SELECT * FROM codeexample" save into afterNewC
```

---
## SQL Query: 
---

```
"SELECT * FROM listentries" save into afterNewL
```

---
## Service output:
---

## Gather service output
---

#### Output
```
{
    "entries": [],
    "debug": "NONE!",
    "writeaccess": false,
    "studentteacher": false,
    "readaccess": false,
    "coursename": "UNK",
    "coursevers": "UNK",
    "coursecode": "UNK",
    "courseid": "UNK",
    "links": [],
    "duggor": [],
    "results": [],
    "versions": [
        {
            "cid": "1",
            "coursecode": "DV12G",
            "vers": "45656",
            "versname": "HT15",
            "coursename": "Webbprogrammering",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Webbprogrammering - HT15"
        },
        {
            "cid": "1",
            "coursecode": "DV12G",
            "vers": "45657",
            "versname": "HT16",
            "coursename": "Webbprogrammering",
            "coursenamealt": "UNK",
            "startdate": "2015-12-29 00:00:00",
            "enddate": "2016-03-08 00:00:00",
            "motd": "Webbprogrammering - HT16"
        },
        {
            "cid": "2",
            "coursecode": "IT118G",
            "vers": "97731",
            "versname": "HT14",
            "coursename": "Webbutveckling - datorgrafik",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Webbutveckling - datorgrafik - HT14"
        },
        {
            "cid": "2",
            "coursecode": "IT118G",
            "vers": "97732",
            "versname": "HT15",
            "coursename": "Webbutveckling - datorgrafik",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Webbutveckling - datorgrafik - HT15"
        },
        {
            "cid": "3",
            "coursecode": "IT500G",
            "vers": "1337",
            "versname": "HT15",
            "coursename": "Datorns grunder",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Datorns grunder - HT15"
        },
        {
            "cid": "4",
            "coursecode": "IT301G",
            "vers": "1338",
            "versname": "HT15",
            "coursename": "Software Engineering",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Software Engineering - HT15"
        },
        {
            "cid": "305",
            "coursecode": "IT308G",
            "vers": "12305",
            "versname": "HT15",
            "coursename": "Objektorienterad programmering",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "307",
            "coursecode": "IT115G",
            "vers": "12307",
            "versname": "HT15",
            "coursename": "Datorns grunder",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "308",
            "coursecode": "MA161G",
            "vers": "12308",
            "versname": "HT15",
            "coursename": "Diskret matematik",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "309",
            "coursecode": "DA322G",
            "vers": "12309",
            "versname": "HT15",
            "coursename": "Operativsystem",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "312",
            "coursecode": "IT326G",
            "vers": "12312",
            "versname": "HT15",
            "coursename": "Distribuerade system",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "319",
            "coursecode": "DV736A",
            "vers": "12319",
            "versname": "HT15",
            "coursename": "Examensarbete i datavetenskap",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "324",
            "coursecode": "IT108G",
            "vers": "12324",
            "versname": "HT15",
            "coursename": "Webbutveckling - webbplatsdesign",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "1885",
            "coursecode": "G1337",
            "vers": "1337",
            "versname": "",
            "coursename": "Testing-Course",
            "coursenamealt": "Course for testing codeviewer",
            "startdate": "2020-05-01 00:00:00",
            "enddate": "2020-06-30 00:00:00",
            "motd": "Code examples shows both templateid and boxid!"
        },
        {
            "cid": "1894",
            "coursecode": "G420",
            "vers": "52432",
            "versname": "ST20",
            "coursename": "Demo-Course",
            "coursenamealt": "Chaos Theory - Conspiracy 64k Demo",
            "startdate": "2020-05-01 00:00:00",
            "enddate": "2020-06-30 00:00:00",
            "motd": "Demo Course 2020 - All current duggas"
        }
    ],
    "codeexamples": [],
    "unmarked": 0,
    "startdate": "UNK",
    "enddate": "UNK",
    "groups": [],
    "grpmembershp": "UNK",
    "grplst": [],
    "userfeedback": [],
    "feedbackquestion": "UNK",
    "avgfeedbackscore": 0
}
```

=============================
---
## newRecorderTest (line 275):
=============================
---

---
## Prerequisite
---

### pre-req:
```
(checklogin) IS TRUE
AND $ha || $studentTeacher IS TRUE
```

---
## send parameters inputs to sectionedservice.php 
---

### send
```
{
    $opt = "RECORDER"
    $order = 0 
    $armin[] = 1 //Can be 0-2
}
You also need to gather all listentries to compare if any updated.
```

---
## SQL Query: 
---

```
"SELECT pos,moment FROM listentries" save into beforeUpdated
```

---
## Get updated listentries
---

---
## SQL Query: 
---

```
"SELECT gradesystem FROM listentries" save into afterUpdated
```

---
## Service output:
---

## Gather service output
---

#### Output
```
{
    "entries": [],
    "debug": "NONE!",
    "writeaccess": false,
    "studentteacher": false,
    "readaccess": false,
    "coursename": "UNK",
    "coursevers": "UNK",
    "coursecode": "UNK",
    "courseid": "UNK",
    "links": [],
    "duggor": [],
    "results": [],
    "versions": [
        {
            "cid": "1",
            "coursecode": "DV12G",
            "vers": "45656",
            "versname": "HT15",
            "coursename": "Webbprogrammering",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Webbprogrammering - HT15"
        },
        {
            "cid": "1",
            "coursecode": "DV12G",
            "vers": "45657",
            "versname": "HT16",
            "coursename": "Webbprogrammering",
            "coursenamealt": "UNK",
            "startdate": "2015-12-29 00:00:00",
            "enddate": "2016-03-08 00:00:00",
            "motd": "Webbprogrammering - HT16"
        },
        {
            "cid": "2",
            "coursecode": "IT118G",
            "vers": "97731",
            "versname": "HT14",
            "coursename": "Webbutveckling - datorgrafik",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Webbutveckling - datorgrafik - HT14"
        },
        {
            "cid": "2",
            "coursecode": "IT118G",
            "vers": "97732",
            "versname": "HT15",
            "coursename": "Webbutveckling - datorgrafik",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Webbutveckling - datorgrafik - HT15"
        },
        {
            "cid": "3",
            "coursecode": "IT500G",
            "vers": "1337",
            "versname": "HT15",
            "coursename": "Datorns grunder",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Datorns grunder - HT15"
        },
        {
            "cid": "4",
            "coursecode": "IT301G",
            "vers": "1338",
            "versname": "HT15",
            "coursename": "Software Engineering",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Software Engineering - HT15"
        },
        {
            "cid": "305",
            "coursecode": "IT308G",
            "vers": "12305",
            "versname": "HT15",
            "coursename": "Objektorienterad programmering",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "307",
            "coursecode": "IT115G",
            "vers": "12307",
            "versname": "HT15",
            "coursename": "Datorns grunder",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "308",
            "coursecode": "MA161G",
            "vers": "12308",
            "versname": "HT15",
            "coursename": "Diskret matematik",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "309",
            "coursecode": "DA322G",
            "vers": "12309",
            "versname": "HT15",
            "coursename": "Operativsystem",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "312",
            "coursecode": "IT326G",
            "vers": "12312",
            "versname": "HT15",
            "coursename": "Distribuerade system",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "319",
            "coursecode": "DV736A",
            "vers": "12319",
            "versname": "HT15",
            "coursename": "Examensarbete i datavetenskap",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "324",
            "coursecode": "IT108G",
            "vers": "12324",
            "versname": "HT15",
            "coursename": "Webbutveckling - webbplatsdesign",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "1885",
            "coursecode": "G1337",
            "vers": "1337",
            "versname": "",
            "coursename": "Testing-Course",
            "coursenamealt": "Course for testing codeviewer",
            "startdate": "2020-05-01 00:00:00",
            "enddate": "2020-06-30 00:00:00",
            "motd": "Code examples shows both templateid and boxid!"
        },
        {
            "cid": "1894",
            "coursecode": "G420",
            "vers": "52432",
            "versname": "ST20",
            "coursename": "Demo-Course",
            "coursenamealt": "Chaos Theory - Conspiracy 64k Demo",
            "startdate": "2020-05-01 00:00:00",
            "enddate": "2020-06-30 00:00:00",
            "motd": "Demo Course 2020 - All current duggas"
        }
    ],
    "codeexamples": [],
    "unmarked": 0,
    "startdate": "UNK",
    "enddate": "UNK",
    "groups": [],
    "grpmembershp": "UNK",
    "grplst": [],
    "userfeedback": [],
    "feedbackquestion": "UNK",
    "avgfeedbackscore": 0
}
```

=============================
---
## updateTest (line 291):
=============================
---

---
## Prerequisite
---

### pre-req:
```
(checklogin) IS TRUE
AND $ha || $studentTeacher IS TRUE
```

---
## send parameters inputs to sectionedservice.php 
---

### send
```
{
    $opt = "UPDATE"
    $courseid = 1885
    $coursevers = 1337
    $sectid = 1
    $sectname = "New group9019"
    $sname = "examplename"
    $comments = "Top"
    $highscoremode = 0
    $feedbackenabled = 0
    $feedbackquestion = null
    $moment = null
    $kind = 7
    $link = null
    $visibility = 1
}
You also need to gather all listentries to compare if any updated.
```

---
## SQL Query: 
---

```
"SELECT * FROM listentries" save into beforeUpdatedL
You also new all code examples
```

---
## SQL Query: 
---

```
"SELECT * FROM codeexample" save into beforeUpdatedC
And lastly the list table for the specific course
```

---
## SQL Query: 
---

```
"SELECT * FROM list" save into beforeUpdatedList
```

---
## Get updated code examples and listentries
---

---
## SQL Query: 
---

```
"SELECT * FROM codeexample" save into afterNewC
```

---
## SQL Query: 
---

```
"SELECT * FROM listentries" save into afterNewL
```

---
## SQL Query: 
---

```
"SELECT * FROM list" save into afterNewList
```

---
## Service output:
---

## Gather service output
---

#### Output
```
{
    "entries": [],
    "debug": "NONE!",
    "writeaccess": false,
    "studentteacher": false,
    "readaccess": false,
    "coursename": "UNK",
    "coursevers": "UNK",
    "coursecode": "UNK",
    "courseid": "UNK",
    "links": [],
    "duggor": [],
    "results": [],
    "versions": [
        {
            "cid": "1",
            "coursecode": "DV12G",
            "vers": "45656",
            "versname": "HT15",
            "coursename": "Webbprogrammering",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Webbprogrammering - HT15"
        },
        {
            "cid": "1",
            "coursecode": "DV12G",
            "vers": "45657",
            "versname": "HT16",
            "coursename": "Webbprogrammering",
            "coursenamealt": "UNK",
            "startdate": "2015-12-29 00:00:00",
            "enddate": "2016-03-08 00:00:00",
            "motd": "Webbprogrammering - HT16"
        },
        {
            "cid": "2",
            "coursecode": "IT118G",
            "vers": "97731",
            "versname": "HT14",
            "coursename": "Webbutveckling - datorgrafik",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Webbutveckling - datorgrafik - HT14"
        },
        {
            "cid": "2",
            "coursecode": "IT118G",
            "vers": "97732",
            "versname": "HT15",
            "coursename": "Webbutveckling - datorgrafik",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Webbutveckling - datorgrafik - HT15"
        },
        {
            "cid": "3",
            "coursecode": "IT500G",
            "vers": "1337",
            "versname": "HT15",
            "coursename": "Datorns grunder",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Datorns grunder - HT15"
        },
        {
            "cid": "4",
            "coursecode": "IT301G",
            "vers": "1338",
            "versname": "HT15",
            "coursename": "Software Engineering",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Software Engineering - HT15"
        },
        {
            "cid": "305",
            "coursecode": "IT308G",
            "vers": "12305",
            "versname": "HT15",
            "coursename": "Objektorienterad programmering",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "307",
            "coursecode": "IT115G",
            "vers": "12307",
            "versname": "HT15",
            "coursename": "Datorns grunder",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "308",
            "coursecode": "MA161G",
            "vers": "12308",
            "versname": "HT15",
            "coursename": "Diskret matematik",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "309",
            "coursecode": "DA322G",
            "vers": "12309",
            "versname": "HT15",
            "coursename": "Operativsystem",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "312",
            "coursecode": "IT326G",
            "vers": "12312",
            "versname": "HT15",
            "coursename": "Distribuerade system",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "319",
            "coursecode": "DV736A",
            "vers": "12319",
            "versname": "HT15",
            "coursename": "Examensarbete i datavetenskap",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "324",
            "coursecode": "IT108G",
            "vers": "12324",
            "versname": "HT15",
            "coursename": "Webbutveckling - webbplatsdesign",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "1885",
            "coursecode": "G1337",
            "vers": "1337",
            "versname": "",
            "coursename": "Testing-Course",
            "coursenamealt": "Course for testing codeviewer",
            "startdate": "2020-05-01 00:00:00",
            "enddate": "2020-06-30 00:00:00",
            "motd": "Code examples shows both templateid and boxid!"
        },
        {
            "cid": "1894",
            "coursecode": "G420",
            "vers": "52432",
            "versname": "ST20",
            "coursename": "Demo-Course",
            "coursenamealt": "Chaos Theory - Conspiracy 64k Demo",
            "startdate": "2020-05-01 00:00:00",
            "enddate": "2020-06-30 00:00:00",
            "motd": "Demo Course 2020 - All current duggas"
        }
    ],
    "codeexamples": [],
    "unmarked": 0,
    "startdate": "UNK",
    "enddate": "UNK",
    "groups": [],
    "grpmembershp": "UNK",
    "grplst": [],
    "userfeedback": [],
    "feedbackquestion": "UNK",
    "avgfeedbackscore": 0
}
```

=============================
---
## updateDeadlineTest (line 371):
=============================
---

---
## Prerequisite
---

### pre-req:
```
(checklogin) IS TRUE
AND $ha || $studentTeacher IS TRUE
```

---
## send parameters inputs to sectionedservice.php 
---

### send
```
{
    $opt = "UPDATEDEADLINE"
    $deadline = "2025-01-01 00:00:00"
    $relativedeadline = NULL 
    $link = 9020
}
You also need to gather all quizzes to compare if any updated.
```

---
## SQL Query: 
---

```
"SELECT deadline, relativedeadline FROM quiz" save into beforeUpdated
```

---
## Get updated deadlines
---

## SQL Query: 
---

```
"SELECT deadline, relativedeadline FROM codeexample" save into afterUpdated
```

---
## Service output:
---

## Gather service output
---

#### Output
```
{
    "entries": [],
    "debug": "NONE!",
    "writeaccess": false,
    "studentteacher": false,
    "readaccess": false,
    "coursename": "UNK",
    "coursevers": "UNK",
    "coursecode": "UNK",
    "courseid": "UNK",
    "links": [],
    "duggor": [],
    "results": [],
    "versions": [
        {
            "cid": "1",
            "coursecode": "DV12G",
            "vers": "45656",
            "versname": "HT15",
            "coursename": "Webbprogrammering",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Webbprogrammering - HT15"
        },
        {
            "cid": "1",
            "coursecode": "DV12G",
            "vers": "45657",
            "versname": "HT16",
            "coursename": "Webbprogrammering",
            "coursenamealt": "UNK",
            "startdate": "2015-12-29 00:00:00",
            "enddate": "2016-03-08 00:00:00",
            "motd": "Webbprogrammering - HT16"
        },
        {
            "cid": "2",
            "coursecode": "IT118G",
            "vers": "97731",
            "versname": "HT14",
            "coursename": "Webbutveckling - datorgrafik",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Webbutveckling - datorgrafik - HT14"
        },
        {
            "cid": "2",
            "coursecode": "IT118G",
            "vers": "97732",
            "versname": "HT15",
            "coursename": "Webbutveckling - datorgrafik",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Webbutveckling - datorgrafik - HT15"
        },
        {
            "cid": "3",
            "coursecode": "IT500G",
            "vers": "1337",
            "versname": "HT15",
            "coursename": "Datorns grunder",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Datorns grunder - HT15"
        },
        {
            "cid": "4",
            "coursecode": "IT301G",
            "vers": "1338",
            "versname": "HT15",
            "coursename": "Software Engineering",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Software Engineering - HT15"
        },
        {
            "cid": "305",
            "coursecode": "IT308G",
            "vers": "12305",
            "versname": "HT15",
            "coursename": "Objektorienterad programmering",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "307",
            "coursecode": "IT115G",
            "vers": "12307",
            "versname": "HT15",
            "coursename": "Datorns grunder",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "308",
            "coursecode": "MA161G",
            "vers": "12308",
            "versname": "HT15",
            "coursename": "Diskret matematik",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "309",
            "coursecode": "DA322G",
            "vers": "12309",
            "versname": "HT15",
            "coursename": "Operativsystem",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "312",
            "coursecode": "IT326G",
            "vers": "12312",
            "versname": "HT15",
            "coursename": "Distribuerade system",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "319",
            "coursecode": "DV736A",
            "vers": "12319",
            "versname": "HT15",
            "coursename": "Examensarbete i datavetenskap",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "324",
            "coursecode": "IT108G",
            "vers": "12324",
            "versname": "HT15",
            "coursename": "Webbutveckling - webbplatsdesign",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "1885",
            "coursecode": "G1337",
            "vers": "1337",
            "versname": "",
            "coursename": "Testing-Course",
            "coursenamealt": "Course for testing codeviewer",
            "startdate": "2020-05-01 00:00:00",
            "enddate": "2020-06-30 00:00:00",
            "motd": "Code examples shows both templateid and boxid!"
        },
        {
            "cid": "1894",
            "coursecode": "G420",
            "vers": "52432",
            "versname": "ST20",
            "coursename": "Demo-Course",
            "coursenamealt": "Chaos Theory - Conspiracy 64k Demo",
            "startdate": "2020-05-01 00:00:00",
            "enddate": "2020-06-30 00:00:00",
            "motd": "Demo Course 2020 - All current duggas"
        }
    ],
    "codeexamples": [],
    "unmarked": 0,
    "startdate": "UNK",
    "enddate": "UNK",
    "groups": [],
    "grpmembershp": "UNK",
    "grplst": [],
    "userfeedback": [],
    "feedbackquestion": "UNK",
    "avgfeedbackscore": 0
}
```

=============================
---
## updateTabsTest (line 381):
=============================
---

---
## Prerequisite
---

### pre-req:
```
(checklogin) IS TRUE
AND $ha || $studentTeacher IS TRUE
```

---
## send parameters inputs to sectionedservice.php 
---

### send
```
{
    $opt = "UPDATETABS"
    $sectid = 9999
    $tabs = 0
}
You also need to gather all listentries to compare if any updated.
```

---
## SQL Query: 
---

```
"SELECT gradesystem FROM listentries" save into beforeUpdated
```

---
## Get updated listentries
---

## SQL Query: 
---

```
"SELECT gradesystem FROM listentries" save into afterUpdated
```

---
## Service output:
---

## Gather service output
---

#### Output
```
{
    "entries": [],
    "debug": "NONE!",
    "writeaccess": false,
    "studentteacher": false,
    "readaccess": false,
    "coursename": "UNK",
    "coursevers": "UNK",
    "coursecode": "UNK",
    "courseid": "UNK",
    "links": [],
    "duggor": [],
    "results": [],
    "versions": [
        {
            "cid": "1",
            "coursecode": "DV12G",
            "vers": "45656",
            "versname": "HT15",
            "coursename": "Webbprogrammering",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Webbprogrammering - HT15"
        },
        {
            "cid": "1",
            "coursecode": "DV12G",
            "vers": "45657",
            "versname": "HT16",
            "coursename": "Webbprogrammering",
            "coursenamealt": "UNK",
            "startdate": "2015-12-29 00:00:00",
            "enddate": "2016-03-08 00:00:00",
            "motd": "Webbprogrammering - HT16"
        },
        {
            "cid": "2",
            "coursecode": "IT118G",
            "vers": "97731",
            "versname": "HT14",
            "coursename": "Webbutveckling - datorgrafik",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Webbutveckling - datorgrafik - HT14"
        },
        {
            "cid": "2",
            "coursecode": "IT118G",
            "vers": "97732",
            "versname": "HT15",
            "coursename": "Webbutveckling - datorgrafik",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Webbutveckling - datorgrafik - HT15"
        },
        {
            "cid": "3",
            "coursecode": "IT500G",
            "vers": "1337",
            "versname": "HT15",
            "coursename": "Datorns grunder",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Datorns grunder - HT15"
        },
        {
            "cid": "4",
            "coursecode": "IT301G",
            "vers": "1338",
            "versname": "HT15",
            "coursename": "Software Engineering",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Software Engineering - HT15"
        },
        {
            "cid": "305",
            "coursecode": "IT308G",
            "vers": "12305",
            "versname": "HT15",
            "coursename": "Objektorienterad programmering",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "307",
            "coursecode": "IT115G",
            "vers": "12307",
            "versname": "HT15",
            "coursename": "Datorns grunder",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "308",
            "coursecode": "MA161G",
            "vers": "12308",
            "versname": "HT15",
            "coursename": "Diskret matematik",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "309",
            "coursecode": "DA322G",
            "vers": "12309",
            "versname": "HT15",
            "coursename": "Operativsystem",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "312",
            "coursecode": "IT326G",
            "vers": "12312",
            "versname": "HT15",
            "coursename": "Distribuerade system",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "319",
            "coursecode": "DV736A",
            "vers": "12319",
            "versname": "HT15",
            "coursename": "Examensarbete i datavetenskap",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "324",
            "coursecode": "IT108G",
            "vers": "12324",
            "versname": "HT15",
            "coursename": "Webbutveckling - webbplatsdesign",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "1885",
            "coursecode": "G1337",
            "vers": "1337",
            "versname": "",
            "coursename": "Testing-Course",
            "coursenamealt": "Course for testing codeviewer",
            "startdate": "2020-05-01 00:00:00",
            "enddate": "2020-06-30 00:00:00",
            "motd": "Code examples shows both templateid and boxid!"
        },
        {
            "cid": "1894",
            "coursecode": "G420",
            "vers": "52432",
            "versname": "ST20",
            "coursename": "Demo-Course",
            "coursenamealt": "Chaos Theory - Conspiracy 64k Demo",
            "startdate": "2020-05-01 00:00:00",
            "enddate": "2020-06-30 00:00:00",
            "motd": "Demo Course 2020 - All current duggas"
        }
    ],
    "codeexamples": [],
    "unmarked": 0,
    "startdate": "UNK",
    "enddate": "UNK",
    "groups": [],
    "grpmembershp": "UNK",
    "grplst": [],
    "userfeedback": [],
    "feedbackquestion": "UNK",
    "avgfeedbackscore": 0
}
```

=============================
---
## updateVersTest (line 390):
=============================
---

---
## Prerequisite
---

### pre-req:
```
(checklogin) IS TRUE
AND $ha || $studentTeacher IS TRUE
```

---
## send parameters inputs to sectionedservice.php 
---

### send
```
{
    $opt = "UPDATEVRS"
    $courseid = 1885
    $coursecode = "G420"
    $versid = 99999
    $motd = "Test"
    $versname = "HT25"
}
You also need to gather all vers to compare if any updated.
```

---
## SQL Query: 
---

```
"SELECT * FROM vers" save into beforeUpdatedV
And also course.
```

---
## SQL Query: 
---

```
"SELECT activeversion FROM course" save into beforeUpdatedC
```

---
## Get updated vers and course
---

## SQL Query: 
---

```
"SELECT activeversion FROM course" save into afterUpdatedC
```

---
## SQL Query: 
---

```
"SELECT * FROM vers" save into afterUpdatedV
```

---
## Service output:
---

## Gather service output
---

#### Output
```
{
    "entries": [],
    "debug": "NONE!",
    "writeaccess": false,
    "studentteacher": false,
    "readaccess": false,
    "coursename": "UNK",
    "coursevers": "UNK",
    "coursecode": "UNK",
    "courseid": "UNK",
    "links": [],
    "duggor": [],
    "results": [],
    "versions": [
        {
            "cid": "1",
            "coursecode": "DV12G",
            "vers": "45656",
            "versname": "HT15",
            "coursename": "Webbprogrammering",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Webbprogrammering - HT15"
        },
        {
            "cid": "1",
            "coursecode": "DV12G",
            "vers": "45657",
            "versname": "HT16",
            "coursename": "Webbprogrammering",
            "coursenamealt": "UNK",
            "startdate": "2015-12-29 00:00:00",
            "enddate": "2016-03-08 00:00:00",
            "motd": "Webbprogrammering - HT16"
        },
        {
            "cid": "2",
            "coursecode": "IT118G",
            "vers": "97731",
            "versname": "HT14",
            "coursename": "Webbutveckling - datorgrafik",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Webbutveckling - datorgrafik - HT14"
        },
        {
            "cid": "2",
            "coursecode": "IT118G",
            "vers": "97732",
            "versname": "HT15",
            "coursename": "Webbutveckling - datorgrafik",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Webbutveckling - datorgrafik - HT15"
        },
        {
            "cid": "3",
            "coursecode": "IT500G",
            "vers": "1337",
            "versname": "HT15",
            "coursename": "Datorns grunder",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Datorns grunder - HT15"
        },
        {
            "cid": "4",
            "coursecode": "IT301G",
            "vers": "1338",
            "versname": "HT15",
            "coursename": "Software Engineering",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Software Engineering - HT15"
        },
        {
            "cid": "305",
            "coursecode": "IT308G",
            "vers": "12305",
            "versname": "HT15",
            "coursename": "Objektorienterad programmering",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "307",
            "coursecode": "IT115G",
            "vers": "12307",
            "versname": "HT15",
            "coursename": "Datorns grunder",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "308",
            "coursecode": "MA161G",
            "vers": "12308",
            "versname": "HT15",
            "coursename": "Diskret matematik",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "309",
            "coursecode": "DA322G",
            "vers": "12309",
            "versname": "HT15",
            "coursename": "Operativsystem",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "312",
            "coursecode": "IT326G",
            "vers": "12312",
            "versname": "HT15",
            "coursename": "Distribuerade system",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "319",
            "coursecode": "DV736A",
            "vers": "12319",
            "versname": "HT15",
            "coursename": "Examensarbete i datavetenskap",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "324",
            "coursecode": "IT108G",
            "vers": "12324",
            "versname": "HT15",
            "coursename": "Webbutveckling - webbplatsdesign",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "1885",
            "coursecode": "G1337",
            "vers": "1337",
            "versname": "",
            "coursename": "Testing-Course",
            "coursenamealt": "Course for testing codeviewer",
            "startdate": "2020-05-01 00:00:00",
            "enddate": "2020-06-30 00:00:00",
            "motd": "Code examples shows both templateid and boxid!"
        },
        {
            "cid": "1894",
            "coursecode": "G420",
            "vers": "52432",
            "versname": "ST20",
            "coursename": "Demo-Course",
            "coursenamealt": "Chaos Theory - Conspiracy 64k Demo",
            "startdate": "2020-05-01 00:00:00",
            "enddate": "2020-06-30 00:00:00",
            "motd": "Demo Course 2020 - All current duggas"
        }
    ],
    "codeexamples": [],
    "unmarked": 0,
    "startdate": "UNK",
    "enddate": "UNK",
    "groups": [],
    "grpmembershp": "UNK",
    "grplst": [],
    "userfeedback": [],
    "feedbackquestion": "UNK",
    "avgfeedbackscore": 0
}
```

=============================
---
## changeVersTest (line 434):
=============================
---

---
## Prerequisite
---

### pre-req:
```
(checklogin) IS TRUE
AND $ha || $studentTeacher IS TRUE
```

---
## send parameters inputs to sectionedservice.php 
---

### send
```
{
    opt = "CHGVERS"
    courseid = "G420"
    versid = 99999
}
You also need to gather all courses to compare if any updated.
```

---
## SQL Query: 
---

```
"SELECT activeversion FROM course" save into beforeUpdated
```

---
## Get updated vers and course
---

## SQL Query: 
---

```
"SELECT activeversion FROM course" save into afterUpdated
```

---
## Service output:
---

## Gather service output
---

#### Output
```
{
    "entries": [],
    "debug": "NONE!",
    "writeaccess": false,
    "studentteacher": false,
    "readaccess": false,
    "coursename": "UNK",
    "coursevers": "UNK",
    "coursecode": "UNK",
    "courseid": "UNK",
    "links": [],
    "duggor": [],
    "results": [],
    "versions": [
        {
            "cid": "1",
            "coursecode": "DV12G",
            "vers": "45656",
            "versname": "HT15",
            "coursename": "Webbprogrammering",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Webbprogrammering - HT15"
        },
        {
            "cid": "1",
            "coursecode": "DV12G",
            "vers": "45657",
            "versname": "HT16",
            "coursename": "Webbprogrammering",
            "coursenamealt": "UNK",
            "startdate": "2015-12-29 00:00:00",
            "enddate": "2016-03-08 00:00:00",
            "motd": "Webbprogrammering - HT16"
        },
        {
            "cid": "2",
            "coursecode": "IT118G",
            "vers": "97731",
            "versname": "HT14",
            "coursename": "Webbutveckling - datorgrafik",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Webbutveckling - datorgrafik - HT14"
        },
        {
            "cid": "2",
            "coursecode": "IT118G",
            "vers": "97732",
            "versname": "HT15",
            "coursename": "Webbutveckling - datorgrafik",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Webbutveckling - datorgrafik - HT15"
        },
        {
            "cid": "3",
            "coursecode": "IT500G",
            "vers": "1337",
            "versname": "HT15",
            "coursename": "Datorns grunder",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Datorns grunder - HT15"
        },
        {
            "cid": "4",
            "coursecode": "IT301G",
            "vers": "1338",
            "versname": "HT15",
            "coursename": "Software Engineering",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Software Engineering - HT15"
        },
        {
            "cid": "305",
            "coursecode": "IT308G",
            "vers": "12305",
            "versname": "HT15",
            "coursename": "Objektorienterad programmering",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "307",
            "coursecode": "IT115G",
            "vers": "12307",
            "versname": "HT15",
            "coursename": "Datorns grunder",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "308",
            "coursecode": "MA161G",
            "vers": "12308",
            "versname": "HT15",
            "coursename": "Diskret matematik",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "309",
            "coursecode": "DA322G",
            "vers": "12309",
            "versname": "HT15",
            "coursename": "Operativsystem",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "312",
            "coursecode": "IT326G",
            "vers": "12312",
            "versname": "HT15",
            "coursename": "Distribuerade system",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "319",
            "coursecode": "DV736A",
            "vers": "12319",
            "versname": "HT15",
            "coursename": "Examensarbete i datavetenskap",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "324",
            "coursecode": "IT108G",
            "vers": "12324",
            "versname": "HT15",
            "coursename": "Webbutveckling - webbplatsdesign",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "1885",
            "coursecode": "G1337",
            "vers": "1337",
            "versname": "",
            "coursename": "Testing-Course",
            "coursenamealt": "Course for testing codeviewer",
            "startdate": "2020-05-01 00:00:00",
            "enddate": "2020-06-30 00:00:00",
            "motd": "Code examples shows both templateid and boxid!"
        },
        {
            "cid": "1894",
            "coursecode": "G420",
            "vers": "52432",
            "versname": "ST20",
            "coursename": "Demo-Course",
            "coursenamealt": "Chaos Theory - Conspiracy 64k Demo",
            "startdate": "2020-05-01 00:00:00",
            "enddate": "2020-06-30 00:00:00",
            "motd": "Demo Course 2020 - All current duggas"
        }
    ],
    "codeexamples": [],
    "unmarked": 0,
    "startdate": "UNK",
    "enddate": "UNK",
    "groups": [],
    "grpmembershp": "UNK",
    "grplst": [],
    "userfeedback": [],
    "feedbackquestion": "UNK",
    "avgfeedbackscore": 0
}
```

=============================
---
## hiddenTest (line 434):
=============================
---

---
## Prerequisite
---

### pre-req:
```
(checklogin) IS TRUE
AND $ha || $studentTeacher IS TRUE
```

---
## send parameters inputs to sectionedservice.php 
---

### send
```
{
* opt = "HIDDEN"
* sectid = 9999
* visible = 0
}
You also need to gather all listentries to compare if any updated.
```

---
## SQL Query: 
---

```
"SELECT visible FROM listentries" save into beforeUpdated
```

---
## Get updated vers and course
---

## SQL Query: 
---

```
"SELECT visible FROM listentries" save into afterUpdated
```

---
## Service output:
---

## Gather service output
---

#### Output
```
{
    "entries": [],
    "debug": "NONE!",
    "writeaccess": false,
    "studentteacher": false,
    "readaccess": false,
    "coursename": "UNK",
    "coursevers": "UNK",
    "coursecode": "UNK",
    "courseid": "UNK",
    "links": [],
    "duggor": [],
    "results": [],
    "versions": [
        {
            "cid": "1",
            "coursecode": "DV12G",
            "vers": "45656",
            "versname": "HT15",
            "coursename": "Webbprogrammering",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Webbprogrammering - HT15"
        },
        {
            "cid": "1",
            "coursecode": "DV12G",
            "vers": "45657",
            "versname": "HT16",
            "coursename": "Webbprogrammering",
            "coursenamealt": "UNK",
            "startdate": "2015-12-29 00:00:00",
            "enddate": "2016-03-08 00:00:00",
            "motd": "Webbprogrammering - HT16"
        },
        {
            "cid": "2",
            "coursecode": "IT118G",
            "vers": "97731",
            "versname": "HT14",
            "coursename": "Webbutveckling - datorgrafik",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Webbutveckling - datorgrafik - HT14"
        },
        {
            "cid": "2",
            "coursecode": "IT118G",
            "vers": "97732",
            "versname": "HT15",
            "coursename": "Webbutveckling - datorgrafik",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Webbutveckling - datorgrafik - HT15"
        },
        {
            "cid": "3",
            "coursecode": "IT500G",
            "vers": "1337",
            "versname": "HT15",
            "coursename": "Datorns grunder",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Datorns grunder - HT15"
        },
        {
            "cid": "4",
            "coursecode": "IT301G",
            "vers": "1338",
            "versname": "HT15",
            "coursename": "Software Engineering",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Software Engineering - HT15"
        },
        {
            "cid": "305",
            "coursecode": "IT308G",
            "vers": "12305",
            "versname": "HT15",
            "coursename": "Objektorienterad programmering",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "307",
            "coursecode": "IT115G",
            "vers": "12307",
            "versname": "HT15",
            "coursename": "Datorns grunder",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "308",
            "coursecode": "MA161G",
            "vers": "12308",
            "versname": "HT15",
            "coursename": "Diskret matematik",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "309",
            "coursecode": "DA322G",
            "vers": "12309",
            "versname": "HT15",
            "coursename": "Operativsystem",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "312",
            "coursecode": "IT326G",
            "vers": "12312",
            "versname": "HT15",
            "coursename": "Distribuerade system",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "319",
            "coursecode": "DV736A",
            "vers": "12319",
            "versname": "HT15",
            "coursename": "Examensarbete i datavetenskap",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "324",
            "coursecode": "IT108G",
            "vers": "12324",
            "versname": "HT15",
            "coursename": "Webbutveckling - webbplatsdesign",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "1885",
            "coursecode": "G1337",
            "vers": "1337",
            "versname": "",
            "coursename": "Testing-Course",
            "coursenamealt": "Course for testing codeviewer",
            "startdate": "2020-05-01 00:00:00",
            "enddate": "2020-06-30 00:00:00",
            "motd": "Code examples shows both templateid and boxid!"
        },
        {
            "cid": "1894",
            "coursecode": "G420",
            "vers": "52432",
            "versname": "ST20",
            "coursename": "Demo-Course",
            "coursenamealt": "Chaos Theory - Conspiracy 64k Demo",
            "startdate": "2020-05-01 00:00:00",
            "enddate": "2020-06-30 00:00:00",
            "motd": "Demo Course 2020 - All current duggas"
        }
    ],
    "codeexamples": [],
    "unmarked": 0,
    "startdate": "UNK",
    "enddate": "UNK",
    "groups": [],
    "grpmembershp": "UNK",
    "grplst": [],
    "userfeedback": [],
    "feedbackquestion": "UNK",
    "avgfeedbackscore": 0
}
```

=============================
---
## publicTest (line 453):
=============================
---

---
## Prerequisite
---

### pre-req:
```
(checklogin) IS TRUE
AND $ha || $studentTeacher IS TRUE
```

---
## send parameters inputs to sectionedservice.php 
---

### send
```
{
    opt = "PUBLIC"
    sectid = 9999
    visible = 1
}
You also need to gather all listentries to compare if any updated.
```

---
## SQL Query: 
---

```
"SELECT visible FROM listentries" save into beforeUpdated
```

---
## Get updated vers and course
---

## SQL Query: 
---

```
"SELECT visible FROM listentries" save into afterUpdated
```

---
## Service output:
---

## Gather service output
---

#### Output
```
{
    "entries": [],
    "debug": "NONE!",
    "writeaccess": false,
    "studentteacher": false,
    "readaccess": false,
    "coursename": "UNK",
    "coursevers": "UNK",
    "coursecode": "UNK",
    "courseid": "UNK",
    "links": [],
    "duggor": [],
    "results": [],
    "versions": [
        {
            "cid": "1",
            "coursecode": "DV12G",
            "vers": "45656",
            "versname": "HT15",
            "coursename": "Webbprogrammering",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Webbprogrammering - HT15"
        },
        {
            "cid": "1",
            "coursecode": "DV12G",
            "vers": "45657",
            "versname": "HT16",
            "coursename": "Webbprogrammering",
            "coursenamealt": "UNK",
            "startdate": "2015-12-29 00:00:00",
            "enddate": "2016-03-08 00:00:00",
            "motd": "Webbprogrammering - HT16"
        },
        {
            "cid": "2",
            "coursecode": "IT118G",
            "vers": "97731",
            "versname": "HT14",
            "coursename": "Webbutveckling - datorgrafik",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Webbutveckling - datorgrafik - HT14"
        },
        {
            "cid": "2",
            "coursecode": "IT118G",
            "vers": "97732",
            "versname": "HT15",
            "coursename": "Webbutveckling - datorgrafik",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Webbutveckling - datorgrafik - HT15"
        },
        {
            "cid": "3",
            "coursecode": "IT500G",
            "vers": "1337",
            "versname": "HT15",
            "coursename": "Datorns grunder",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Datorns grunder - HT15"
        },
        {
            "cid": "4",
            "coursecode": "IT301G",
            "vers": "1338",
            "versname": "HT15",
            "coursename": "Software Engineering",
            "coursenamealt": "UNK",
            "startdate": "2014-12-29 00:00:00",
            "enddate": "2015-03-08 00:00:00",
            "motd": "Software Engineering - HT15"
        },
        {
            "cid": "305",
            "coursecode": "IT308G",
            "vers": "12305",
            "versname": "HT15",
            "coursename": "Objektorienterad programmering",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "307",
            "coursecode": "IT115G",
            "vers": "12307",
            "versname": "HT15",
            "coursename": "Datorns grunder",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "308",
            "coursecode": "MA161G",
            "vers": "12308",
            "versname": "HT15",
            "coursename": "Diskret matematik",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "309",
            "coursecode": "DA322G",
            "vers": "12309",
            "versname": "HT15",
            "coursename": "Operativsystem",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "312",
            "coursecode": "IT326G",
            "vers": "12312",
            "versname": "HT15",
            "coursename": "Distribuerade system",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "319",
            "coursecode": "DV736A",
            "vers": "12319",
            "versname": "HT15",
            "coursename": "Examensarbete i datavetenskap",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "324",
            "coursecode": "IT108G",
            "vers": "12324",
            "versname": "HT15",
            "coursename": "Webbutveckling - webbplatsdesign",
            "coursenamealt": "UNK",
            "startdate": null,
            "enddate": null,
            "motd": null
        },
        {
            "cid": "1885",
            "coursecode": "G1337",
            "vers": "1337",
            "versname": "",
            "coursename": "Testing-Course",
            "coursenamealt": "Course for testing codeviewer",
            "startdate": "2020-05-01 00:00:00",
            "enddate": "2020-06-30 00:00:00",
            "motd": "Code examples shows both templateid and boxid!"
        },
        {
            "cid": "1894",
            "coursecode": "G420",
            "vers": "52432",
            "versname": "ST20",
            "coursename": "Demo-Course",
            "coursenamealt": "Chaos Theory - Conspiracy 64k Demo",
            "startdate": "2020-05-01 00:00:00",
            "enddate": "2020-06-30 00:00:00",
            "motd": "Demo Course 2020 - All current duggas"
        }
    ],
    "codeexamples": [],
    "unmarked": 0,
    "startdate": "UNK",
    "enddate": "UNK",
    "groups": [],
    "grpmembershp": "UNK",
    "grplst": [],
    "userfeedback": [],
    "feedbackquestion": "UNK",
    "avgfeedbackscore": 0
}
```