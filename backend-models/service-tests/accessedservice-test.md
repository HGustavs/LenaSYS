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
### Remove inserted row from DB, using username
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
	$opt = ”UPDATE”
	$prop = “lastname”
	$val = “test”
	$uid = VALUE FROM PREVIOUS QUERY
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
### Remove inserted row from DB, using username
---
```
	SQL-query DELETE FROM user WHERE username = “testuser1”;
```
===================
