<?php

/* 
 * logServiceEvent Microservice
 * EventTypes::ServiceServerStart or EventTypes::ServiceServerEnd as the eventType parameter
 * to log a service start or end
 * */

include_once ("../../../Shared/basic.php");


// POST parameters
$uuid=getOP('log_uuid');
$eventType=getOP('eventtype');
$service=getOP('service');
$info=getOP('info');
$timestamp=getOP('timestamp');
$userid=getOP('userid');

logServiceEvent($uuid, $eventType, $service, $userid, $info, $timestamp);

?>
