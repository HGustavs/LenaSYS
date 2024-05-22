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