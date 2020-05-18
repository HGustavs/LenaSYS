<?php

//---------------------------------------------------------------------------------------------------------------
// analytictoolservice - Contains ajax calls for analytic tool
//---------------------------------------------------------------------------------------------------------------

date_default_timezone_set("Europe/Stockholm");

// Include basic application services
include_once "../Shared/basic.php";
include_once "../Shared/sessions.php";

// Connect to database and start session
pdoConnect();
session_start();

if (isset($_SESSION['uid']) && checklogin() && isSuperUser($_SESSION['uid'])) {
	if (isset($_POST['query'])) {
		switch ($_POST['query']) {
			case 'generalStats':
				generalStats($pdo);
				break;
			case 'courseDiskUsage':
				courseDiskUsage($pdo);
				break;
			case 'onlineUsers':
				onlineUsers();
				break;
			case 'serviceAvgDuration':
				serviceAvgDuration();
				break;
			case 'passwordGuessing':
				passwordGuessing();
				break;
			case 'serviceUsage':
				serviceUsage(
					isset($_POST['start']) ? $_POST['start'] : '1970-01-01 00:00',
					isset($_POST['end']) ? $_POST['end'] : '2100-01-01 00:00',
					isset($_POST['interval']) ? $_POST['interval'] : 'monthly'
				);
				break;
			case 'osPercentage':
				osPercentage();
				break;
			case 'browserPercentage':
				browserPercentage();
				break;
			case 'serviceCrashes':
				serviceCrashes();
				break;
			case 'fileInformation':
				fileInformation($pdo);
				break;
			case 'duggaInformation':
                duggaInformation($pdo);
                break;
            case 'codeviewerInformation':
                codeviewerInformation($pdo);
                break;
            case 'duggaPercentage':
                duggaPercentage();
                break;
            case 'codeviewerPercentage':
                codeviewerPercentage();
				break;
			case 'sectionedInformation':
				sectionedInformation($pdo);
				break;
			case 'courseedInformation':
				courseedInformation($pdo);
				break;
			case 'userLogInformation':
				userLogInformation($pdo);
				break;
			case 'pageInformation':
				pageInformation();
				break;
			case 'resolveCourseID':
				resolveCourseID($pdo);
				break;
		}
	} else {
		echo 'N/A';
	}
} else {
	die('access denied');
}

//------------------------------------------------------------------------------------------------
// Retrieves general stats from the log			
//------------------------------------------------------------------------------------------------
function generalStats($dbCon) {
	$log_db = $GLOBALS['log_db'];
	$LoginFail = $log_db->query('
		SELECT
			COUNT(*) AS loginFails
		FROM
			userLogEntries
		WHERE
			eventType = '.EventTypes::LoginFail.';
	')->fetchAll(PDO::FETCH_ASSOC);

	$activeUsers = $log_db->query('
		SELECT 
			username, refer, max(timestamp) as time
		FROM 
			userHistory
		WHERE 
			timestamp >= Datetime("now", "-15 minutes")
		GROUP BY 
			username
		ORDER BY 
			timestamp DESC;
	')->fetchAll(PDO::FETCH_ASSOC);

	$topPage = $log_db->query('
		SELECT refer, COUNT(*) as hits
		FROM userHistory 
		GROUP BY refer 
		ORDER BY COUNT(*) DESC LIMIT 1;
	')->fetchAll(PDO::FETCH_ASSOC);
	
	$topBrowser = $GLOBALS['log_db']->query('
		SELECT
			browser,
			COUNT(*) * 100.0 / (SELECT COUNT(*) FROM serviceLogEntries WHERE eventType = '.EventTypes::ServiceServerStart.') AS percentage
		FROM serviceLogEntries
		WHERE eventType = '.EventTypes::ServiceServerStart.'
		GROUP BY browser
		ORDER BY percentage DESC LIMIT 1
    ')->fetchAll(PDO::FETCH_ASSOC);
	
    $topOS = $GLOBALS['log_db']->query('
        SELECT
            operatingSystem,
            COUNT(*) * 100.0 / (SELECT COUNT(*) FROM serviceLogEntries WHERE eventType = '.EventTypes::ServiceServerStart.') AS percentage
        FROM serviceLogEntries
        WHERE eventType = '.EventTypes::ServiceServerStart.'
        GROUP BY operatingSystem
        ORDER BY percentage DESC
    ')->fetchAll(PDO::FETCH_ASSOC);

    $serviceCrashes = $log_db->query('
        SELECT 
             COUNT(*) as serviceCrashes
        FROM serviceLogEntries
        WHERE uuid NOT IN (SELECT DISTINCT uuid FROM serviceLogEntries WHERE eventType = '.EventTypes::ServiceServerEnd.');
    ')->fetchAll(PDO::FETCH_ASSOC);

    $topViewedDugga = $GLOBALS['log_db']->query('
        SELECT 
             quizid, 
             COUNT(*) as hits
        FROM duggaLoadLogEntries 
        GROUP BY quizid 
        ORDER BY COUNT(*) DESC LIMIT 1;
    ')->fetchAll(PDO::FETCH_ASSOC);

    $topViewedExample = $GLOBALS['log_db']->query('
        SELECT 
             exampleid, 
             COUNT(*) as hits
        FROM exampleLoadLogEntries 
        GROUP BY exampleid 
        ORDER BY COUNT(*) DESC LIMIT 1;
    ')->fetchAll(PDO::FETCH_ASSOC);

	$fastestService = $GLOBALS['log_db']->query('
	SELECT DISTINCT
		service,
		(
			SELECT AVG(duration) FROM (
				SELECT s1.service AS subService, (s2.timestamp - s1.timestamp) AS duration
				FROM serviceLogEntries s1
				JOIN serviceLogEntries s2 ON s1.uuid=s2.uuid AND s2.eventType='.EventTypes::ServiceServerEnd.'
				WHERE s1.eventType='.EventTypes::ServiceServerStart.'
			)
			WHERE service=subService
		) AS avgDuration
	FROM serviceLogEntries ORDER BY avgDuration ASC LIMIT 1;
	')->fetchAll(PDO::FETCH_ASSOC);

	$slowestService = $GLOBALS['log_db']->query('
	SELECT DISTINCT
		service,
		(
			SELECT AVG(duration) FROM (
				SELECT s1.service AS subService, (s2.timestamp - s1.timestamp) AS duration
				FROM serviceLogEntries s1
				JOIN serviceLogEntries s2 ON s1.uuid=s2.uuid AND s2.eventType='.EventTypes::ServiceServerEnd.'
				WHERE s1.eventType='.EventTypes::ServiceServerStart.'
			)
			WHERE service=subService
		) AS avgDuration
	FROM serviceLogEntries ORDER BY avgDuration DESC LIMIT 1;
	')->fetchAll(PDO::FETCH_ASSOC);
	

	$generalStats = [];
	$generalStats['stats']['loginFails'] = $LoginFail[0];
	$generalStats['stats']['numOnline'] = count($activeUsers);

 	$generalStats['stats']['lenasysSize'] = convertBytesToHumanreadable(GetDirectorySize(str_replace("DuggaSys", "", getcwd())));
	$generalStats['stats']['userSubmissionSize'] = convertBytesToHumanreadable(GetDirectorySize(getcwd() . "/submissions"));

	$generalStats['stats']['topPage'] = $topPage[0]['refer'];
	$generalStats['stats']['topPageHits'] = $topPage[0]['hits'];
 
    $generalStats['stats']['topViewedDugga'] = $topViewedDugga[0]['quizid'];
	$generalStats['stats']['topViewedDuggaHits'] = $topViewedDugga[0]['hits'];
 
    $generalStats['stats']['topViewedExample'] = $topViewedExample[0]['exampleid'];
	$generalStats['stats']['topViewedExampleHits'] = $topViewedExample[0]['hits'];

	$generalStats['stats']['topBrowser'] = $topBrowser[0]['browser'];
	$generalStats['stats']['topOS'] = $topOS[0]['operatingSystem'];
 
    $generalStats['stats']['serviceCrashes'] = $serviceCrashes[0]['serviceCrashes'];

	$generalStats['stats']['fastestService'] = $fastestService[0]['service'];
	$generalStats['stats']['fastestServiceSpeed'] = round($fastestService[0]['avgDuration'], 2);

	$generalStats['stats']['slowestService'] = $slowestService[0]['service'];
	$generalStats['stats']['slowestServiceSpeed'] = round($slowestService[0]['avgDuration'], 2);


	$query = $dbCon->prepare("SELECT count(*) as numUsers FROM user");

	if(!$query->execute()) {
		$numUsers = 'Error Reading DB.';
	} else {
		$rows = $query->fetchAll(PDO::FETCH_ASSOC);
		$numUsers = $rows[0]['numUsers'];
	}

	$generalStats['stats']['totalUsers'] = $numUsers;

	// Disk space calculation
	$memInUse = disk_total_space(".") - disk_free_space(".");
	$memFree = disk_free_space(".");

	$minMem = min($memInUse, $memFree);
	$maxMem = max($memInUse, $memFree);
	
	$inUsePercent = (1 - $minMem / $maxMem) * 100;

	$memFreePercent = 100 - $inUsePercent;

	if($memInUse > $memFree) {
		$generalStats['disk']['inUsePercent'] = max($memFreePercent, $inUsePercent);
		$generalStats['disk']['memFreePercent'] = min($memFreePercent, $inUsePercent);
	} else {
		$generalStats['disk']['inUsePercent'] = min($memFreePercent, $inUsePercent);
		$generalStats['disk']['memFreePercent'] = max($memFreePercent, $inUsePercent);
	}

	$generalStats['disk']['inUse'] = convertBytesToHumanreadable($memInUse);
	$generalStats['disk']['memFree'] = convertBytesToHumanreadable($memFree);
	$generalStats['disk']['memTotal'] = convertBytesToHumanreadable(disk_total_space("."));

	//If Linux or Windows, Mac OSX does not have any functions that can properly return this data.
	if (!stristr(PHP_OS, "Darwin")) {
		$memUsage = getServerMemoryUsage(false);
		$generalStats['ram']['free'] = convertBytesToHumanreadable($memUsage["free"]);
		$generalStats['ram']['total'] = convertBytesToHumanreadable($memUsage["total"]);
		$generalStats['ram']['freePercent'] = 100 - getServerMemoryUsage(true);
		$generalStats['ram']['totalPercent'] = getServerMemoryUsage(true);
	}
	
	echo json_encode($generalStats);
}

function GetDirectorySize($path) {
    $bytestotal = 0;
    $path = realpath($path);
    if($path!==false && $path!='' && file_exists($path)){
        foreach(new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path, FilesystemIterator::SKIP_DOTS)) as $object){
            $bytestotal += $object->getSize();
        }
    }
    return $bytestotal;
}

//------------------------------------------------------------------------------------------------
// Retrieves online users
//------------------------------------------------------------------------------------------------
function onlineUsers() {
	$log_db = $GLOBALS['log_db'];

	$activeUsers = $log_db->query('
		SELECT 
			username, refer, max(timestamp) as time
		FROM 
			userHistory
		WHERE 
			timestamp >= Datetime("now", "-15 minutes")
		GROUP BY 
			username
		ORDER BY 
			timestamp DESC;
	')->fetchAll(PDO::FETCH_ASSOC);
	
	echo json_encode($activeUsers);
}

// Convert bytes to mb, gb and so on in a human readable format
function convertBytesToHumanreadable($bytes) {
    $si_prefix = array( 'B', 'KB', 'MB', 'GB', 'TB', 'EB', 'ZB', 'YB' );
    $base = 1024;
    $class = min((int)log($bytes , $base) , count($si_prefix) - 1);
	return sprintf('%1.2f' , $bytes / pow($base,$class)) . ' ' . $si_prefix[$class];
}

// Return memory usage for Linux and Windows
function getServerMemoryUsage($getPercentage=true) {
	$memoryTotal = null;
	$memoryFree = null;

	if (stristr(PHP_OS, "win")) {
		$cmd = "wmic ComputerSystem get TotalPhysicalMemory";
		@exec($cmd, $outputTotalPhysicalMemory);

		$cmd = "wmic OS get FreePhysicalMemory";
		@exec($cmd, $outputFreePhysicalMemory);

		if ($outputTotalPhysicalMemory && $outputFreePhysicalMemory) {
			foreach ($outputTotalPhysicalMemory as $line) {
				if ($line && preg_match("/^[0-9]+\$/", $line)) {
					$memoryTotal = $line;
					break;
				}
			}
			foreach ($outputFreePhysicalMemory as $line) {
				if ($line && preg_match("/^[0-9]+\$/", $line)) {
					$memoryFree = $line;
					$memoryFree *= 1024; 
					break;
				}
			}
		}
	} else {
		if (is_readable("/proc/meminfo")) {
			$stats = @file_get_contents("/proc/meminfo");
			if ($stats !== false) {
				$stats = str_replace(array("\r\n", "\n\r", "\r"), "\n", $stats);
				$stats = explode("\n", $stats);
				foreach ($stats as $statLine) {
					$statLineData = explode(":", trim($statLine));

					if (count($statLineData) == 2 && trim($statLineData[0]) == "MemTotal") {
						$memoryTotal = trim($statLineData[1]);
						$memoryTotal = explode(" ", $memoryTotal);
						$memoryTotal = $memoryTotal[0];
						$memoryTotal *= 1024; 
					}
					
					if (count($statLineData) == 2 && trim($statLineData[0]) == "MemFree") {
						$memoryFree = trim($statLineData[1]);
						$memoryFree = explode(" ", $memoryFree);
						$memoryFree = $memoryFree[0];
						$memoryFree *= 1024;
					}
				}
			}
		}
	}

	if (is_null($memoryTotal) || is_null($memoryFree)) {
		return null;
	} else {
		if ($getPercentage) {
			return (100 - ($memoryFree * 100 / $memoryTotal));
		} else {
			return array(
				"total" => $memoryTotal,
				"free" => $memoryFree,
			);
		}
	}
}

//------------------------------------------------------------------------------------------------
// Retrieves average duration for services in the log		
//------------------------------------------------------------------------------------------------
function serviceAvgDuration() {
	$result = $GLOBALS['log_db']->query('
		SELECT DISTINCT
			service,
			(
				SELECT AVG(duration) FROM (
					SELECT s1.service AS subService, (s2.timestamp - s1.timestamp) AS duration
					FROM serviceLogEntries s1
					JOIN serviceLogEntries s2 ON s1.uuid=s2.uuid AND s2.eventType='.EventTypes::ServiceServerEnd.'
					WHERE s1.eventType='.EventTypes::ServiceServerStart.'
				)
				WHERE service=subService
			) AS avgDuration
		FROM serviceLogEntries;
	')->fetchAll(PDO::FETCH_ASSOC);
	echo json_encode($result);
}

//------------------------------------------------------------------------------------------------
// Retrieves possible password guessing.		
//------------------------------------------------------------------------------------------------

function passwordGuessing(){
	$result = $GLOBALS['log_db']->query('
		SELECT
			uid AS userName,
			remoteAddress AS remoteAddress,
			userAgent AS userAgent,
			COUNT(*) AS tries
		FROM userLogEntries
		WHERE eventType = '.EventTypes::LoginFail.'
		GROUP BY uid, remoteAddress
		HAVING tries >= 3;
	')->fetchAll(PDO::FETCH_ASSOC);
	echo json_encode($result);
}

//------------------------------------------------------------------------------------------------
// Retrieves service usage.		
//------------------------------------------------------------------------------------------------

function serviceUsage($start, $end, $interval){
	$dateGroupFormat = "%Y-%m";
	switch ($interval) {
		case 'hourly':
			$dateGroupFormat = "%Y-%m-%d %H";
			break;
		case 'daily':
			$dateGroupFormat = "%Y-%m-%d";
			break;
		case 'weekly':
			$dateGroupFormat = "%Y w%W";
			break;
		case 'monthly':
			$dateGroupFormat = "%Y-%m";
			break;
	}
	$query = $GLOBALS['log_db']->prepare('
		SELECT
			service AS service,
			strftime(?, datetime(timeStamp/1000, \'unixepoch\')) AS dateTime,
			COUNT(*) AS hits
		FROM serviceLogEntries
		WHERE
			eventType = '.EventTypes::ServiceServerStart.'
			AND datetime(timeStamp/1000, \'unixepoch\') BETWEEN ? AND ?
		GROUP BY service, dateTime;
	');
	$query->execute(array($dateGroupFormat, $start, $end));
	$result = $query->fetchAll(PDO::FETCH_ASSOC);
	echo json_encode($result);
}


//------------------------------------------------------------------------------------------------
// Retrieves file information		
//------------------------------------------------------------------------------------------------

function fileInformation($pdo){
    $query = $pdo->prepare("SELECT filename FROM fileLink");
    if(!$query->execute()) {
    } else {
        $rows = $query->fetchAll(PDO::FETCH_ASSOC);
        $files = [];
        foreach($rows as $key => $value) {
            $files[$key] =  [  
                                "username"      =>  "",
                                "timestamp"     =>  "",
                                "eventType"     =>  "",    
                                "description"   =>  "",
                                "filename"      =>  $value['filename']
                            ];
        }
    }
 
    $result = $GLOBALS['log_db']->query('
        SELECT
            username,
            timestamp AS timestamp,
            eventType AS eventType,
            description AS description,
            substr(description,    instr(description, " ") + 1) AS filename
        FROM userLogEntries
        WHERE eventType = '.EventTypes::AddFile.' OR eventType = '.EventTypes::EditFile.'
        ORDER BY timestamp;
    ')->fetchAll(PDO::FETCH_ASSOC);
 
    foreach($result as $value) {
        $key = array_search($value['filename'], array_column($files, 'filename'));
        if($key === FALSE) {
            unset($files[$key]);
        }
    }
   
    echo json_encode(array_merge($files,$result));
}

//------------------------------------------------------------------------------------------------
// Retrieves OS percentage		
//------------------------------------------------------------------------------------------------

function osPercentage(){
	$result = $GLOBALS['log_db']->query('
		SELECT
			operatingSystem,
			COUNT(*) * 100.0 / (SELECT COUNT(*) FROM serviceLogEntries WHERE eventType = '.EventTypes::ServiceServerStart.') AS percentage
		FROM serviceLogEntries
		WHERE eventType = '.EventTypes::ServiceServerStart.'
		GROUP BY operatingSystem
		ORDER BY percentage DESC
	')->fetchAll(PDO::FETCH_ASSOC);
	echo json_encode($result);
}

//------------------------------------------------------------------------------------------------
// Retrieves browser percentage		
//------------------------------------------------------------------------------------------------

function browserPercentage(){
	$result = $GLOBALS['log_db']->query('
		SELECT
			browser,
			COUNT(*) * 100.0 / (SELECT COUNT(*) FROM serviceLogEntries WHERE eventType = '.EventTypes::ServiceServerStart.') AS percentage
		FROM serviceLogEntries
		WHERE eventType = '.EventTypes::ServiceServerStart.'
		GROUP BY browser
		ORDER BY percentage DESC
	')->fetchAll(PDO::FETCH_ASSOC);
	echo json_encode($result);
}

//------------------------------------------------------------------------------------------------
// Retrieves service crashes		
//------------------------------------------------------------------------------------------------

function serviceCrashes(){
	$result = $GLOBALS['log_db']->query('
		SELECT * 
		FROM serviceLogEntries
		WHERE uuid NOT IN (SELECT DISTINCT uuid FROM serviceLogEntries WHERE eventType = '.EventTypes::ServiceServerEnd.');
	')->fetchAll(PDO::FETCH_ASSOC);
	echo json_encode($result);
}

//------------------------------------------------------------------------------------------------
// Retrieves dugga information         
//------------------------------------------------------------------------------------------------
function duggaInformation($pdo) {
	$query = $pdo->prepare("SELECT username, uid FROM user");
	if(!$query->execute()) {
	} else {
		$rows = $query->fetchAll(PDO::FETCH_ASSOC);
		$users = [];
		foreach($rows as $key => $value) {
			$users[$key] =  [	
								"cid" 			=>	"",
								"uid" 			=>	$value['uid'],
								"username"		=>	$value['username'],	
								"quizid"		=>	"",		
								"timestamp"		=>	""
							];
		}
	}

    $result = $GLOBALS['log_db']->query('
		SELECT
			cid,
			uid,
			username,
			quizid,
            timestamp AS timestamp
        FROM duggaLoadLogEntries
        ORDER BY timestamp;
    ')->fetchAll(PDO::FETCH_ASSOC);

	foreach($result as $value) {
		$key = array_search($value['uid'], array_column($users, 'uid'));
		if($key === FALSE) { 
			unset($users[$key]);
		} 
	}

    echo json_encode(array_merge($users,$result));
}
 
//------------------------------------------------------------------------------------------------
// Retrieves codeviewer information        
//------------------------------------------------------------------------------------------------
 
function codeviewerInformation($pdo){
	$query = $pdo->prepare("SELECT username, uid FROM user");
	if(!$query->execute()) {
	} else {
		$rows = $query->fetchAll(PDO::FETCH_ASSOC);
		$users = [];
		foreach($rows as $key => $value) {
			$users[$key] =  [	
								"cid" 			=>	"",
								"uid" 			=>	$value['uid'],
								"username"		=>	$value['username'],		
								"exampleid"		=>	"",
								"timestamp"		=>	""
							];
		}
	}

    $result = $GLOBALS['log_db']->query('
		SELECT
			courseid AS cid,
			uid,
			username,
			exampleid,
            timestamp AS timestamp
        FROM exampleLoadLogEntries
        ORDER BY timestamp;
    ')->fetchAll(PDO::FETCH_ASSOC);

	foreach($result as $value) {
		$key = array_search($value['uid'], array_column($users, 'uid'));
		if($key === TRUE) { 
			unset($users[$key]);
		}
	}

    echo json_encode(array_merge($users,$result));
}
 
//------------------------------------------------------------------------------------------------
// Retrieves sectioned log information      
//------------------------------------------------------------------------------------------------
 
function sectionedInformation($pdo) {
	$query = $pdo->prepare("SELECT username, uid FROM user");
	if(!$query->execute()) {
	} else {
		$rows = $query->fetchAll(PDO::FETCH_ASSOC);
		$users = [];
		foreach($rows as $key => $value) {
			$users[$key] =  [	
								"uid" 			=>	$value['uid'],
								"username"		=>	$value['username'],								
								"refer"		=>	"",
								"timestamp"	=>	""
							];
		}
	}

    $result = $GLOBALS['log_db']->query('
       SELECT
		   userid AS uid,
		   username,
		   refer,
		   timestamp 
	   FROM userHistory
	   WHERE refer LIKE "%sectioned%"
	   ORDER BY timestamp;
   ')->fetchAll(PDO::FETCH_ASSOC);

	foreach($result as $value) {
		$key = array_search($value['uid'], array_column($users, 'uid'));
		if($key === TRUE) { 
			unset($users[$key]);
		}
	}

    echo json_encode(array_merge($users,$result));
}

//------------------------------------------------------------------------------------------------
// Retrieves courseed log information      
//------------------------------------------------------------------------------------------------
 
function courseedInformation($pdo){
	$query = $pdo->prepare("SELECT username, uid FROM user");
	if(!$query->execute()) {
	} else {
		$rows = $query->fetchAll(PDO::FETCH_ASSOC);
		$users = [];
		foreach($rows as $key => $value) {
			$users[$key] =  [	
								"uid" 			=>	$value['uid'],
								"username"		=>	$value['username'],								
								"refer"		=>	"",
								"timestamp"	=>	""
							];
		}
	}

    $result = $GLOBALS['log_db']->query('
       SELECT
		   userid AS uid,
		   username,
		   refer,
		   timestamp 
	   FROM userHistory
	   WHERE refer LIKE "%courseed%"
	   ORDER BY timestamp;
   ')->fetchAll(PDO::FETCH_ASSOC);

	foreach($result as $value) {
		$key = array_search($value['uid'], array_column($users, 'uid'));
		if($key === TRUE) { 
			unset($users[$key]);
		} 
	}

    echo json_encode(array_merge($users,$result));
}

//------------------------------------------------------------------------------------------------
// Retrieves userLog information      
//------------------------------------------------------------------------------------------------
 
function userLogInformation($pdo){
	$query = $pdo->prepare("SELECT username, uid FROM user");
	if(!$query->execute()) {
	} else {
		$rows = $query->fetchAll(PDO::FETCH_ASSOC);
		$users = [];
		foreach($rows as $key => $value) {
			$users[$key] =  [
								"username"		=>	$value['username'],
								"uid" 			=>	$value['uid'],
								"eventType"		=>	"",
								"description"	=>	"",
								"timestamp"		=>	""
							];
		}
	}

	$result = $GLOBALS['log_db']->query('
		SELECT
			uid,
			username,
			eventType,
			description,
			timestamp 
		FROM userLogEntries
		ORDER BY timestamp;
	')->fetchAll(PDO::FETCH_ASSOC);

	foreach($result as $value) {
		$key = array_search($value['uid'], array_column($users, 'uid'));
		if($key === TRUE) { 
			unset($users[$key]);
		}
	}

    echo json_encode(array_merge($users,$result));
}

//------------------------------------------------------------------------------------------------
// Retrieves page information      
//------------------------------------------------------------------------------------------------
 
function pageInformation(){
    $dugga= $GLOBALS['log_db']->query('
		SELECT
			refer,
			substr(
				refer, 
				INSTR(refer, "courseid=")+9, 
				INSTR(refer, "&coursename=")-18 - INSTR(refer, "courseid=")+9
			) courseid,
			COUNT(*) * 100.0 / (SELECT COUNT(*) FROM userHistory WHERE refer LIKE "%showDugga%") AS percentage,
			COUNT(*) AS pageLoads
		FROM 
			userHistory
		WHERE 
			refer LIKE "%showDugga%"
		GROUP BY 
			courseid;
		ORDER BY 
			percentage DESC;
	')->fetchAll(PDO::FETCH_ASSOC);
	
	$codeviewer = $GLOBALS['log_db']->query('
		SELECT
			refer,
			substr(
				refer, 
				INSTR(refer, "courseid=")+9, 
				INSTR(refer, "&coursename=")-18 - INSTR(refer, "courseid=")+9
			) courseid,
			COUNT(*) * 100.0 / (SELECT COUNT(*) FROM userHistory WHERE refer LIKE "%codeviewer%") AS percentage,
			COUNT(*) AS pageLoads
		FROM 
			userHistory
		WHERE 
			refer LIKE "%codeviewer%"
		GROUP BY 
			courseid;
		ORDER BY 
			percentage DESC;
	')->fetchAll(PDO::FETCH_ASSOC);
 
	$sectioned = $GLOBALS['log_db']->query('
		SELECT
			refer,
			substr(
				refer, 
				INSTR(refer, "courseid=")+9, 
				INSTR(refer, "&coursename=")-18 - INSTR(refer, "courseid=")+9
			) courseid,
			COUNT(*) * 100.0 / (SELECT COUNT(*) FROM userHistory WHERE refer LIKE "%sectioned%") AS percentage,
			COUNT(*) AS pageLoads
		FROM 
			userHistory
		WHERE 
			refer LIKE "%sectioned%"
		GROUP BY 
			courseid;
		ORDER BY 
			percentage DESC;
	')->fetchAll(PDO::FETCH_ASSOC);

	$courseed = $GLOBALS['log_db']->query('
		SELECT
			refer,
			COUNT(*) AS pageLoads
		FROM 
			userHistory
		WHERE 
			refer LIKE "%courseed%"
	')->fetchAll(PDO::FETCH_ASSOC);
	
	$fileed = $GLOBALS['log_db']->query('
		SELECT
			refer,
			COUNT(*) AS pageLoads
		FROM 
			userHistory
		WHERE 
			refer LIKE "%fileed%"
	')->fetchAll(PDO::FETCH_ASSOC);

	$resulted = $GLOBALS['log_db']->query('
		SELECT
			refer,
			COUNT(*) AS pageLoads
		FROM 
			userHistory
		WHERE 
			refer LIKE "%resulted%"
	')->fetchAll(PDO::FETCH_ASSOC);

	$analytic = $GLOBALS['log_db']->query('
		SELECT
			refer,
			COUNT(*) AS pageLoads
		FROM 
			userHistory
		WHERE 
			refer LIKE "%analytic%"
	')->fetchAll(PDO::FETCH_ASSOC);

	$contribution = $GLOBALS['log_db']->query('
	SELECT
		refer,
		COUNT(*) AS pageLoads
	FROM 
		userHistory
	WHERE 
		refer LIKE "%contribution%"
	')->fetchAll(PDO::FETCH_ASSOC);

	$duggaed = $GLOBALS['log_db']->query('
	SELECT
		refer,
		COUNT(*) AS pageLoads
	FROM 
		userHistory
	WHERE 
		refer LIKE "%duggaed%"
	')->fetchAll(PDO::FETCH_ASSOC);

	$accessed = $GLOBALS['log_db']->query('
	SELECT
		refer,
		COUNT(*) AS pageLoads
	FROM 
		userHistory
	WHERE 
		refer LIKE "%accessed%"
	')->fetchAll(PDO::FETCH_ASSOC);

	$profile = $GLOBALS['log_db']->query('
	SELECT
		refer,
		COUNT(*) AS pageLoads
	FROM 
		userHistory
	WHERE 
		refer LIKE "%profile%"
	')->fetchAll(PDO::FETCH_ASSOC);

	$result = [];
	$result['hits']['dugga'] = $dugga[0];
	$result['hits']['codeviewer'] = $codeviewer[0];
	$result['hits']['sectioned'] = $sectioned[0];
	$result['hits']['courseed'] = $courseed[0]; 
	$result['hits']['fileed'] = $fileed[0];
	$result['hits']['resulted'] = $resulted[0];
	$result['hits']['analytic'] = $analytic[0];
	$result['hits']['contribution'] = $contribution[0];
	$result['hits']['duggaed'] = $duggaed[0];   
	$result['hits']['accessed'] = $accessed[0];
	$result['hits']['profile'] = $profile[0];   


	$result['percentage']['dugga'] = $dugga;
	$result['percentage']['codeviewer'] = $codeviewer;
	$result['percentage']['sectioned'] = $sectioned;
	$result['percentage']['courseed'] = $courseed;

	echo json_encode($result);
}

// Retrieves courseName for courseID     
//------------------------------------------------------------------------------------------------
function resolveCourseID($db){
	$cid = $_POST['cid'];
	$query = $db->prepare("SELECT coursename FROM course WHERE cid='".$cid."'");
	$query->execute();
	$result = $query->fetchAll(PDO::FETCH_ASSOC);
	echo json_encode($result);
}
  
// Retrieves course disk usage
//------------------------------------------------------------------------------------------------
function courseDiskUsage($pdo) {
	$query = $pdo->prepare("SELECT coursename, cid, activeversion, coursecode FROM course");

	if($query->execute()) {
		$rows = $query->fetchAll(PDO::FETCH_ASSOC);
		$course = [];
		foreach($rows as $row => $values) {
			$course[$row] = [
							"coursename"	=> $values['coursename'],
							"cid" 			=> $values['cid'],
							"activeversion" => $values['activeversion'],
							"coursecode" => $values['coursecode'],
							"size" 			=> GetDirectorySize(getcwd() . "/submissions/" . $values['cid'] . "/" . $values['activeversion']),
							"sizeReadable" 	=> convertBytesToHumanreadable(GetDirectorySize(getcwd() . "/submissions/" . $values['cid'] . "/" . $values['activeversion'])),
	
						 ];
		}
	
		print_r(json_encode($course));
	}
}