<?php

include_once "../Shared/basic.php";

$uuid = getOP('uuid');
$timestamp = getOP('timestamp');
$service = getOP('service');

logServiceEvent($uuid, EventTypes::ServiceClientEnd, $service, $timestamp);

?>