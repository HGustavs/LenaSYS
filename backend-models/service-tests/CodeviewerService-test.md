#codeviewerService

**********
##Prepare data  Line 71
**********


###pre-req:
```
{ (checklogin = true) &&
(hasAccess($userid, $courseId, 'w') || hasAccess($userid, $courseId, 'st')) ==
true give $writeAccess="w";, else $writeAccess="s";
```


###Login:
```
Username: 2
Password: Kong
```


mySQL to check that correct values are sent

```
Select * from codeexample where exampleid=9013
```

###Send:
```
send{
	$exampleCount=1;
	$exampleId=9013; 
	$exampleName=New Code;
	$courseID = 1885
	$cversion= 1337;
	$beforeId= [];
	$afterId= [];
	$public=0;
	$sectionName=New Code9013;
	$playlink= NULL;
}

```
###Service output
```
output{
  
}
```

***
##SETTEMPL  Line 96
***
###pre-req:
```
{ (checklogin = true) &&
(hasAccess($userid, $courseId, 'w') || hasAccess($userid, $courseId, 'st')) ==
true give $writeAccess="w";, else $writeAccess="s";
```


###Login:
```
Username: 2
Password: Kong
```
###Values
```
Send{
  $opt = "SETTEMPL";
  $templateNumber = 10;
  $exampleId = 9013;
  $courseId = 1885;
  $courseVersion = 1337;
  $i = 1;
  $kind = CODE
  $file = HTML-TEST1.html
  $wordlist = 1
}

```

###Service output
```
output{
  "opt":
  "before":([0,1,2,3,4])       //The Array represent the amount of values 
                               //0,1,4 = exempleID. 2 = sectionname. 3 = Filename
  "after":([0,1,2,3,4])        //Array, same as "before"
  "templateid":
  "stylesheet":
  "numbox":
  "box":([0,1,2,3,4,5,6,7,8])
  "improws":[]      //Array
  "impwords":[0]     //Array
  "directory":[0,1]    //Array
  "examplename":
  "sectionname":
  "playlink":
  "exampleno":
  "words":[0,1,2]        //Array
  "wordlists":[0,1]    //Array
  "writeaccess":
  "debug":
  "beforeafter":[0,1,2,3,4]  //Array, same as "before"
  "public":
  "courseid":
  "courseversion":
}
```
###Creation of new codeexemple that is visable
```
INSERT INTO listentries (cid,vers, entryname, link, kind, pos, visible,creator,comments, gradesystem, highscoremode, groupKind) VALUES(4,1338,'New Code',9012,2,5,1,2,'undefined', 2, 0, null);
insert into codeexample (cid, examplename, sectionname, beforeid, afterid, runlink, cversion, public, uid, templateid) values (4, 'New Code', 'New Code9012', NULL, NULL, NULL, 1338, 0, 1, 0);
```
**Prints out so we know starting value**
```
SELECT exampleid, templateid 
FROM codeexample;
```

**Update, test if templates work**
```
UPDATE codeexample 
SET templateid = (Number you wanna test) 
WHERE exampleid = (exampleId of testsubject);
```

**Prints out so we can see if update was successful**
```
SELECT exampleid, templateid 
FROM codeexample;
```



##EDITEXAMPLE Line 160
—-------------------------------------------------------------
Log in as toddler, testing-course, create new code example, choose template, example settings, fill in values as below:
SectionTitle: TestSecTitle	  		Title: TestTitle
Before: New Code9028:New Code 		After: New Code9030:New Code 
PLay Link: 					Important words: TestWord

Expected output:
{
  "opt": "EDITEXAMPLE",
  "before": [
    [ "9028", "New Code9028", "New Code", null, null ]
  ],
  "after": [
    [ "9030", "TestSecTitle", "TestTitle", "9028", "9030" ],
    [ "9030", "TestSecTitle", "TestTitle", "9028", "9030" ],
    [ "9030", "TestSecTitle", "TestTitle", "9028", "9030" ],
    [ "9030", "TestSecTitle", "TestTitle", "9028", "9030" ],
    [ "9030", "TestSecTitle", "TestTitle", "9028", "9030" ]
  ],
  "impwords": [
    "TestWord"
  ],
  "examplename": "TestTitle",
  "sectionname": "TestSecTitle",
  "playlink": null,
  "debug": "NONE!",
  "courseid": "1885",
  "courseversion": "1337"
}








##EDITCONTENT Line 234
—-------------------------------------------------------------
Title: Title	Kind: Code
Worldist: JS	File:HTML-TEST1-html
Font size: 9px
Title: Title EditContentTestTitle	Kind: Document
Worldist: Plain Text	File: Greger.txt
Font size: 11 px

{
  "opt": "EDITCONTENT",
  "wordlists": [
    [ "1", "JS" ],
    [ "2", "PHP" ],
    [ "3", "HTML" ],
    [ "4", "Plain Text" ],
    [ "5", "Java" ],
    [ "6",’ "SR" ],
    [ "7", "SQL" ]
  ],
}




##EDITTITLE line 281
—---------------------------------------------------------------------------------
FIXED, Do new test

##DELEXAMPLE Line 294
—-------------------------------------------------------------

Expected output:
{"deleted":true,"debug":"NONE!"}



		
		


