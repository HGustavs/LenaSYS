<?php

//------------------------------------------------------------------------------------------------
// makeLogEntry
//------------------------------------------------------------------------------------------------
//
// Reads service Parameter from POST encoding using entities
//
// 1,2 Signify Reading and Writing of Dugga
// 3,4 Signify Sucessful and Failed Login

function makeLogEntry($userid,$entrytype,$pdo,$etext)
{
			$userag=$etext."|".$_SERVER['HTTP_USER_AGENT'];
			if(strlen($userag)>1024) substr ($userag,0,1024);
			$query = $pdo->prepare("INSERT INTO eventlog(address,raddress, type, user, eventtext) VALUES(:address,:raddress, :type, :user, :eventtext)");
		
			$query->bindParam(':user', $userid);
			$query->bindParam(':type', $entrytype);
		
			$query->bindParam(':address', $_SERVER['REMOTE_ADDR']);
			$query->bindParam(':raddress', $_SERVER['HTTP_CLIENT_IP']);
			$query->bindParam(':eventtext', $userag);
			
			return ($query->execute() && $query->rowCount() > 0);
}


//------------------------------------------------------------------------------------------------
// getOP
//------------------------------------------------------------------------------------------------
//
// Reads service Parameter from POST encoding using entities
//

function getOP($name)
{
		if(isset($_POST[$name]))	return urldecode($_POST[$name]);
		else return "UNK";			
}

//------------------------------------------------------------------------------------------------
// getOP
//------------------------------------------------------------------------------------------------
function gettheOP($name)
{
	if(isset($_POST[$name])){
		return $_POST[$name];
	}		
	else return "UNK";			
}

//
// Reads service Parameter from POST encoding using entities
//

function getOPG($name)
{
		if(isset($_GET[$name]))	return urldecode($_GET[$name]);
		else return "UNK";			
}

//------------------------------------------------------------------------------------------------
// makeRandomString
//------------------------------------------------------------------------------------------------
//
// Makes a random string of length X
//

function makeRandomString($length = 6) {
    $validCharacters = "abcdefghijklmnopqrstuxyvwzABCDEFGHIJKLMNOPQRSTUXYVWZ+-*#&@!?";
    $validCharNumber = strlen($validCharacters);
    $result = "";
    for ($i = 0; $i < $length; $i++) {
    	$index = mt_rand(0, $validCharNumber - 1);
      $result .= $validCharacters[$index];
    }
    return $result;
}

//---------------------------------------------------------------------------------------------------------------
// endsWith - Tests if a string ends with another string - defaults to being non-case sensitive
//---------------------------------------------------------------------------------------------------------------
function endsWith($haystack,$needle,$case=true)
{
	if($case){
		return (strcmp(substr($haystack, strlen($haystack) - strlen($needle)),$needle)===0);
	}
	return (strcasecmp(substr($haystack, strlen($haystack) - strlen($needle)),$needle)===0);
}

//---------------------------------------------------------------------------------------------------------------
// endsWith - Tests if a string ends with another string - defaults to being non-case sensitive
//---------------------------------------------------------------------------------------------------------------

function swizzleArray(&$filepost) {

    $filearray = array();
    $filecount = count($filepost['name']);
    if ($filepost !== null) $filekeys = array_keys($filepost);

    for ($i=0; $i<$filecount; $i++) {
        foreach ($filekeys as $key) {
            $filearray[$i][$key] = $filepost[$key][$i];
        }
    }

    return $filearray;
}

// Open log database and create tables if they do not exist
$log_db = new PDO('sqlite:../log.db');
$sql = '
	CREATE TABLE IF NOT EXISTS logEntries (
		id INTEGER PRIMARY KEY,
		eventType INTEGER,
		description TEXT,
		timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
	);
	CREATE TABLE IF NOT EXISTS userLogEntries (
		id INTEGER PRIMARY KEY,
		uid INTEGER(10),
		eventType INTEGER,
		description VARCHAR(50),
		timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
	);
	CREATE TABLE IF NOT EXISTS serviceLogEntries (
		id INTEGER PRIMARY KEY,
		uuid CHAR(15),
		eventType INTEGER,
		service VARCHAR(15),
		timestamp INTEGER
	);
';
$log_db->exec($sql);


//------------------------------------------------------------------------------------------------
// logEvent
//------------------------------------------------------------------------------------------------
//
// Creates a new log entry in the log database (log.db, located at the root directory)
//

function logEvent($eventType, $description) {
	$query = $GLOBALS['log_db']->prepare('INSERT INTO logEntries (eventType, description) VALUES (:eventType, :description)');
	$query->bindParam(':eventType', $eventType);
	$query->bindParam(':description', $description);
	$query->execute();
}


//------------------------------------------------------------------------------------------------
// logUserEvent
//------------------------------------------------------------------------------------------------
//
//  Creates a new userbased event in the log.db database.
//

function logUserEvent($uid, $eventType, $description) {
	$query = $GLOBALS['log_db']->prepare('INSERT INTO userLogEntries (uid, eventType, description) VALUES (:uid, :eventType, :description)');
	$query->bindParam(':uid', $uid);
	$query->bindParam(':eventType', $eventType);
	$query->bindParam(':description', $description);
	$query->execute();
}

//------------------------------------------------------------------------------------------------
// logServiceEvent
//------------------------------------------------------------------------------------------------
//
//  Creates a new service event in the log.db database.
//  The timestamp used is an integer containing the number of milliseconds since 1970-01-01 00:00 (default javascript date format)
//

function logServiceEvent($uuid, $eventType, $service, $timestamp = null) {
	if (is_null($timestamp)) {
		$timestamp = round(microtime(true) * 1000);
	}
	$query = $GLOBALS['log_db']->prepare('INSERT INTO serviceLogEntries (uuid, eventType, service, timestamp) VALUES (:uuid, :eventType, :service, :timestamp)');
	$query->bindParam(':uuid', $uuid);
	$query->bindParam(':eventType', $eventType);
	$query->bindParam(':service', $service);
	$query->bindParam(':timestamp', $timestamp);
	$query->execute();
}


//------------------------------------------------------------------------------------------------
// EventTypes
//------------------------------------------------------------------------------------------------
//
// Contains constants for log event types
//

abstract class EventTypes {
	const DuggaRead = 1;
	const DuggaWrite = 2;
	const LoginSuccess = 3;
	const LoginFail = 4;
	const ServiceClientStart = 5;
	const ServiceServerStart = 6;
	const ServiceServerEnd = 7;
	const ServiceClientEnd = 8;
}


?>