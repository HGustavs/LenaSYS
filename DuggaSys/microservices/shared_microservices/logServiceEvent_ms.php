<?php

/* 
 * logServiceEvent Microservice
 * 
 * */

include_once('../../../Shared/sessions.php');

/* POST parameters
 Example of parameters for starting a service
$uuid can be retrieved with getOP('log_uuid');
$eventType uses the class EventTypes e.g. EventTypes::ServiceServerStart
$service contains the name of the service e.g. 'createNewCourse_ms.php'
$info contains the parameters to the microservice that is starting
	$info="opt: ".$opt." courseid: ".$courseid." coursevers: ".$coursevers." coursename: ".$coursename;
$userid can be retrieved using getUid_ms()
$timestamp is not necessary, it will be provided by the function if it is left empty
*/
function logServiceEvent_ms($uuid, $eventType, $service, $userid, $info, $timestamp = null) {
	if (strcmp($timestamp,"UNK")==0) {
		$timestamp = round(microtime(true) * 1000);
	}
	try {
		//LenaSYS/log/loglena6.db
		$db_path = "../../../log/loglena6.db";
		$log_db = new PDO('sqlite:'.$db_path);
		$log_db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		try {
			// Execute the statement
			$query = $log_db->prepare('INSERT INTO serviceLogEntries (id,uuid, eventType, service, timestamp, userAgent, operatingSystem, browser, userid, info, referer, IP) VALUES (:id,:uuid, :eventType, :service, :timestamp, :userAgent, :operatingSystem, :browser, :userid, :info, :referer, :IP)');
			$query->bindParam(':id',$id);
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
			echo " Executed logging query ";
		} catch (PDOException $e) {
			echo "error executing query: " . $e->getMessage();
		}
	} catch(PDOException $e) {
		echo "error declaring pdo";
	}
}

//Retrieve client's browser
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
// retrieve client's OS
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

?>
