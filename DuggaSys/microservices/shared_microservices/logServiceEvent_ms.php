<?php

/* 
 * logServiceEvent Microservice
 * Typically it can be used to log when a service starts and when it ends by adding
 * EventTypes::ServiceServerStart or EventTypes::ServiceServerEnd as the eventType parameter
 * */

include_once ("../../../Shared/basic.php");
include('../shared_microservices/getUid_ms.php');


// POST parameters
$uuid=getOP('log_uuid');
$eventType=getOP('eventtype');
$service=getOP('service');
$info=getOP('info');
$timestamp=getOP('timestamp');
$userid=getUid();

// Only for testing purposes, remove before integration
echo "UUID: " . $uuid;
echo "eventType: " . $eventType;
echo "Service: " . $service;
echo "Info: " . $info;
echo "timestamp: " . $timestamp;
echo "userid: " . $userid;

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

?>
