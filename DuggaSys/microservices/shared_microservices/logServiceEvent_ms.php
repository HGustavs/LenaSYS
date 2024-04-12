<?php

/* 
 * logServiceEvent Microservice
 * EventTypes::ServiceServerStart or EventTypes::ServiceServerEnd as the eventType parameter
 * to log a service start or end
 * */

include_once ("../../../Shared/basic.php");
include('../shared_microservices/getUid_ms.php');


// POST parameters
$uuid=getOP('log_uuid');
$eventType=getOP('eventtype');
$service=getOP('service');
$info=getOP('info');
$timestamp=getOP('timestamp');
$userid=getOP('userid');

if (strcmp($timestamp,"UNK")==0) {
	$timestamp = round(microtime(true) * 1000);
}

try {
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
	} catch (PDOException $e) {
		echo "error executing query: " . $e->getMessage();
	}
} catch(PDOException $e) {
	echo "error declaring pdo";
}


?>
