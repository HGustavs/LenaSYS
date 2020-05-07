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
				generalStats();
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
				fileInformation();
				break;
			case 'duggaInformation':
                duggaInformation();
                break;
            case 'codeviewerInformation':
                codeviewerInformation();
                break;
            case 'duggaPercentage':
                duggaPercentage();
                break;
            case 'codeviewerPercentage':
                codeviewerPercentage();
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
function generalStats() {
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


	$generalStats = [];
	$generalStats['stats']['loginFails'] = $LoginFail[0];
	$generalStats['stats']['numOnline'] = count($activeUsers);
	$generalStats['stats']['activeUsers'] = $activeUsers;

	// Disk space calculation
	$total = disk_total_space(".");
	$current = disk_free_space(".");
	$totalFreePercentage = ($current - 0) * 100 / ($total - $current);
	$totalInUsePercentage = ($totalFreePercentage-100) * -1;
	$generalStats['disk']['free'] = convertBytesToHumanreadable(disk_free_space("."));
	$generalStats['disk']['freePercent'] = $totalFreePercentage;
	$generalStats['disk']['total'] = convertBytesToHumanreadable(disk_total_space("."));
	$generalStats['disk']['totalPercent'] = $totalInUsePercentage;

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
		HAVING tries > 10;
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

function fileInformation(){
	$result = $GLOBALS['log_db']->query('
		SELECT
			uid AS userName,
			timestamp AS timestamp,
			eventType AS eventType,
			description AS description
		FROM userLogEntries
		WHERE eventType = '.EventTypes::AddFile.' OR eventType = '.EventTypes::EditFile.'
		ORDER BY timestamp;
	')->fetchAll(PDO::FETCH_ASSOC);
	echo json_encode($result);
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
function duggaInformation(){
    $result = $GLOBALS['log_db']->query('
        SELECT
            COUNT(*) AS pageLoads,
            timestamp AS timestamp
        FROM duggaLoadLogEntries
        ORDER BY timestamp;
    ')->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($result);
}
 
//------------------------------------------------------------------------------------------------
// Retrieves codeviewer information        
//------------------------------------------------------------------------------------------------
 
function codeviewerInformation(){
    $result = $GLOBALS['log_db']->query('
        SELECT
            COUNT(*) AS pageLoads,
            timestamp AS timestamp
        FROM exampleLoadLogEntries
        ORDER BY timestamp;
    ')->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($result);
}
 
//------------------------------------------------------------------------------------------------
// Retrieves dugga percentage          
//------------------------------------------------------------------------------------------------
 
function duggaPercentage(){
    $result = $GLOBALS['log_db']->query('
        SELECT
            cid AS courseid,
            COUNT(*) * 100.0 / (SELECT COUNT(*) FROM duggaLoadLogEntries WHERE type = '.EventTypes::pageLoad.') AS percentage
        FROM duggaLoadLogEntries
        GROUP BY courseid
        ORDER BY percentage DESC;
    ')->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($result);
}
 
//------------------------------------------------------------------------------------------------
// Retrieves example percentage        
//------------------------------------------------------------------------------------------------
 
function codeviewerPercentage(){
    $result = $GLOBALS['log_db']->query('
        SELECT
            courseid,
            COUNT(*) * 100.0 / (SELECT COUNT(*) FROM exampleLoadLogEntries WHERE type = '.EventTypes::pageLoad.') AS percentage
        FROM exampleLoadLogEntries
        GROUP BY courseid
        ORDER BY percentage DESC;
    ')->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($result);
}