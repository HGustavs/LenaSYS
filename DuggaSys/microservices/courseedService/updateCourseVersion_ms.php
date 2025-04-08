<?php

// updateCourseVersion_ms - Edit a specific course version

date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "../sharedMicroservices/getUid_ms.php";
include_once "../sharedMicroservices/retrieveUsername_ms.php";
include_once "./retrieveCourseedService_ms.php";
include_once "../sharedMicroservices/setAsActiveCourse_ms.php";

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

$userid = getUid();
$username = retrieveUsername($pdo);

$debug="NONE!";

// Permission checks
$haswrite = hasAccess($userid, $cid, 'w');
$isSuperUserVar = isSuperUser($userid);
$studentTeacher = hasAccess($userid, $cid, 'st');
$hasAccess = $haswrite || $isSuperUserVar;

if (!checklogin()){
    $debug = "User not logged in";
    $retrieveArray = retrieveCourseedService($pdo,$hasAccess,$debug, null, $isSuperUserVar);
    echo json_encode($retrieveArray);
    return;
}

if (!($haswrite || $isSuperUserVar || $studentTeacher)) {
    $debug = "Access not granted";
    $retrieveArray = retrieveCourseedService($pdo,$hasAccess,$debug, null, $isSuperUserVar);
    echo json_encode($retrieveArray);
    return;
}

if (strcmp($opt, "UPDATEVRS") !== 0) {
    $debug = "OPT does not match.";
    $retrieveArray = retrieveCourseedService($pdo,$hasAccess,$debug, null, $isSuperUserVar);
    echo json_encode($retrieveArray);
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
if ($makeactive == 3) {
    setAsActiveCourse($pdo, $cid, $versid);
}

$retrieveArray = retrieveCourseedService($pdo,$hasAccess,$debug, null, $isSuperUserVar);
echo json_encode($retrieveArray);
