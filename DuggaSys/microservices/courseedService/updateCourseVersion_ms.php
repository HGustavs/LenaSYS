<?php

// updateCourseVersion_ms - Edit a specific course version

date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "../curlService.php";

// Connect to database and start session.
pdoConnect();
session_start();

$opt=getOP('opt');
$cid=getOP('courseid');
$courseid=getOP('courseid');
$versid=getOP('versid');
$versname=getOP('versname');
$copycourse=getOP('copycourse');
$coursecode=getOP('coursecode');
$coursename=getOP('coursename');
$coursenamealt=getOP('coursenamealt');
$makeactive=getOP('makeactive');
$startdate=getOP('startdate');
$enddate=getOP('enddate');
$motd=getOP('motd');
$log_uuid=getOP('log_uuid');

$userid = callMicroserviceGET("sharedMicroservices/getUid_ms.php");

// Microservice for retrieveUsername
$data = callMicroserviceGET("sharedMicroservices/retrieveUsername_ms.php");
$username = $data['username'] ?? 'unknown';

$debug="NONE!";

// Permission checks
$haswrite = hasAccess($userid, $cid, 'w');
$isSuperUserVar = isSuperUser($userid);
$studentTeacher = hasAccess($userid, $cid, 'st');
$hasAccess = $haswrite || $isSuperUserVar;

header('Content-Type: application/json');

$dataToSend = [
	'ha' => $hasAccess,
	'debug' => $debug,
	'LastCourseCreated' => null,
	'isSuperUserVar' => $isSuperUserVar
];

if (!checklogin()){
    $dataToSend['debug'] = "User not logged in";
    echo callMicroservicePOST("courseedService/retrieveCourseedService_ms.php", $dataToSend, true);
    return;
}

if (!($haswrite || $isSuperUserVar || $studentTeacher)) {
    $dataToSend['debug'] = "Access not granted";
    echo callMicroservicePOST("courseedService/retrieveCourseedService_ms.php", $dataToSend, true);
    return;
}

if (strcmp($opt, "UPDATEVRS") !== 0) {
    $dataToSend['debug'] = "OPT does not match.";
    echo callMicroservicePOST("courseedService/retrieveCourseedService_ms.php", $dataToSend, true);
    return;
}

$query = $pdo->prepare("UPDATE vers SET motd=:motd,versname=:versname,startdate=:startdate,enddate=:enddate WHERE cid=:cid AND coursecode=:coursecode AND vers=:vers;");
$query->bindParam(':cid', $cid);
$query->bindParam(':coursecode', $coursecode);
$query->bindParam(':vers', $versid);
$query->bindParam(':versname', $versname);
$query->bindParam(':motd', $motd);

if($startdate=="UNK"){
	$query->bindValue(':startdate', null,PDO::PARAM_INT);
}else {
	$query->bindParam(':startdate', $startdate);
}
if($enddate=="UNK"){ 
	$query->bindValue(':enddate', null,PDO::PARAM_INT);
}else {
	$query->bindParam(':enddate', $enddate);
}
if (!$query->execute()) {
	$error = $query->errorInfo();
	$debug = "Error updating entries\n" . $error[2];
}
// Check if selected course version should be set as active
if ($makeactive == 3) {
    $postData = [
        'cid' => $courseid,
        'versid' => $versid
    ];
    
    $response = callMicroservicePOST("sharedMicroservices/setAsActiveCourse_ms.php", $postData, true);
    $link = json_decode($response, true);
}

echo callMicroservicePOST("courseedService/retrieveCourseedService_ms.php", $dataToSend, true);
