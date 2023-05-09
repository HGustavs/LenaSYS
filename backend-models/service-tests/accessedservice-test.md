# accessedservice.php
====================
---
## TEST #1 - 65-68
## Update firstname
===================
---

---
## Prerequisite
---

### pre-req:

```
checkLogin() 
&& 
$hasaccess == true
```


### login Values: 

```
username: 2
password: Kong
```


### pre-values
```
$pre-values = 
{
“testuser1”,
“testpwd”
};

pre-query: 	INSERT INTO user(username, password) VALUES (pre-values[0], pre-values[1]);
```

---
## Get newly added user
---

```
SQL-query: 	SELECT uid FROM user WHERE username= “testuser1”;
//save this value to be used for the send.
```


---
## send parameters inputs to accessedservice.php 
---

### send
```
{
	$opt = ”UPDATE”;
	$prop = “firstname”;
	$val = “test”;
	$uid = VALUE FROM PREVIOUS QUERY;
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
	SQL-query DELETE FROM user WHERE username = “testuser1”;
```
====================
---
## TEST #2 - 68-71
## Update lastname
===================
---

---
## Prerequisite
---

### pre-req:

```
checkLogin() 
&& 
$hasaccess == true
```


### login Values: 

```
username: 2
password: Kong
```


### pre-values
```
$pre-values = 
{
“testuser1”,
“testpwd”
};

pre-query: 	INSERT INTO user(username, password) VALUES (pre-values[0], pre-values[1]);
```

---
## Get newly added user
---

```
SQL-query: 	SELECT uid FROM user WHERE username= “testuser1”;
//save this value to be used for the send.
```


---
## send parameters inputs to accessedservice.php 
---

### send
```
{
	$opt = ”UPDATE”;
	$prop = “lastname”;
	$val = “test”;
	$uid = VALUE FROM PREVIOUS QUERY;
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
	SQL-query DELETE FROM user WHERE username = “testuser1”;
```
====================
---
## TEST #3 - 71-74
## Update ssn
===================
---

---
## Prerequisite
---

### pre-req:

```
checkLogin() 
&& 
$hasaccess == true
```


### login Values: 

```
username: 2
password: Kong
```


### pre-values
```
$pre-values = 
{
“testuser1”,
“testpwd”
};

pre-query: 	INSERT INTO user(username, password) VALUES (pre-values[0], pre-values[1]);
```

---
## Get newly added user
---

```
SQL-query: 	SELECT uid FROM user WHERE username= “testuser1”;
//save this value to be used for the send.
```


---
## send parameters inputs to accessedservice.php 
---

### send
```
{
	$opt = ”UPDATE”;
	$prop = “ssn”;
	$val = “test”;
	$uid = VALUE FROM PREVIOUS QUERY;
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
	SQL-query DELETE FROM user WHERE username = “testuser1”;
```
====================
---
## TEST #4 - 74-77
## Update username
===================
---

---
## Prerequisite
---

### pre-req:

```
checkLogin() 
&& 
$hasaccess == true
```


### login Values: 

```
username: 2
password: Kong
```


### pre-values
```
$pre-values = 
{
“testuser1”,
“testpwd”
};

pre-query: 	INSERT INTO user(username, password) VALUES (pre-values[0], pre-values[1]);
```

---
## Get newly added user
---

```
SQL-query: 	SELECT uid FROM user WHERE username= “testuser1”;
//save this value to be used for the send.
```


---
## send parameters inputs to accessedservice.php 
---

### send
```
{
	$opt = ”UPDATE”;
	$prop = “username”;
	$val = “test”;
	$uid = VALUE FROM PREVIOUS QUERY;
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
	SQL-query DELETE FROM user WHERE username = “testuser1”;
```
====================
---
## TEST #5 - 77-80
## Update class
===================
---

---
## Prerequisite
---

### pre-req:

```
checkLogin() 
&& 
$hasaccess == true
```


### login Values: 

```
username: 2
password: Kong
```


### pre-values
```
$pre-values = 
{
“testuser1”,
“testpwd”
};

pre-query: 	INSERT INTO user(username, password) VALUES (pre-values[0], pre-values[1]);
```

---
## Get newly added user
---

```
SQL-query: 	SELECT uid FROM user WHERE username= “testuser1”;
//save this value to be used for the send.
```


---
## send parameters inputs to accessedservice.php 
---

### send
```
{
	$opt = ”UPDATE”;
	$prop = “class”;
	$val = “test”;
	$uid = VALUE FROM PREVIOUS QUERY;
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
	SQL-query DELETE FROM user WHERE username = “testuser1”;
```

====================
---
## TEST #6 - 83-90
## Update examiner
===================
---

---
## Prerequisite
---

### pre-req:

```
checkLogin() 
&& 
$hasaccess == true
```


### login Values: 

```
username: 2
password: Kong
```


### pre-values1
```
$pre-values1 = 
{
1,
“testtest”
};

pre-query: 	INSERT INTO course(creator, coursecode) VALUES(pre-values1[0], pre-values1[1]);
```

---
## Get newly added course
---

```
SELECT cid FROM course WHERE coursecode = pre-values[1];
//save this value for next query, send and for DELETE at the end of the tes
```
### pre-values2
```
$pre-values2 = 
{
2,
VALUE FROM PREVIOUS QUERY,
“test”
};

pre-query: 	INSERT INTO user_course (uid, cid, access) VALUES (pre-values2[0], pre-values2[1], pre-values2[2]);
```


---
## send parameters inputs to accessedservice.php 
---

### send
```
{
	$opt = ”UPDATE”;
	$prop = “examiner”;
	$val = “test”;
	$uid = 2;
$cid = VALUE FROM PREVIOUS QUERY;
}
```
### val == “None” 
```
send
{
    $opt = ”UPDATE”;
	$prop = “examiner”;
	$val = “None”;
	$uid = 2;
    $cid = VALUE FROM PREVIOUS QUERY;
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
	SQL-query:	DELETE FROM user_course WHERE cid= SAVED VALUE FROM             PREVIOUS QUERY;
SQL-query DELETE FROM course WHERE cid= SAVED VALUE FROM PREVIOUS QUERY;
```
====================
---
## TEST #7 - 83-90
## Update examiner to none
===================
---

---
## Prerequisite
---

### pre-req:

```
checkLogin() 
&& 
$hasaccess == true
```


### login Values: 

```
username: 2
password: Kong
```


### pre-values
```
$pre-values1 = 
{
1,
“testtest”
};

pre-query: 	INSERT INTO course(creator, coursecode) VALUES(pre-values1[0], pre-values1[1]);

SELECT cid FROM course WHERE coursecode = pre-values[1];
//save this value for next query, send and for DELETE at the end of the test.

$pre-values2 = 
{
2,
VALUE FROM PREVIOUS QUERY,
“test”
};

pre-query: 	INSERT INTO user_course (uid, cid, access) VALUES (pre-values2[0], pre-values2[1], pre-values2[2]);
```
---
## send parameters inputs to accessedservice.php 
---

### send
```
{
$opt = ”UPDATE”;
	$prop = “examiner”;
	$val = “None”;
	$uid = 2;
$cid = VALUE FROM PREVIOUS QUERY;
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
	SQL-query:	DELETE FROM user_course WHERE cid= SAVED VALUE FROM             PREVIOUS QUERY;
SQL-query DELETE FROM course WHERE cid= SAVED VALUE FROM PREVIOUS QUERY;
```
====================
---
## TEST #8 - 90-93
## Update version
===================
---

---
## Prerequisite
---

### pre-req:

```
checkLogin() 
&& 
$hasaccess == true
```


### login Values: 

```
username: 2
password: Kong
```


### pre-values
```
$pre-values1 = 
{
1,
“testtest”
};

pre-query: 	INSERT INTO course(creator, coursecode) VALUES(pre-values1[0], pre-values1[1]);
```
---
## Get newly added course
---

```
SELECT cid FROM course WHERE coursecode = pre-values[1];
//save this value for next query, send and for DELETE at the end of the test.

$pre-values2 = 
{
2,
VALUE FROM PREVIOUS QUERY,
“test”
};

pre-query: 	INSERT INTO user_course (uid, cid, access) VALUES (pre-values2[0], pre-values2[1], pre-values2[2]);
```

---
## send parameters inputs to accessedservice.php 
---

### send
```
{
$opt = ”UPDATE”;
	$prop = “vers”;
	$val = “test”;
	$uid = 2;
$cid = VALUE FROM PREVIOUS QUERY;
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
	SQL-query:	DELETE FROM user_course WHERE cid= SAVED VALUE FROM             PREVIOUS QUERY;
SQL-query DELETE FROM course WHERE cid= SAVED VALUE FROM PREVIOUS QUERY;
```

====================
---
## TEST #9 - 93-96
## Update access
===================
---

---
## Prerequisite
---

### pre-req:

```
checkLogin() 
&& 
$hasaccess == true
```


### login Values: 

```
username: 2
password: Kong
```


### pre-values
```
$pre-values1 = 
{
1,
“testtest”
};

pre-query: 	INSERT INTO course(creator, coursecode) VALUES(pre-values1[0], pre-values1[1]);
```
---
## Get newly added course
---

```
SELECT cid FROM course WHERE coursecode = pre-values[1];
//save this value for next query, send and for DELETE at the end of the test.

$pre-values2 = 
{
2,
VALUE FROM PREVIOUS QUERY,
“test”
};

pre-query: 	INSERT INTO user_course (uid, cid, access) VALUES (pre-values2[0], pre-values2[1], pre-values2[2]);
```

---
## send parameters inputs to accessedservice.php 
---

### send
```
{
$opt = ”UPDATE”;
	$prop = “access”;
	$val = “test”;
	$uid = 2;
$cid = VALUE FROM PREVIOUS QUERY;
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
	SQL-query:	DELETE FROM user_course WHERE cid= SAVED VALUE FROM             PREVIOUS QUERY;
SQL-query DELETE FROM course WHERE cid= SAVED VALUE FROM PREVIOUS QUERY;
```
====================
---
## TEST #10 - 96-99
## Update group
===================
---

---
## Prerequisite
---

### pre-req:

```
checkLogin() 
&& 
$hasaccess == true
```


### login Values: 

```
username: 2
password: Kong
```


### pre-values
```
$pre-values1 = 
{
1,
“testtest”
};

pre-query: 	INSERT INTO course(creator, coursecode) VALUES(pre-values1[0], pre-values1[1]);
```
---
## Get newly added course
---

```
SELECT cid FROM course WHERE coursecode = pre-values[1];
//save this value for next query, send and for DELETE at the end of the test.

$pre-values2 = 
{
2,
VALUE FROM PREVIOUS QUERY,
“test”
};

pre-query: 	INSERT INTO user_course (uid, cid, access) VALUES (pre-values2[0], pre-values2[1], pre-values2[2]);
```

---
## send parameters inputs to accessedservice.php 
---

### send
```
send
{
$opt = ”UPDATE”;
	$prop = “group”;
	$val = “test”;
	$uid = 2;
$cid = VALUE FROM PREVIOUS QUERY;
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
	SQL-query:	DELETE FROM user_course WHERE cid= SAVED VALUE FROM             PREVIOUS QUERY;
SQL-query DELETE FROM course WHERE cid= SAVED VALUE FROM PREVIOUS QUERY;
```

====================
---
## TEST #11 - 114-143
## Add class
===================
---

---
## Prerequisite
---

### pre-req:

```
checkLogin() 
&& 
$hasaccess == true
```


### login Values: 

```
username: 2
password: Kong
```


---
## send parameters inputs to accessedservice.php 
---

### send
```
send
{
$opt = “ADDCLASS”;
	$class = “testClass”;
	$responsible = 2;
	$classname = “testClassName”;
	$regcode = 12345678;
	$classcode = “87654321”;
	$hp = 7.5;
	$tempo = 100;
	$hpProgress = 1.5;
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
SQL-query:	DELETE FROM class WHERE class = “testClass”
```
====================
---
## TEST #12 - 143-154
## Change password
===================
---

---
## Prerequisite
---

### pre-req:

```
checkLogin() 
&& 
$hasaccess == true
```


### login Values: 

```
username: 2
password: Kong
```


### pre-values
```
$pre-values = 
{
“testuser1”,
“testpwd”
};

pre-query: 	INSERT INTO user(username, password) VALUES (pre-values[0], pre-values[1]);
```
---
## Get newly added user
---

```
SQL-query: 	SELECT uid FROM user WHERE username= “testuser1”;
//save this value to be used for the send.
```

---
## send parameters inputs to accessedservice.php 
---

### send
```
{
	$opt = “CHPWD”;
	$uid = VALUE FROM PREVIOUS QUERY;
	$pwd = “123123”;
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
	SQL-query: 	DELETE FROM user WHERE username = “testuser1”;
```
====================
---
## TEST #13 - 154-255
## Add user
===================
---

---
## Prerequisite
---

### pre-req:

```
Pre-req: checkLogin() 
&& 
$hasaccess == true
&&
count($user) > 1
&&
$user[0]!=”PNR”
```


### login Values: 

```
username: 2
password: Kong
```


### pre-values
```
$pre-values =
{
	“testClass”,
	2,
	“testClassName”,
	12345678,
	“87654321”,
	7.5,
	100,
	1.5
};

pre-query: INSERT INTO class(class, responsible, classname, regcode, classcode, hp, tempo, hpProgress) VALUES (pre-values[0], pre-values[1], pre-values[2], pre-values[3], pre-values[4], pre-values[5], pre-values[6], pre-values[7])
```
---
## send parameters inputs to accessedservice.php 
---

### send
```
{
	$opt = “ADDUSR”;
	$username = “testuser”;
	$saveemail = “testmail”;
	$firstname = “testfirstname”;
	$lastname = “testlastname”;
	$ssn = “testssn”;
	$rnd = “testpassword”;
	$className = “testClassName”;
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
	SQL-query:	DELETE FROM user WHERE username = “testuser”;
		DELETE FROM class WHERE class = “testClass”;
```

====================
---
## TEST #14 - 154-255
## Add user where no class exists
===================
---

---
## Prerequisite
---

### pre-req:

```
checkLogin() 
&& 
$hasaccess == true
&&
count($user) > 1
&&
rowCount() === 0
```


### login Values: 

```
username: 2
password: Kong
```


---
## send parameters inputs to accessedservice.php 
---

### send
```
{
	$opt = “ADDUSR”;
	$cstmt = 0;
	$className = “testClass”;
	$username = “testuser”;
	$saveemail = “testmail”;
	$firstname = “testfirstname”;
	$lastname = “testlastname”;
	$ssn = “testssn”;
	$rnd = “testpassword”;
	$className = “testClassName”;
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
	SQL-query: 	DELETE FROM user WHERE username = “testuser”;
			DELETE FROM class WHERE class = “testClass”;
```
====================
---
## TEST #15 - 258-278
## Connect user to user_course
===================
---

---
## Prerequisite
---

### pre-req:

```
checkLogin() 
&& 
$hasaccess == true
&&
$uid!="UNK"
&&
$regstatus == ”Registrerad” || $regstatus == “UNK”
```


### login Values: 

```
username: 2
password: Kong
```


### pre-values
```
$pre-values1 = 
{
1,
“testtest”
};

pre-query: 	INSERT INTO course(creator, coursecode) VALUES(pre-values1[0], pre-values1[1]);

```
---
## Get newly added course
---

```
SELECT cid FROM course WHERE coursecode = pre-values[1];
//save this value for send and for DELETE at the end of the test.
```

---
## send parameters inputs to accessedservice.php 
---

### send
```
{
	$opt = “ADDUSR”;
	$regstatus = “UNK”;
	$uid = 2;
	$cid = VALUE FROM PREVIOUS QUERY;
	$coursevers = “testvers”;
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
	SQL-query:	DELETE FROM user_course WHERE cid = VALUE FROM PREVIOUS QUERY;
DELETE FROM course WHERE cid= VALUE FROM PREVIOUS QUERY;
```
