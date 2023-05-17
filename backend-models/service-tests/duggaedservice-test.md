
# duggaedservice.php
====================
---
## Create an assignment (line 57):
===================
---

---
## Prerequisite
---

### pre-req:
 
```
(checklogin) IS TRUE && 
(hasAccess($userid, $cid, 'w') || isSuperUser($userid) || hasAccess $userid, $cid, 'st') IS TRUE
```

### login Values: 

```
username: 2
password: Kong
```

---
## send parameters inputs to duggaedservice.php 
---

### send
```
{
    $opt = "SAVDUGGA";
    $qid = null; or $qid = “UNK”;
    $cid = 1885;
    $userid = 2;        // this is automatically added depending on what session is active (if any), we want the value to be 2
    $coursevers = 1337;
    $qname = "TestQuiz";
    $autograde = 1;
    $gradesys = 2;
    $template = "Quiz";
    $jsondeadline = '{&quot;deadline1&quot;:&quot;2023-04-27 0:0&quot;,&quot;comment1&quot;:&quot;&quot;,&quot;deadline2&quot;:&quot;&quot;,&quot;comment2&quot;:&quot;&quot;,&quot;deadline3&quot;:&quot;&quot;,&quot;comment3&quot;:&quot;&quot;}';
    $release = "2023-04-27 00:00:00";
    $deadline = "2023-04-29 00:00:00";
    $qstart = "2023-04-17";
} 
```


### Get newly creaded Assignment ID
save to variable __$id__ this value will identify the last assignment that was created (it has the highest ID number) 
    
    SQL-query: SELECT MAX(id) FROM quiz;    

---
## Gather service output
--- 

#### Output    
    {
        LastCourseCreated[]
        entries([       // 2D-array each cell will contain an associative array with the cell names below.  
            cid:
            coursename:
            coursecode:
            visibility:
            activeversion:
            activeedversion:
            registered:
        ]);
        versions([       // 2D-array each cell will contain an associative array with the cell names below.
            cid:
            coursecode:
            vers:
            versname:
            coursename:
            coursenamealt:
        ]);
        debug:
        writeaccess:
        motd:
        readonly:
    }
    


---
## Reset database 
---

### remove inserted row from DB, using qid 

    SQL-query: DELETE FROM quiz WHERE id = $id;


================================
---
# Update an Assignment (line 68):
================================
---

---
## Prerequisite
---


### pre-req:
 
```
(checklogin) IS TRUE && 
(hasAccess($userid, $cid, 'w') || isSuperUser($userid) || hasAccess $userid, $cid, 'st') IS TRUE
```

### pre-req data
Create an assignment, and save information on all attribute in an array  
```
$pre-Values = { null,
                1885, 
                0,
                1,
                "AutomaticTest",
                "Quiz",
                "2023-04-27 00:00:00",
                "2023-04-29 00:00:00",
                2,
                "1337",
                "2023-04-17",
                "{&quot;deadline1&quot;:&quot;2023-04-27 0:0&quot;,&quot;comment1&quot;:&quot;&quot;,&quot;deadline2&quot;:&quot;&quot;,&quot;comment2&quot;:&quot;&quot;,&quot;deadline3&quot;:&quot;&quot;,&quot;comment3&quot;:&quot;&quot;}", 
                0 }; 
```
```
SQL-query:  INSERT INTO quiz(cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,creator,vers,qstart,jsondeadline,`group`) 
            VALUES ($pre-Values[1], $pre-Values[2], $pre-Values[3], $pre-Values[4], $pre-Values[5], $pre-Values[6], $pre-Values[7], $pre-Values[8], $pre-Values[9], $pre-Values[10], $pre-Values[11] );
```

finally get the created Assignments _id_, save it in __$pre-Values[0]__.


    SQL-Query: SELECT MAX(id) FROM quiz; 

---
### Login Values
---
```
username: 2
password: Kong
```

---
## Update information on an assignment send parameters inputs to duggaedservice.php 
---

### Send
```
{
    $opt = "SAVDUGGA";
    $qid = $pre-Values[0];    
    $name = "UpdatedAutomaticTest";
    $autograde = 1;
    $gradesys = 2;
    $template = "group-assignment";
    $jsondeadline = '{&quot;deadline1&quot;:&quot;2023-04-30 0:0&quot;,&quot;comment1&quot;:&quot;&quot;,&quot;deadline2&quot;:&quot;&quot;,&quot;comment2&quot;:&quot;&quot;,&quot;deadline3&quot;:&quot;&quot;,&quot;comment3&quot;:&quot;&quot;}';,
    $groupAssignment = 1; 
    $release = "2023-04-28 00:00:00";
    $deadline = "2023-04-30 00:00:00";
    $qstart = "2023-04-18";
}
```

---
## Gather service output
--- 

#### Output    
    {
        LastCourseCreated[]
        entries([         // 2D-array each cell will contain an associative array with the cell names below.
            cid:
            coursename:
            coursecode:
            visibility:
            activeversion:
            activeedversion:
            registered:
        ]);
        versions([        // 2D-array each cell will contain an associative array with the cell names below.
            cid:
            coursecode:
            vers:
            versname:
            coursename:
            coursenamealt:
        ]);
        debug:
        writeaccess:
        motd:
        readonly:
    }
    
---
## Reset database 
---

remove inserted row from DB, using __$pre-Values[0]__ 

    SQL-query: DELETE FROM quiz WHERE id = $pre-Values[0]; 



=============================
---
## Delete an Assignment (line 95):
=============================
--- 

---
## Prerequisite
---


### pre-req:
 
```
(checklogin) IS TRUE && 
(hasAccess($userid, $cid, 'w') || isSuperUser($userid) || hasAccess $userid, $cid, 'st') IS TRUE
```

### pre-req data
Create an assignment
```
$pre-Values = { 1885, 
                0,
                1,
                "AutomaticTest",
                "Quiz",
                "2023-04-27 00:00:00",
                "2023-04-28 00:00:00",
                2,
                "1337",
                "2023-04-17",
                "{&quot;deadline1&quot;:&quot;2023-04-27 0:0&quot;,&quot;comment1&quot;:&quot;&quot;,&quot;deadline2&quot;:&quot;&quot;,&quot;comment2&quot;:&quot;&quot;,&quot;deadline3&quot;:&quot;&quot;,&quot;comment3&quot;:&quot;&quot;}", 
                0 }; 

```
```
SQL-query:  INSERT INTO quiz(cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,creator,vers,qstart,jsondeadline,`group`) 
            VALUES ($pre-Values[0], $pre-Values[1], $pre-Values[2], $pre-Values[3], $pre-Values[4], $pre-Values[5], $pre-Values[6], $pre-Values[7], $pre-Values[8], $pre-Values[9], $pre-Values[10] );
```

### Save qid. 	
this value is to be saved to variable __$id__, it will be used as ID when we identify and delete the data from the database.
    
    SQL-query: SELECT MAX(id) FROM quiz;    


### login Values: 

```
username: 2
password: Kong
```

---
## Update information on an assignment, send parameters inputs to duggaedservice.php 
---

### send
```
{
    $opt = "DELDU";
    $qid = $id;
}
```

---
## Gather service output
--- 

#### Output    
    {
        LastCourseCreated[]
        entries([        // 2D-array each cell will contain an associative array with the cell names below.
            cid:
            coursename:
            coursecode:
            visibility:
            activeversion:
            activeedversion:
            registered:
        ]);
        versions([       // 2D-array each cell will contain an associative array with the cell names below.
            cid:
            coursecode:
            vers:
            versname:
            coursename:
            coursenamealt:
        ]);
        debug:
        writeaccess:
        motd:
        readonly:
    }


---
## Reset database 
---

__ALL THE INSERTS WILL HAVE TO BE DELETED.__
That means that if the test failed, then this test needs to go in and delete the inserts we made __manualy__.



=================================
---
## Add Variant (contents of quiz) (line 110):
=================================
---


---
## Prerequisite
---


### pre-req:
 
```
(checklogin) IS TRUE && 
(hasAccess($userid, $cid, 'w') || isSuperUser($userid) || hasAccess $userid, $cid, 'st') IS TRUE
```


### pre-req data
```
$pre-Values = { 1885, 
                0,
                1,
                "AutomaticTest",
                "Quiz",
                "2023-04-27 00:00:00",
                "2023-04-28 00:00:00",
                2,
                "1337",
                "2023-04-17",
                "{&quot;deadline1&quot;:&quot;2023-04-27 0:0&quot;,&quot;comment1&quot;:&quot;&quot;,&quot;deadline2&quot;:&quot;&quot;,&quot;comment2&quot;:&quot;&quot;,&quot;deadline3&quot;:&quot;&quot;,&quot;comment3&quot;:&quot;&quot;}", 
                0 }; 

```
```
SQL-query:  INSERT INTO quiz(cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,creator,vers,qstart,jsondeadline,`group`) 
            VALUES ($pre-Values[0], $pre-Values[1], $pre-Values[2], $pre-Values[3], $pre-Values[4], $pre-Values[5], $pre-Values[6], $pre-Values[7], $pre-Values[8], $pre-Values[9], $pre-Values[10] );
```


Get the id for the created quiz. this value is to be saved to variable __$id__, it will be used as ID when we identify and delete the data from the database.
    
    SQL-query: SELECT MAX(id) FROM quiz;      
    

### login Values: 

```
username: 2
password: Kong
```

---
## Add a new variant, send parameters inputs to duggaedservice.php 
---

### send
```
{
    $opt = "ADDVARI";
    $qid = $quizID;
    $userid = 2;
    $disabled = 1;
    $param = "{"type":"md","filelink":"md","gType":"","diagram_File":"Empty canvas","diagram_type":{"ER":true,"UML":false,"IE":false},"extraparam":"","notes":"","submissions":[{"type":"pdf","fieldname":"","instruction":""}],"errorActive":false}";
    $answer = "Bara Text";
}
```

---
## Gather service output
--- 

#### Output    
    {
        LastCourseCreated[]
        entries([        // 2D-array each cell will contain an associative array with the cell names below.
            cid:
            coursename:
            coursecode:
            visibility:
            activeversion:
            activeedversion:
            registered:
        ]);
        versions([       // 2D-array each cell will contain an associative array with the cell names below.
            cid:
            coursecode:
            vers:
            versname:
            coursename:
            coursenamealt:
        ]);
        debug:
        writeaccess:
        motd:
        readonly:
    }

---
## Reset database 
---

remove inserted row from DB, using __$id__ 


    SQL-query: DELETE FROM quiz WHERE quizID = $id 




========================
---
## Update a variant (line 123):
========================
---


---
## Prerequisite
---


### pre-req:
 
```
(checklogin) IS TRUE && 
(hasAccess($userid, $cid, 'w') || isSuperUser($userid) || hasAccess $userid, $cid, 'st') IS TRUE
```

### pre-req data: variables & table entries

Create a quiz then Create a variant with the __same ID__.
```
$preValuesQuiz = {  1885, 
                    0,
                    1,
                    "AutomaticTest",
                    "Quiz",
                    "2023-04-27 00:00:00",
                    "2023-04-28 00:00:00",
                    2,
                    "1337",
                    "2023-04-17",
                    "{&quot;deadline1&quot;:&quot;2023-04-27 0:0&quot;,&quot;comment1&quot;:&quot;&quot;,&quot;deadline2&quot;:&quot;&quot;,&quot;comment2&quot;:&quot;&quot;,&quot;deadline3&quot;:&quot;&quot;,&quot;comment3&quot;:&quot;&quot;}", 
                    0 }; 
```
```
SQL-query:  INSERT INTO quiz(cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,creator,vers,qstart,jsondeadline,`group`) 
            VALUES ($preValuesQuiz[0], $preValuesQuiz[1], $preValuesQuiz[2], $preValuesQuiz[3], $preValuesQuiz[4], $preValuesQuiz[5], $preValuesQuiz[6], $preValuesQuiz[7], $preValuesQuiz[8], $preValuesQuiz[9], $preValuesQuiz[10] );
```
Check the highest quiz ID, the newest addition to the table quiz, this will be the __$quizID__ for the the tables variant (highest id = last added), it will be used as ID when we identify and delete the data from the database.
```
 SQL-query: SELECT MAX(id) FROM quiz;      
```
```
$preValuesVariant = {   $quizID,
                        2,
                        0,
                        '{&quot;type&quot;:&quot;md&quot;,&quot;filelink&quot;:&quot;md&quot;,&quot;gType&quot;:&quot;&quot;,&quot;diagram_File&quot;:&quot;Empty canvas&quot;,&quot;diagram_type&quot;:{&quot;ER&quot;:true,&quot;UML&quot;:false,&quot;IE&quot;:false},&quot;extraparam&quot;:&quot;&quot;,&quot;notes&quot;:&quot;&quot;,&quot;submissions&quot;:[{&quot;type&quot;:&quot;pdf&quot;,&quot;fieldname&quot;:&quot;&quot;,&quot;instruction&quot;:&quot;&quot;}],&quot;errorActive&quot;:false}',
                        "some text" };
```
```
SQL-Query:  INSERT INTO variant(quizID,creator,disabled,param,variantanswer) 
            VALUES (preValuesVariant[0], preValuesVariant[1], preValuesVariant[2], preValuesVariant[3], preValuesVariant[4]);
```

Get the ID of the newly added variant, and save it in __$variantID__

```
SQL-Query: SELECT MAX(quizID) FROM variant;
```

### login Values: 

```
username: 2
password: Kong
```

---
## Update information on an assignment, send parameters inputs to duggaedservice.php 
--- 

### send
```
{
    $opt = "SAVVARI";
    $vid = $variantID;
    $disabled = 1;
    $param = '{"type":"md","filelink":"","gType":"md","gFilelink":"","diagram_File":"","diagram_type":{"ER":true,"UML":false,"IE":false},"extraparam":"","notes":"","submissions":[{"type":"pdf","fieldname":"","instruction":""},{"type":"pdf","fieldname":"","instruction":""}],"errorActive":false}';
    $answer = "new text";  
}
```

---
## Gather service output
--- 

#### Output    
    {
        LastCourseCreated[]
        entries([        // 2D-array each cell will contain an associative array with the cell names below.
            cid:
            coursename:
            coursecode:
            visibility:
            activeversion:
            activeedversion:
            registered:
        ]);
        versions([       // 2D-array each cell will contain an associative array with the cell names below.
            cid:
            coursecode:
            vers:
            versname:
            coursename:
            coursenamealt:
        ]);
        debug:
        writeaccess:
        motd:
        readonly:
    }


---
## Reset database 
---


Remove inserted row from table quiz DB, using __$quizID__. This will delete both table entries (variant and quiz)
```
SQL-query: DELETE FROM quiz WHERE id = $quizID;  
```

===========================================
---
#Delete variant and useranswer? (line 134)
===========================================
---

---
## Prerequisite
---

### pre-req:
 
```
(checklogin) IS TRUE && 
(hasAccess($userid, $cid, 'w') || isSuperUser($userid) || hasAccess $userid, $cid, 'st') IS TRUE
```

### pre-req data: variables & table entries
Needs to make insert into to tables to test the delete-method
Insert in __quiz__ 	
```
$preValuesQuiz = {  1885, 
                    0,
                    1,
                    "AutomaticTest",
                    "Quiz",
                    "2023-04-27 00:00:00",
                    "2023-04-28 00:00:00",
                    2,
                    "1337",
                    "2023-04-17",
                    "{&quot;deadline1&quot;:&quot;2023-04-27 0:0&quot;,&quot;comment1&quot;:&quot;&quot;,&quot;deadline2&quot;:&quot;&quot;,&quot;comment2&quot;:&quot;&quot;,&quot;deadline3&quot;:&quot;&quot;,&quot;comment3&quot;:&quot;&quot;}", 
                    0 }; 
```
```
SQL-query:  INSERT INTO quiz(cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,creator,vers,qstart,jsondeadline,`group`) 
            VALUES ($preValuesQuiz[0], $preValuesQuiz[1], $preValuesQuiz[2], $preValuesQuiz[3], $preValuesQuiz[4], $preValuesQuiz[5], $preValuesQuiz[6], $preValuesQuiz[7], $preValuesQuiz[8], $preValuesQuiz[9], $preValuesQuiz[10] );
```
Get the id for the created quiz, save it in __$id__ 
```
SQL-Query: select MAX(id) from quiz; 
```
insert into __listentries__
```
$preValuesListentries = {   1885, 
                            "Inserttobedeleted",
                            "UNK",
                            4,
                            12,
                            2,
                            1,
                            1337,
                            5019,
                            1,
                            1,
                            0, 
                            "UNK" }; 
```
```
SQL-query:  INSERT INTO listentries(cid,entryname,link,kind,pos,creator,visible,vers,moment,gradesystem,highscoremode,feedbackenabled,feedbackquestion) 
            VALUES ($preValuesQuiz[0], $preValuesQuiz[1], $preValuesQuiz[2], $preValuesQuiz[3], $preValuesQuiz[4], $preValuesQuiz[5], $preValuesQuiz[6], $preValuesQuiz[7], $preValuesQuiz[8], $preValuesQuiz[9], $preValuesQuiz[10],$preValuesQuiz[11],$preValuesQuiz[12]);
```

Get the id for moment the created listentie, save it in __$moment__
```
SQL-query: select MAX(moment) from listentries;     
```

Insert into __variant__
```
$preValuesVariant = {   $id,
                        2,
                        0,
                        '{&quot;type&quot;:&quot;md&quot;,&quot;filelink&quot;:&quot;md&quot;,&quot;gType&quot;:&quot;&quot;,&quot;diagram_File&quot;:&quot;Empty canvas&quot;,&quot;diagram_type&quot;:{&quot;ER&quot;:true,&quot;UML&quot;:false,&quot;IE&quot;:false},&quot;extraparam&quot;:&quot;&quot;,&quot;notes&quot;:&quot;&quot;,&quot;submissions&quot;:[{&quot;type&quot;:&quot;pdf&quot;,&quot;fieldname&quot;:&quot;&quot;,&quot;instruction&quot;:&quot;&quot;}],&quot;errorActive&quot;:false}',
                        "some text" };
```
```
SQL-Query:  INSERT INTO variant(quizID,creator,disabled,param,variantanswer) 
            VALUES (preValuesVariant[0], preValuesVariant[1], preValuesVariant[2], preValuesVariant[3], preValuesVariant[4]);

```
Get the id for the created variant, save it in __$variant__.
```
SQL-query: select MAX(vid) from variant;    
```

Make insert into __userAnswer__.
```
$preValuesuserAnswer = {    1885, 
                            $moment,
                            $id,
                            $variant }; 

```
```
SQL-query:  INSERT INTO userAnswer(cid,moment,quiz,variant) 
            VALUES ($preValuesQuiz[0], $preValuesQuiz[1], $preValuesQuiz[2], $preValuesQuiz[3], $preValuesQuiz[4] );
```

### login Values: 

```
username: 2
password: Kong
```

---
 ## Delete variant, userAnswer, listentries, quiz. Send parameters inputs to duggaedservice.php 
---
### send
```
{
    $opt = "DELVARI";
    $vid = $variant; 
}
```
---
## Gather service output
--- 

#### Output    
    {
        LastCourseCreated[]
        entries([       // 2D-array each cell will contain an associative array with the cell names below.
            cid:
            coursename:
            coursecode:
            visibility:
            activeversion:
            activeedversion:
            registered:
        ]);
        versions([      // 2D-array each cell will contain an associative array with the cell names below.
            cid:
            coursecode:
            vers:
            versname:
            coursename:
            coursenamealt:
        ]);
        debug:
        writeaccess:
        motd:
        readonly:
    }

---
## Reset database 
---

__ALL THE INSERTS WILL HAVE TO BE DELETED.__
That means that if the test failed, then this test needs to go in and delete the inserts we made