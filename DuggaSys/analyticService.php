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
	$result = $log_db->query('
		SELECT
			COUNT(*) AS loginFails
		FROM
			userLogEntries
		WHERE
			eventType = '.EventTypes::LoginFail.';
	')->fetchAll(PDO::FETCH_ASSOC);
	echo json_encode($result[0]);
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
			eventType = '.EventTypes::ServiceClientStart.'
			AND datetime(timeStamp/1000, \'unixepoch\') BETWEEN ? AND ?
		GROUP BY service, dateTime;
	');
	$query->execute(array($dateGroupFormat, $start, $end));
	$result = $query->fetchAll(PDO::FETCH_ASSOC);
	echo json_encode($result);
}

//------------------------------------------------------------------------------------------------
// Retrieves OS percentage		
//------------------------------------------------------------------------------------------------

function osPercentage(){
	$result = $GLOBALS['log_db']->query('
		SELECT
			operatingSystem,
			COUNT(*) * 100.0 / (SELECT COUNT(*) FROM serviceLogEntries WHERE eventType = '.EventTypes::ServiceClientStart.') AS percentage
		FROM serviceLogEntries
		WHERE eventType = '.EventTypes::ServiceClientStart.'
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
		WHERE uuid NOT IN (SELECT DISTINCT uuid FROM serviceLogEntries WHERE eventType = '.EventTypes::ServiceClientEnd.');
	')->fetchAll(PDO::FETCH_ASSOC);
	echo json_encode($result);
}