<?php

// This microservice can be called to simply get the contents return by retrieveCourseedService_ms.php

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "./retrieveCourseedService_ms.php";
include_once "../sharedMicroservices/getUid_ms.php";


// Connect to database and start session
pdoConnect();
session_start();

$userid=getUid();
$ha = null;
$isSuperUserVar=false;
$debug = "NONE!";
// Login is checked
if (checklogin()) {
	$isSuperUserVar = isSuperUser($userid);
	$ha = $isSuperUserVar;
}

echo json_encode(retrieveCourseedService($pdo, $ha, $debug, null, $isSuperUserVar));

