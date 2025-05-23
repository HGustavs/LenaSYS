<?php
/********************************************************************************

   CreateMOTD_ms.php

*********************************************************************************

    This micro service is called upon when the message of the day is changed in the page associated with courseed.
    The user must be a super user to be able to do this!

-------------==============######## Documentation End ###########==============-------------
*/

date_default_timezone_set("Europe/Stockholm");


include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "../curlService.php";

// Connect to database and start session.
pdoConnect();
session_start();

$opt=getOP('opt');
$motd=getOP('motd');
$readonly=getOP('readonly');
$debug="NONE!";
$userid = callMicroserviceGET("sharedMicroservices/getUid_ms.php");
$ha = null;
$isSuperUserVar = false;

// Login is checked
if (checklogin()) {
	$isSuperUserVar = isSuperUser($userid);
	$ha = $isSuperUserVar;
}
// Updates the message of the day 
if($ha) {
    $query = $pdo->prepare("INSERT INTO settings (motd,readonly) VALUES (:motd, :readonly);");
    $query->bindParam(':motd', $motd);
    
    if($readonly == "UNK"){
        $readonly=0;
    }
    
    $query->bindParam(':readonly', $readonly);

    if(!$query->execute()) {
        $error=$query->errorInfo();
        $debug="Error updating entries\n".$error[2];
    }
}

$dataToSend = [
	'ha' => $ha,
	'debug' => $debug,
	'LastCourseCreated' => null,
	'isSuperUserVar' => $isSuperUserVar
];

header('Content-Type: application/json');
echo callMicroservicePOST("courseedService/retrieveCourseedService_ms.php", $dataToSend, true);
