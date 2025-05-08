### Background 
All service files that retrieve data from the database should be turned into microservices. It is only the service files in DuggaSys that should be divided into microservices. All service files in DuggaSys fetch data from the database (MYSQL) and are then called by dugga.js for the LenaSys interface, which displays all the information retrieved through these service files. The idea is that all the service files will be replaced with microservices that will perform exactly the same job as those service files, except that microservices are a better solution than large files with many functions.

_sessions.php_ and _basic.php_ should not become microservices because they are neither located in the DuggaSys folder nor function as services in the same way. If, by any chance any of these files make requests to the database (MYSQL), that function could be turned into a microservice, but that is not the intention. _sessions.php_ and _basic.php_ primarily perform logging operations to _log.db_ (SQLite). Therefore, the focus should be on the service files located in DuggaSys. With that said, it does not mean that functions frequently used in `sessions.php` and `basics.php` cannot be converted into microservices.

Based on this information, research has been conducted on functions that are often called from `sessions.php` and `basic.php` and that could potentially be converted into microservices.

---
# Research
---

### logUserEvent

Regarding __logUserEvent__, this function is found in basic.php. It appears to be designed to log various important user events in a local SQLite database (loglena6.db). The focus seems to be on monitoring what the user does within the system. Whether the goal is security, debugging, or user analysis, cannot be determined.

```php
function logUserEvent($uid, $username, $eventType, $description) {
    $query = $GLOBALS['log_db']->prepare('INSERT INTO userLogEntries (uid, username, eventType, description, userAgent, remoteAddress) VALUES (:uid, :username, :eventType, :description, :userAgent, :remoteAddress)');
    $query->bindParam(':uid', $uid);
    $query->bindParam(':username', $username);
    $query->bindParam(':eventType', $eventType);
    $query->bindParam(':description', $description);
    $query->bindParam(':userAgent', $_SERVER['HTTP_USER_AGENT']);
    $query->bindParam(':remoteAddress', $_SERVER['REMOTE_ADDR']);
    $query->execute();
}
```

When a user performs an action in the system, the user ID (uid), username (username), type of event (eventType, represented as an integer), and description of the event (description) are logged. The $_SERVER array contains HTTP_USER_AGENT, which provides information about the user's browser and operating system. This is bound and logged under 'userAgent'. $_SERVER also contains REMOTE_ADDR, which holds information about the IP address from which the user's request originated, used to track where the user is connecting from. This is bound and logged under 'remoteAddress'. 

This information is then logged as a new row in the 'userLogEntries' table in the loglena6.db. 

$_SERVER is a predefined superglobal and is therefore not defined anywhere. PHP automatically creates and fills $_SERVER with information at each HTTP request.

__Conclusion:__ 
Based on this information and the fact that the development of microservices is intended to focus on the service files and functions that make requests against the database (MYSQL), this function does not seem like a priority to be converted into a microservice at this stage. The function performs logging operations against a local database (SQLite). On the other hand, since the function is used regularly (it is ___currently__ called 39 times in 20 different files) i.e as soon as the user does something in the system, the function is __necessary__ but not with the purpose of creating microservices at this stage. Basic.php should not be a priority at this time but probably later on when all planned microservices are developed and functioning.

<br>

### logServiceEvent

Regarding __logServiceEvent__, this function is also found in basic.php. This function appears to be designed to log information about various system events in a local SQLite database (loglena6.db). The difference between __logUserEvent__ and __logServiceEvent__ is that __logUserEvent__ focuses on logging user activities within the system, whereas __logServiceEvent__ handles more detailed and technical logging of events in the system. In other words, __logServiceEvent__ logs exactly WHAT happened in the system, while __logUserEvent__ logs WHO and (more generally) what was done in the system. Whether the goal is security, debugging, or user analysis, cannot be determined.

```php
function logServiceEvent($uuid, $eventType, $service, $userid, $info, $timestamp = null) {
	if (is_null($timestamp)) {
		$timestamp = round(microtime(true) * 1000);
	}
	$query = $GLOBALS['log_db']->prepare('INSERT INTO serviceLogEntries (uuid, eventType, service, timestamp, userAgent, 
        operatingSystem, browser, userid, info, referer, IP) VALUES (:uuid, :eventType, :service, :timestamp, :userAgent, 
        :operatingSystem, :browser, :userid, :info, :referer, :IP)');
	$query->bindParam(':uuid', $uuid);
	$query->bindParam(':eventType', $eventType);
	$query->bindParam(':service', $service);
	$query->bindParam(':timestamp', $timestamp);
	$query->bindParam(':userid', $userid);
	$query->bindParam(':info', $info);
	$referer="";

	if(isset($_SERVER['HTTP_REFERER'])){
			$referer.=$_SERVER['HTTP_REFERER'];
	}

	$IP="";
	if(isset($_SERVER['REMOTE_ADDR'])){
			$IP.=$_SERVER['REMOTE_ADDR'];
	}
	if(isset($_SERVER['HTTP_CLIENT_IP'])){
			$IP.=" ".$_SERVER['HTTP_CLIENT_IP'];
	}
	if(isset($_SERVER['HTTP_X_FORWARDED_FOR'])){
			$IP.=" ".$_SERVER['HTTP_X_FORWARDED_FOR'];
	}

	$query->bindParam(':referer', $referer);
	$query->bindParam(':IP', $IP);
	$query->bindParam(':userAgent', $_SERVER['HTTP_USER_AGENT']);
	$currentOS = getOS();
	$query->bindParam(':operatingSystem', $currentOS);
	$currentBrowser = getBrowser();
	$query->bindParam(':browser', $currentBrowser);
	$query->execute();
}
```

When a system event occurs, specific pieces of information are logged: a unique identifier for the event (uuid), the type of event (eventType), the service involved (service), the exact time of the event (timestamp), data about both the browser and the operating system used (userAgent), the operating system the user uses (operatingSystem), the user's browser (browser), the user ID (userid), additional information about the event (info), the URL the user came from before reaching the current service (referer), and the IP address from which the user's request originated. If the timestamp is not provided, it is automatically generated based on the current time in milliseconds, as indicated by the if-statement above the request.

The '$_SERVER' array is used to collect metadata about the request environment. Note that $_SERVER is a predefined superglobal and is therefore not defined anywhere. PHP automatically creates and fills $_SERVER with information at each HTTP request.


The value potentially stored under 'referer' is captured by this if-statement:
 
                    if(isset($_SERVER['HTTP_REFERER'])){
			    $referer.=$_SERVER['HTTP_REFERER'];
	            }
                    
The value potentially stored under 'IP' is captured by this if-statement __if the user is using a directly accessible IP address (no proxy servers involved)__:

                   $IP="";
	           if(isset($_SERVER['REMOTE_ADDR'])){
			   $IP.=$_SERVER['REMOTE_ADDR'];
	           }
	           
The value potentially stored under 'IP' is captured by this if-statement __if the user is coming from a network with a proxy__:

                   if(isset($_SERVER['HTTP_CLIENT_IP'])){
			   $IP.=" ".$_SERVER['HTTP_CLIENT_IP'];
	           } 
                   
The value potentially stored under 'IP' is captured by this if-statement __if the user is coming from a network with multiple proxy servers__:
     
                   if(isset($_SERVER['HTTP_X_FORWARDED_FOR'])){
			  $IP.=" ".$_SERVER['HTTP_X_FORWARDED_FOR'];
	           } 

The information logged under 'userAgent' is the raw string from `$_SERVER['HTTP_USER_AGENT']`. This string contains data about both the browser and the operating system. The information logged under 'operatingSystem' is extracted from the userAgent string using the `getOS()` function, which is designed to extract only information about the operating system the user is using. The information logged under 'browser' is also extracted from the userAgent string, but through the `getBrowser()` function, designed to extract only information about the user's browser.

This information is then logged as a new row in the 'userLogEntries' table in the loglena6.db through the SQL statement.

__Conclusion:__
Based on this information, and considering that the development of microservices is intended to focus on the service files and functions that make requests against the database (MYSQL), this function does not appear to be a priority for conversion into a microservice at this stage. The function performs logging operations against a local database (SQLite). On the other hand, since the function is used regularly (it is currently called 47 times in 15 different files), i.e as soon as something happens in the system, it is __necessary__ but not with the purpose of creating microservices at this stage. Basic.php should not be a priority at this time but probably later on when all planned microservices are developed and functioning.

<br>

### isSuperUser

Regarding __isSuperUser__, this function is found in sessions.php. This function appears to be designed to check if a specific user is a superuser in the system. SuperUser seems to be synonymous with administrators, who have more rights than regular users. I cannot specify exactly what those rights are, but they appear to include performing various types of settings/operations in the system and accessing all user data.

```php
function isSuperUser($userId)
{
        global $pdo;

        if($pdo == null) {
                pdoConnect();
        }

        $query = $pdo->prepare('SELECT count(uid) AS count FROM user WHERE uid=:1 AND superuser=1');
        $query->bindParam(':1', $userId);
        $query->execute();
        $result = $query->fetch();

        if ($result["count"]==1) {
                return true;
        }else{
                return false;
        }
}
```

The function begins by checking if the global database object ($pdo) is instantiated. If not, it calls the 'pdoConnect()' function to establish a database connection. This ensures that the function has a working connection to the database before any database operations are performed.

The function then uses the $pdo object to prepare an SQL query that counts the rows from the __user__ table where 'uid' matches the specified (i.e. 1) and the 'superuser' column is set to 1. The query is intended to count the number of rows that meet both of these criteria, which indicates whether the user is indeed a superuser or not.

The user ID received as a parameter ($userId) is bound to the SQL query using the 'bindParam' method, and the SQL query is then executed.

After the query has been executed, the function uses 'fetch' to retrieve the result of the SQL query. The result is returned as an array with the key 'count' (AS count), which contains the number of rows that match the criteria. If the value of 'count' is equal to 1, it means that exactly one row has been found, confirming that the user is a superuser. The function then returns true. If the value of 'count' is not 1, which means no rows were found, the function returns false.

__Database Connection:__
'isSuperUser' connects to a MYSQL database, not a local SQLite database (unlike 'logUserEvent' and 'logServiceEvent' which perform logging through a local SQLite database (loglena6)). The difference is that MYSQL is a server-based database system. It runs as a separate server process and can handle database access for multiple clients simultaneously over a network. SQLite, on the other hand, is embedded within the application that uses it. It stores the entire database as a single file and requires no separate server process. Since loglena6 is used solely to perform logging operations (INSERT), no queries are made that require a response from the database. This is an important point for the summary.

The 'pdoConnect()' function, which is called in the 'isSuperUser' function, is found in 'database.php':

```php
function pdoConnect()
{
	global $pdo;
	try {
		$pdo = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8',DB_USER,DB_PASSWORD);
		if(!defined("MYSQL_VERSION")) {
			define("MYSQL_VERSION",$pdo->query('select version()')->fetchColumn());
		}
	} catch (PDOException $e) {
		echo "Failed to get DB handle: " . $e->getMessage() . "</br>";
		exit;
	}
}
?>
```

__Conclusion:__
Considering that the development of microservices is intended to focus on the service files and functions that make requests against the database (MYSQL), this function actually meets that requirement. Additionally, the 'isSuperUser' function appears to be used everywhere where the creation of new material, deletion of material, or updates to material occur. It is currently called 87 times in 59 different files. It is, therefore, a very frequently used function. The function is necessary. Therefore, the function meets the desires/requirements for which functions should be converted into a microservice, but whether it is in this iteration of the course is another question. Converting 'sessions.php' should not be a priority at this time but maybe later on. This function should definitely become a microservice at a later stage when all planned microservices are developed and functioning.

<br>

### hasAcess

The function __hasAcces__ is found in 'sessions.php'. It checks if a user has the appropriate permissions to access and interact with course materials for a specific course. 

```php
function hasAccess($userId, $courseId, $access_type)
{
     $access = getAccessType($userId, $courseId);

    if($access_type === 'w') {
	    return strtolower($access) == 'w';
    } else if ($access_type === 'r') {
            return strtolower($access) == 'r' || strtolower($access) == 'w' || strtolower($access) == 'st';
    } else if ($access_type === 'st') {
            return strtolower($access) == 'st';
    }else if ($access_type === 'sv') {
            return strtolower($access) == 'sv';
    } else {
	    return false;
   }
}
```

__How the function works:__
The function takes three parameters: the user's ID ('userId'), the course ID ('courseId'), and the string that represents the desired access type ('access_type'), with 'r' for read access, 'w' for write access, 'st' for student access, and 'sv' for supervisory access (supervisor).

The function then calls 'getAccessType' (also found in sessions.php) with 'userId' and 'courseId' as arguments to retrieve the current access type that the user has for that course. 'getAccessType' then performs a query against the database (MYSQL) to fetch the permissions associated with the user for the specific course.

__getAcessType:__

```php
function getAccessType($userId, $courseId)
{
        global $pdo;

        if($pdo == null) {
            pdoConnect();
        }

        $query = $pdo->prepare('SELECT access FROM user_course WHERE uid=:uid AND cid=:cid LIMIT 1');
        $query->bindParam(':uid', $userId);
        $query->bindParam(':cid', $courseId);
        $query->execute();

        // Fetch data from the database
        if($query->rowCount() > 0) {
            $access = $query->fetch(PDO::FETCH_ASSOC);
            return strtolower($access['access']);
        }else{
            return false;
        }
}

?>
```

When 'getAccessType' returns the user's access type, the result of the query is stored in the variable '$access'. 'hasAccess' then compares this result with the requested access type ('access_type'). If the value for 'access_type' is 'w' (write permission), it checks if the user's access type is 'w' ('$access'). If the value for 'access_type' is 'r' (read permission), it checks if the user's access type is 'r' ('$access') or 'w' (since write permission also includes read permission), or 'st' (student access). If the value for 'access_type' is 'st' (student access), it checks if the user's access type is 'st' ('$access'). If the value for 'access_type' is 'sv' (supervisory access), it checks if the user's access type is 'sv' ('$access').

If the user's access type matches the requested access type, the function returns _true_, indicating that the user has the necessary permission. If there is no match, the function returns _false_, indicating that the user does not have the necessary permission.

__Conlusion:__
__hasAccess__ is a function that handles security checks in the system. It determines whether users have the correct permissions to access and interact with course materials. The function (along with 'getAccessType') is frequently used in the system. It is currently called 74 times in 30 different files. It´s used every time a check is made to determine if a user has the right to access specific course materials. Thus, it is a highly used function.

One must keep in mind that since the function makes a call to another function ('getAccessType'), implementing 'hasAccess' as a microservice would still not be completely isolated from 'sessions.php'. What needs to be considered when grouping functions into microservices is not only which functions are related to the same functionality, but also which functions are frequently used together. Looking at how these functions are currently used helps to understand how they might be used in the future. This is important to avoid unnecessary complexity by making microservices too small or missing benefits such as scalability if they are too large. In other words, the functions 'hasAccess' and 'getAccessType' should together make one microservice. 

Considering that the development of microservices is intended to focus on the service files and functions that make requests against the database (MYSQL), this function actually meets that requirement (through the call of 'getAccessType' which makes a query against a MYSQL database). Therefore, the function meets the desired requirements for which functions should be converted into a microservice, but whether it is in this iteration of the course is another question. Converting 'sessions.php' should not be a priority at this time but perhaps later on. This function should definitely become a microservice at a later stage, when all planned microservices are developed and functioning.