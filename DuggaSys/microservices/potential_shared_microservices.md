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