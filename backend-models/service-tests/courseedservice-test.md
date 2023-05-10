# courseedservice.php
=====================
---
## Test 1 - 79
## Insert into course
=====================
---

---
## Prerequisite
---

## pre-req:

```
checklogin() 
&&
$ha == TRUE

```

---
## Send parameters input to courseedservice.php
---

### Send

```
{
    $opt = "NEW";
    $userid = 1;
    $coursecode = "G1338";
    $coursename = "Testing-Course";
    $courseGitURL = "TestGitURL";
}

```

---
## Gather service output
---

### Output

```
    LastCourseCreated:
    entries:
    versions:
    debug:
    writeaccess:

```

---
### Remove inserted row from DB
---

```
SQL-query: DELETE FROM course WHERE coursecode = "G1338";

```

==============
---
## Test 2 - 116
## Insert into vers
==============
---

## Prerequisite
---

## pre-req:

```
checklogin() 
&&
$ha == TRUE

```
### pre-values

```
$preValuesCourse = 
{
    9999,
    1
}

INSERT INTO course($cid, creator) VALUES ($preValuesCourse[0], $preValuesCourse[1]);
// add a course so we know it exits in the database before adding the vers

```


## Send parameters input to courseedservice.php
---

### Send

```
{
    $opt = "NEWVRS";
    $cid = 9999;
    $coursecode = "G1338";
    $versid = 1338;
    $versname = "HT15";
    $coursename = "Testing-course";
    $coursenamealt = "Course for testing codeviewer";
    $motd = "Code examples shows both templateid and boxid!";
    $startdate = "2020-05-01 00:00:00";
    $enddate = "2020-06-30 00:00:00";
}

```

---
## Gather service output
---

### Output

```
    entries:
    versions:
    debug:
    writeaccess:
    motd:

```

---
### Remove inserted row from DB
---

```
SQL-query: 
DELETE FROM vers WHERE cid = 9999;
DELETE FROM course WHERE cid = 9999;

```

==============
---
## Test 3 - 138
## Update course
==============
---

## Prerequisite
---

## pre-req:

```
checklogin() 
&&
$ha == TRUE

```
### pre-values

```
$preValuesCourse = 
{
    9999,
    1
}

INSERT INTO course($cid, creator) VALUES ($preValuesCourse[0], $preValuesCourse[1]);
// add a course so we know it exits in the database before adding its vers.

```

## Send parameters input to courseedservice.php
---

### Send

```
{
    $cid = 9999;
    $versid = 1337;
}

```

---
## Gather service output
---

### Output

```
    entries:
    versions:
    debug:
    writeaccess:

```

---
### Remove inserted row from DB
---

```
SQL-query: 
DELETE FROM course WHERE cid = 9999;

```

==============
---
## Test 4 - 152
## Update vers
==============
---

## Prerequisite
---

## pre-req:

```
checklogin() 
&&
$ha == TRUE

```
### pre-values

```
$preValuesCourse = 
{
    9999,
    1
}

INSERT INTO course($cid, creator) VALUES ($preValuesCourse[0], $preValuesCourse[1]);
// make sure there is an active course with set cid.

```

```
$preValuesVers = 
{
    9999,
    12345678,
    "testVersName",
    "testCourseName",
    "testCourseNameAlt"
}

INSERT INTO vers(cid, vers, versname, coursecode, coursename, coursenamealt, startdate, enddate, motd) VALUES ($preValuesVers[0], $preValuesVers[1], $preValuesVers[2], $preValuesVers[3], $preValuesVers[4], $preValuesVers[5]);
// make sure we have a vers that we can test the update on.

```

## Send parameters input to courseedservice.php
---

### Send

```
{
    $opt = "UPDATEVRS";
    $courseid = 9999;
    $coursecode = "testCourseCode";
    $versid = 12345678;
    $versname = "updateTest";
}

```

---
## Gather service output
---

### Output

```
    entries:
    versions:
    debug:
    writeaccess:

```

---
### Remove inserted row from DB
---

```
SQL-query: 
DELETE FROM vers WHERE cid = 9999;
DELETE FROM course WHERE cid = 9999;

```

==============
---
## Test 5 - 173
## Update course
==============
---

## Prerequisite
---

## pre-req:

```
checklogin() 
&&
$ha == TRUE

```
### pre-values

```
$preValuesCourse = 
{
    9999,
    1
}

INSERT INTO course($cid, creator) VALUES ($preValuesCourse[0], $preValuesCourse[1]);
// make sure there is an active course with set cid.

```

## Send parameters input to courseedservice.php
---

### Send

```
{
    $opt = "CHGVERS";
    $cid = 9999;
    $versid = 1337;
}

```

---
## Gather service output
---

### Output

```
    entries:
    versions:
    debug:
    writeaccess:

```

---
### Remove inserted row from DB
---

```
SQL-query: 
DELETE FROM course WHERE cid = 9999;

```

==============
---
## Test 6 - 181
## INSERT INTO VERS
==============
---

NOTE: Unclear about this test since it wants to copy a course, however inserting the same row twice makes it an error hence, the "send" has a different value for versid.


## Prerequisite
---

## pre-req:

```
checklogin() 
&&
$ha == TRUE

```
### pre-values

```
$preValuesCourse =
{
    9999,
    1
}

INSERT INTO course(cid, creator) VALUES ($preValuesCourse[0], $preValuesCourse[1]);
// make sure there is an active course with set cid.

```

```
$preValuesVers = 
{
    9999,
    12345678,
    "testVersName",
    "testCourseCode",
    "testCourseName",
    "testCourseNameAlt",
    "2020-05-01 00:00:00",
    "2020-06-30 00:00:00",
    "testMotd"
}

INSERT INTO vers(cid, vers, versname, coursecode, coursename, coursenamealt, startdate, enddate, motd) VALUES ($preValuesVers[0], $preValuesVers[1], $preValuesVers[2], $preValuesVers[3], $preValuesVers[4], $preValuesVers[5], $preValuesVers[6], $preValuesVers[7], $preValuesVers[8]);
// make sure we have a vers.

```

## Send parameters input to courseedservice.php
---

### Send

```
{
    $opt = "CPYVRS";
    $cid = 9999;
    $coursecode = "testCourseCode";
    $versid = 12345679;
    $versname = "testVersName";
    $coursename = "testCourseName";
    $coursenamealt = "testCourseNameAlt";
    $motd = "testMotd";
    $startdate = "2020-05-01 00:00:00";
    $enddate = "2020-06-30 00:00:00";
    
}

```

---
## Gather service output
---

### Output

```
    entries:
    versions:
    debug:
    writeaccess:
    motd:

```

---
### Remove inserted row from DB
---

```
SQL-query: 
DELETE FROM vers WHERE cid = 9999;
DELETE FROM course WHERE cid = 9999;

```

==============
---
## Test 7 - 433
## Update course
==============
---

## Prerequisite
---

## pre-req:

```
checklogin() 
&&
$ha == TRUE

```
### pre-values

```
$preValuesCourse = 
{
    9999,
    1
}

INSERT INTO course($cid, creator) VALUES ($preValuesCourse[0], $preValuesCourse[1]);
// make sure there is an active course with set cid.

```

## Send parameters input to courseedservice.php
---

### Send

```
{
    $cid = 9999;
    $versid = 1337;
}

```

---
## Gather service output
---

### Output

```
    entries:
    versions:
    debug:
    writeaccess:

```

---
### Remove inserted row from DB
---

```
SQL-query: 
DELETE FROM course WHERE cid = 9999;

```

==============
---
## Test 8 - 456
## Update course
==============
---

## Prerequisite
---

## pre-req:

```
checklogin() 
&&
$ha == TRUE

```
### pre-values

```
$preValuesCourse = 
{
    9999,
    1
}

INSERT INTO course($cid, creator) VALUES ($preValuesCourse[0], $preValuesCourse[1]);
// make sure there is an active course with set cid.

```

## Send parameters input to courseedservice.php
---

### Send
```
{
    $opt = "UPDATE";
    $cid = 9999;
    $coursename = "Testing-Course";
    $visibility = 1;
    $coursecode = "G9999";
    $courseGitURL = NULL;
}

```

---
## Gather service output
---

### Output

```
    entries:
    versions:
    debug:
    writeaccess:

```

---
### Remove inserted row from DB
---

```
SQL-query: 
DELETE FROM course WHERE cid = 9999;

```

==============
---
## Test 9 - 488
## Insert setting
==============
---

## Prerequisite
---

## pre-req:

```
checklogin() 
&&
$ha == TRUE

```

## Send parameters input to courseedservice.php
---

### Send

```
{
    $opt = "SETTINGS";
    $motd = "Test";
    $readonly = 0;
}

```

---
## Gather service output
---

### Output

```
    debug:
    writeaccess:
    motd:
    readonly:

```

---
### Remove inserted row from DB
---

```
SQL-query: 
DELETE FROM settings ORDER BY sid DESC LIMIT 1;

```