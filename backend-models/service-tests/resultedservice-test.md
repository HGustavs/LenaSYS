# resultedservice.php
====================
---
## TEST #1 - 38-45
## Get data to display
===================
---

---
## Prerequisite
---

### pre-req:

```
isSuperUser()$userid
||
hasAccess($userid, cid, 'w')
```


### login Values: 

```
username: 2
password: Kong
```


### pre-values
```
$preValuescourse = 
{
	"testcoursecode",
	"1"
};

pre-query:	INSERT INTO course(coursecode, creator) VALUES(preValuescourse[0], preValuescourse[1]);
pre-query:	SELECT cid FROM course WHERE coursecode = "testcoursecode";
		//save value from above query to use in later inserts.

$preValuesListentries = 
{
    VALUE FRFOM PREVIOUS QUERY CID, 
    "Inserttobedeleted",
    "UNK",
    4,
    12,
    2,
    1,
    1337,
    1,
    1,
    0, 
    "UNK"
}; 

pre-query:  	INSERT INTO listentries(cid,entryname,link,kind,pos,creator,visible,vers,gradesystem,highscoremode,feedbackenabled,feedbackquestion) 
            	VALUES ($preValuesListentries[0], $preValuesListentries[1], $preValuesListentries[2], $preValuesListentries[3], $preValuesListentries[4], $preValuesListentries[5], $preValuesListentries[6], $preValuesListentries[7], $preValuesListentries[8], $preValuesListentries[9],$preValuesListentries[10],$preValuesListentries[11]);

pre-query:	    SELECT lid FROM listentries WHERE cid = VALUE FROM PREVIOUS QUERY CID
//save this value as lid

$preValuesQuiz = 
{
        VALUE FROM PREVIOUS QUERY CID, 
        0,
        1,
        "AutomaticTest",
        "Quiz",
        "2023-04-27 00:00:00",
        "2023-04-29 00:00:00",
        2,
        "1337",
        "2023-04-17",
        "{&quot;deadline1&quot;:&quot;2023-04-27 0:0&quot;,&quot;comment1&quot;:&quot;&quot;,&quot;deadline2&quot;:&quot;&quot;,&quot;comment2&quot;:&quot;&quot;,&quot;deadline3&quot;:&quot;&quot;,&quot;comment3&quot;:&quot;&quot;}"
}; 


pre-query:  	INSERT INTO quiz(cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,creator,vers,qstart,jsondeadline) 
           	VALUES ($preValuesQuiz[0], $preValuesQuiz[1], $preValuesQuiz[2], $preValuesQuiz[3], $preValuesQuiz[4], $preValuesQuiz[5], $preValuesQuiz[6], $preValuesQuiz[7], $preValuesQuiz[8], $preValuesQuiz[9], $preValuesQuiz[10]);

pre-query:	    SELECT id FROM quiz WHERE cid = VALUE FROM PREVIOUS QUERY CID;
//save this value as quizid

$preValuesVariant =
{
	VALUE FROM PREVIOUS QUERY QUIZID
};

pre-query:	INSERT INTO variant(quizID) VALUES($preValuesVariant[0]);
pre-query:	SELECT vid FROM variant WHERE quizID = VALUE FROM PREVIOUS QUERY QUIZID;
//save value as VID for later query

preValuesUserAnswer =
{
	VALUE FROM PREVIOUS QUERY CID,
	VALUE FROM PREVIOUS QUERY QUIZID,
	VALUE FROM PREVIOUS QUERY VID,
	VALUE FROM PREVIOUS QUERY LID,
	"testvers"
};

pre-query:	INSERT INTO userAnswer(cid, quiz, variant, moment, vers) VALUES($preValuesUserAnswer[0], $preValuesUserAnswer[1], $preValuesUserAnswer[2], $preValuesUserAnswer[3], $preValuesUserAnswer[4]);
```


---
## send parameters inputs to accessedservice.php 
---

### send
```
{
	$cid = ”SAVED VALUE CID”;
	$vers = "testvers";
}
```

--- 
## Gather service output
--- 

#### Output
```
Save the values of the echoed array as a JSON (at the end of the file. echo json_encode($array);)
This is the expected output for the micro service
```
---
### Remove inserted row from DB
---
```
DELETE FROM userAnswer
ORDER BY aid DESC LIMIT 1;

DELETE FROM variant
ORDER BY vid DESC LIMIT 1;

DELETE FROM quiz
ORDER BY id DESC LIMIT 1;

DELETE FROM listentries
ORDER BY lid DESC LIMIT 1;

DELETE FROM course
ORDER BY cid DESC LIMIT 1;
```
====================
---
## TEST #2 - 48-66
## Get filter options
===================
---

---
## Prerequisite
---

### pre-req:
```
isSuperUser()$userid
||
hasAccess($userid, cid, 'w')
```


### login Values: 
```
username: 2
password: Kong
```


### pre-values
```
$preValuescourse = 
{
    "testcoursecode",
    "1"
};

pre-query:    INSERT INTO course(coursecode, creator) VALUES(preValuescourse[0], preValuescourse[1]);
pre-query:    SELECT cid FROM course WHERE coursecode = "testcoursecode";
        //save value from above query to use later.

$preValuesListentries = 
{
    VALUE FRFOM PREVIOUS QUERY CID, 
    "Inserttobedeleted",
    "UNK",
    3,
    12,
    2,
    1,
    1337,
    1,
    1,
    0, 
    "UNK"
}; 
pre-query:      INSERT INTO listentries(cid,entryname,link,kind,pos,creator,visible,vers,gradesystem,highscoremode,feedbackenabled,feedbackquestion) 
                VALUES ($preValuesListentries[0], $preValuesListentries[1], $preValuesListentries[2], $preValuesListentries[3], $preValuesListentries[4], $preValuesListentries[5], $preValuesListentries[6], $preValuesListentries[7], $preValuesListentries[8], $preValuesListentries[9],$preValuesListentries[10],$preValuesListentries[11]);
```

---
## send parameters inputs to accessedservice.php 
---

### send
```
{
    $cid = ”SAVED VALUE CID”;
    $vers = "1337";
}
```

--- 
## Gather service output
--- 

#### Output
```
Save the values of the echoed array as a JSON (at the end of the file. echo json_encode($array);)
This is the expected output for the micro service
```

---
### Remove inserted row from DB
---
```
DELETE FROM listentries
ORDER BY lid DESC LIMIT 1;

DELETE FROM course
ORDER BY cid DESC LIMIT 1;
```