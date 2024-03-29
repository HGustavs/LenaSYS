
# Fileedservice.php
====================
---
## Test to deleting a file (line 58):
===================
---

---
## Prerequisite
---

### pre-req:
 
```
(checklogin() && $hasAccess) { IS &&
(strcmp($opt, "DELFILE") === 0 && (hasAccess($userid, $cid, 'w') || isSuperUser($userid))) IS TRUE
```

---
## send parameters inputs to fileedservice.php 
---

### send
```
{
    $cid = 1234;
    $opt = "DELFILE";
    $coursevers = "test";
    $filename = "test.txt";
    $kind = 1;
    $fid = 1;
    $contents = "";
} 
```

---
## Call the file deletion function: 
---

```
$result = delete_file($cid, $opt, $coursevers, $fid, $filename, $kind, $contents);
```

---
## Verify that the file has been deleted: 
---

```
if ($result === true) {
    echo "File deleted successfully.";
} else {
    echo "Error deleting file: " . $result;
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
        "entries":[],
        "debug":"NONE!",
        "gfiles":[],
        "lfiles":[],
        "access":false,
        "studentteacher":false,
        "superuser":true,
        "waccess":false,
        "supervisor":false
    }
```

====================
---
## Test to saving a file (line 144):
===================
---

---
## Prerequisite
---

### pre-req:
 
```
Pre-req: 
checklogin()
&&
$hasAccess
```

---
## pre-valuescourse:
---

```
{
    1,
    "testcoursecode"    
}
```

---
## pre-query:
---

```
INSERT INTO course(creator, coursecode) VALUES (pre-valuescourse[0], pre-valuescourse[1]);
```

---
## pre-query:
---

```
SELECT cid FROM course WHERE coursecode = "testcoursecode";
```
//save value from cid from previous query

---
## pre-valuesfilelink:
---

```
{
    "testfilename",
    VALUE FROM PREVIOUS QUERY,
    THIS CAN HAVE VALUE 2/3/4 DEPENDING ON TEST,
    "testvers"   
}
```

---
## pre-query:
---

```
INSERT INTO fileLink(filename, cid, kind, vers) VALUES(pre-valuesfilelink[0], pre-valuesfilelink[1], pre-valuesfilelink[2], pre-valuesfilelink[3]);
```

---
## send parameters inputs to fileedservice.php 
---

### send
```
{
    $opt = ”SAVEFILE”;
    $filename = “testfilename”;
    $filesize = “test”;
    $kindid = 2/3/4 DEPENDING ON TEST;
    $vers = "testvers";
    $cid = VALUE FROM PREVIOUS QUERY
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
        "entries":[],
        "debug":"NONE!",
        "gfiles":[],
        "lfiles":[],
        "access":false,
        "studentteacher":false,
        "superuser":true,
        "waccess":false,
        "supervisor":false
    }
```

---
## Remove inserted row from DB, using username
---

---
## SQL-query:
---

```
DELETE FROM fileLink ORDER BY fileid DESC LIMIT 1;
DELETE FROM course  WHERE cid = SAVED VALUE FROM QUERY;
```

=============================
---
## Test retrieving a file path (line 218):
=============================
---

---
## Prerequisite
---

### pre-req:
```
(checklogin() && $hasAccess) { IS TRUE
```

---
## Set up testdata:
---

```
$fid = 1;
$expectedPath = "/path/to/file";
```

---
## Query the database:
---

```
$query = $pdo->prepare("SELECT path from fileLink WHERE fileid = :fid");
$query->bindParam(':fid', $fid);
$result = $query->execute();
if($row = $query->fetch(PDO::FETCH_ASSOC)){
    $actualPath = $row['path'];
}
```

---
## Check that the actual path is equal to the expected path:
---

```
$this->assertEquals($expectedPath, $actualPath);
```

---
## Sent input:
---

```
If successful: no output should be displayed.
If failed: An error message should pop up.
```

=============================
---
## Test logging service events (line 17):
=============================
---

---
## Prerequisite
---

## pre-req values:
---

```
$log_uuid = "123";
$user_id = "1";
$script_name = "fileedservice.php";
$event_type = EventTypes::ServiceServerStart;
$info = "DELFILE 123 2023-00-00 1 test.txt 2";
```
---
## Call logServiceEvent to log the service start event:
---

```
logServiceEvent($log_uuid, $event_type, $script_name, $user_id, $info);
```

---
## Check if the log message was written correctly:
---

```
$expected_log = "[$log_uuid] [ServiceServerStart] [fileedservice.php] [1] DELFILE 123 2023-00-00 1 test.txt 2";
$logged_message = file_get_contents("path/to/log/test.txt");
assert($expected_log == $logged_message, "Failed.");
```

---
## Service output:
---

## Gather service output
--- 

#### Output
```
    {
        "entries":[],
        "debug":"NONE!",
        "gfiles":[],
        "lfiles":[],
        "access":false,
        "studentteacher":false,
        "superuser":true,
        "waccess":false,
        "supervisor":false
    }
```