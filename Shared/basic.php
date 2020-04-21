<?php

//------------------------------------------------------------------------------------------------
// makeLogEntry
//------------------------------------------------------------------------------------------------

function makeLogEntry($userid,$entrytype,$pdo,$etext)
{
		return false;
}


//------------------------------------------------------------------------------------------------
// getOP
// Read the $name from $_POST and if $name exists returns the value of $name typecast to $type
// If $name does not exist in $_POST return $default
//------------------------------------------------------------------------------------------------
function getOP($name, $default="UNK", $type="string")
{
    /*
    if(isset($_POST[$name]))	return urldecode($_POST[$name]);
    else return "UNK";
    */
    $ret = $default;
    if (isset($_POST[$name])) {
        if (strcmp($type, "float") === 0) {
            $ret = floatval(urldecode($_POST[$name]));
        } else if (strcmp($type, "int") === 0) {
            $ret = intval(urldecode($_POST[$name]));
        } else if (strcmp($type, "JSON") === 0) {
            $ret = json_decode(urldecode($_POST[$name]));
            if (json_last_error() !== JSON_ERROR_NONE) {
                $ret = "UNK";
            }
        } else {
            $ret = urldecode($_POST[$name]);
        }
    }
    return $ret;
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

function getOPG($name)
{
		if(isset($_GET[$name]))	return urldecode($_GET[$name]);
		else return "UNK";
}

//------------------------------------------------------------------------------------------------
// makeRandomString
//------------------------------------------------------------------------------------------------

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
// swizzleArray - Swizzles rows and columns for file list array
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

//---------------------------------------------------------------------------------------------------------------
// connect log database - Open log database
//---------------------------------------------------------------------------------------------------------------
if(!file_exists ('../../log')) {
	if(!mkdir('../../log')){
		echo "Error creating folder: log";
		die;
	}
}
try {
	$log_db = new PDO('sqlite:../../log/loglena4.db');
} catch (PDOException $e) {
	echo "Failed to connect to the database";
	throw $e;
}
$sql = '
	CREATE TABLE IF NOT EXISTS logEntries (
		id INTEGER PRIMARY KEY,
		eventType INTEGER,
		description TEXT,
		timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
		userAgent TEXT
	);
	CREATE TABLE IF NOT EXISTS userLogEntries (
		id INTEGER PRIMARY KEY,
		uid INTEGER(10),
		eventType INTEGER,
		description VARCHAR(50),
		timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
		userAgent TEXT,
		remoteAddress VARCHAR(15)
	);
	CREATE TABLE IF NOT EXISTS serviceLogEntries (
		id INTEGER PRIMARY KEY,
		uuid CHAR(15),
		eventType INTEGER,
		service VARCHAR(15),
		userid VARCHAR(8),
		timestamp INTEGER,
		userAgent TEXT,
		operatingSystem VARCHAR(100),
		info TEXT,
		referer TEXT,
		IP TEXT,
		browser VARCHAR(100)
	);
	CREATE TABLE IF NOT EXISTS clickLogEntries (
		id INTEGER PRIMARY KEY,
		target TEXT,
		mouseX TEXT,
		mouseY TEXT,
		clientResX TEXT,
		clientResY TEXT,
		timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
	);
	CREATE TABLE IF NOT EXISTS mousemoveLogEntries (
		id INTEGER PRIMARY KEY,
		page TEXT,
		mouseX TEXT,
		mouseY TEXT,
		timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
	);
	CREATE TABLE IF NOT EXISTS exampleLoadLogEntries(
		id INTEGER PRIMARY KEY,
		type INTEGER,
		courseid INTEGER,
		exampleid INTEGER,
		timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
	);
	CREATE TABLE IF NOT EXISTS duggaLoadLogEntries(
		id INTEGER PRIMARY KEY,
		type INTEGER,
		cid INTEGER,
		vers INTEGER,
		quizid INTEGER,
		timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
	);
';
$log_db->exec($sql);
//------------------------------------------------------------------------------------------------
// logEvent - Creates a new log entry in the log database (log.db, located at the root directory)
//------------------------------------------------------------------------------------------------

function logEvent($eventType, $description) {
	$query = $GLOBALS['log_db']->prepare('INSERT INTO logEntries (eventType, description, userAgent) VALUES (:eventType, :description, :userAgent)');
	$query->bindParam(':eventType', $eventType);
	$query->bindParam(':description', $description);
	$query->bindParam(':userAgent', $_SERVER['HTTP_USER_AGENT']);
	$query->execute();
}

//------------------------------------------------------------------------------------------------
// logUserEvent - Creates a new userbased event in the log.db database.
//------------------------------------------------------------------------------------------------

function logUserEvent($uid, $eventType, $description) {
	$query = $GLOBALS['log_db']->prepare('INSERT INTO userLogEntries (uid, eventType, description, userAgent, remoteAddress) VALUES (:uid, :eventType, :description, :userAgent, :remoteAddress)');
	$query->bindParam(':uid', $uid);
	$query->bindParam(':eventType', $eventType);
	$query->bindParam(':description', $description);
	$query->bindParam(':userAgent', $_SERVER['HTTP_USER_AGENT']);
	$query->bindParam(':remoteAddress', $_SERVER['REMOTE_ADDR']);
	$query->execute();
}

//------------------------------------------------------------------------------------------------
// logServiceEvent - Creates a new service event in the log.db database. The timestamp used is an integer containing the number of milliseconds since 1970-01-01 00:00 (default javascript date format)
//------------------------------------------------------------------------------------------------

function logServiceEvent($uuid, $eventType, $service, $userid, $info, $timestamp = null) {
	if (is_null($timestamp)) {
		$timestamp = round(microtime(true) * 1000);
	}
	$query = $GLOBALS['log_db']->prepare('INSERT INTO serviceLogEntries (uuid, eventType, service, timestamp, userAgent, operatingSystem, browser, userid, info, referer, IP) VALUES (:uuid, :eventType, :service, :timestamp, :userAgent, :operatingSystem, :browser, :userid, :info, :referer, :IP)');
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

//------------------------------------------------------------------------------------------------
// logClickEvent - Creates a new click event in the log.db database.
//------------------------------------------------------------------------------------------------

function logClickEvent($target, $mouseX, $mouseY, $clientResX, $clientResY) {
	$query = $GLOBALS['log_db']->prepare('INSERT INTO clickLogEntries (target, mouseX, mouseY, clientResX, clientResY) VALUES (:target, :mouseX, :mouseY, :clientResX, :clientResY)');
	$query->bindParam(':target', $target);
	$query->bindParam(':mouseX', $mouseX);
	$query->bindParam(':mouseY', $mouseY);
	$query->bindParam(':clientResX', $clientResX);
	$query->bindParam(':clientResY', $clientResY);
	$query->execute();
}

//------------------------------------------------------------------------------------------------
// logMousemoveEvent - Creates a new click event in the log.db database.
//------------------------------------------------------------------------------------------------

function logMousemoveEvent($page, $mouseX, $mouseY) {
	$query = $GLOBALS['log_db']->prepare('INSERT INTO mousemoveLogEntries (page, mouseX, mouseY) VALUES (:page, :mouseX, :mouseY)');
	$query->bindParam(':page', $page);
	$query->bindParam(':mouseX', $mouseX);
	$query->bindParam(':mouseY', $mouseY);
	$query->execute();
}

//------------------------------------------------------------------------------------------------
// Log page load for examples. - Creates a new entry to the exampleLoadLogEntries when a user opens a new example.
//------------------------------------------------------------------------------------------------

function logExampleLoadEvent($courseid, $exampleid, $type) {
	$query = $GLOBALS['log_db']->prepare('INSERT INTO exampleLoadLogEntries (courseid, exampleid, type) VALUES (:courseid, :exampleid, :type)');
	$query->bindParam(':courseid', $courseid);
	$query->bindParam(':exampleid', $exampleid);
	$query->bindParam(':type', $type);
	$query->execute();
}

//------------------------------------------------------------------------------------------------
// Log page load for examples. - Creates a new entry to the duggaLoadLogEntries when a user opens a new dugga.
//------------------------------------------------------------------------------------------------

function logDuggaLoadEvent($cid, $vers, $quizid, $type) {
	$query = $GLOBALS['log_db']->prepare('INSERT INTO duggaLoadLogEntries (cid, vers, quizid, type) VALUES (:cid, :vers, :quizid, :type)');
	$query->bindParam(':cid', $cid);
	$query->bindParam(':vers', $vers);
	$query->bindParam(':quizid', $quizid);
	$query->bindParam(':type', $type);
	$query->execute();
}

//------------------------------------------------------------------------------------------------
// EventTypes - Contains constants for log event types
//------------------------------------------------------------------------------------------------

abstract class EventTypes {
	const DuggaRead = 1;
	const DuggaWrite = 2;
	const LoginSuccess = 3;
	const LoginFail = 4;
	const ServiceClientStart = 5;
	const ServiceServerStart = 6;
	const ServiceServerEnd = 7;
	const ServiceClientEnd = 8;
	const Logout = 9;
	const pageLoad = 10;
  const PageNotFound = 11;
  const RequestNewPW = 12;
  const CheckSecQuestion = 13;
    const DuggaFileupload = 17;
}

//------------------------------------------------------------------------------------------------
// EventTypes - Contains constants for log event types
//------------------------------------------------------------------------------------------------

function getOS() {
	$userAgent = $_SERVER['HTTP_USER_AGENT'];
    $osPlatform = "Unknown";
    $osArray = array(
		'/windows nt 10/i'      => 'Windows 10',
		'/windows nt 6.3/i'     => 'Windows 8.1',
		'/windows nt 6.2/i'     => 'Windows 8',
		'/windows nt 6.1/i'     => 'Windows 7',
		'/windows nt 6.0/i'     => 'Windows Vista',
		'/windows nt 5.2/i'     => 'Windows Server 2003/XP x64',
		'/windows nt 5.1/i'     => 'Windows XP',
		'/windows xp/i'         => 'Windows XP',
		'/windows nt 5.0/i'     => 'Windows 2000',
		'/windows me/i'         => 'Windows ME',
		'/win98/i'              => 'Windows 98',
		'/win95/i'              => 'Windows 95',
		'/win16/i'              => 'Windows 3.11',
		'/macintosh|mac os x/i' => 'Mac OS X',
		'/mac_powerpc/i'        => 'Mac OS 9',
		'/linux/i'              => 'Linux',
		'/ubuntu/i'             => 'Ubuntu',
		'/iphone/i'             => 'iPhone',
		'/ipod/i'               => 'iPod',
		'/ipad/i'               => 'iPad',
		'/android/i'            => 'Android',
		'/blackberry/i'         => 'BlackBerry',
		'/webos/i'              => 'Mobile'
	);
    foreach ($osArray as $regex => $value) {
        if (preg_match($regex, $userAgent)) {
			$osPlatform = $value;
		}
	}
	return $osPlatform;
}

function getIP() {
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
	return $IP;
}

//------------------------------------------------------------------------------------------------
// EventTypes - Contains constants for log event types
//------------------------------------------------------------------------------------------------

function getBrowser() {
	$userAgent = $_SERVER['HTTP_USER_AGENT'];
	$browser = "Unknown";
	$browserArray  =   array(
		'/msie/i'       => 'Internet Explorer',
		'/firefox/i'    => 'Firefox',
		'/safari/i'     => 'Safari',
		'/chrome/i'     => 'Chrome',
		'/edge/i'       => 'Edge',
		'/opera/i'      => 'Opera',
		'/netscape/i'   => 'Netscape',
		'/maxthon/i'    => 'Maxthon',
		'/konqueror/i'  => 'Konqueror',
		'/mobile/i'     => 'Handheld Browser'
	);
	foreach ($browserArray as $regex => $value) {
        if (preg_match($regex, $userAgent)) {
			$browser = $value;
		}
	} 
	return $browser;
}

function formatted_debug($item, $desc = null) {
	echo "<hr>";
	if(isset($desc)) {
		echo "<h3 style='color: tomato'>".$desc."</h3>";
	}
	echo "<pre>";
	echo var_dump($item);
	echo "</pre>";
	echo "<hr>";
}

function debug_to_console($data) {
	$out = $data;
	if(is_array(($out))) {
		$out = implode(',', $out);
	}

	echo "<script>console.log('Debug php array: " . $out . "');</script>";
}

?>
