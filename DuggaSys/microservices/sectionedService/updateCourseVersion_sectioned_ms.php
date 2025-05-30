<?php
//--------------------------------------------------------------------------
// updateCourseVersion_sectioned_ms.php - Used for editing a course version.
//--------------------------------------------------------------------------

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../sharedMicroservices/getUid_ms.php";
include_once "../curlService.php";

header("Content-Type: application/json");

date_default_timezone_set("Europe/Stockholm");

pdoConnect();
session_start();

$opt = getOP('opt');
$courseid = getOP('courseid');
$coursecode = getOP('coursecode');
$coursevers = getOP('coursevers');
$versid = getOP('versid');
$motd = getOP('motd');
$versname = getOP('versname');
$startdate = getOP('startdate');
$enddate = getOP('enddate');
$makeactive = getOP('makeactive');
$userid = getUid();

// Microservice for retrieveUsername
$data = callMicroserviceGET("sharedMicroservices/retrieveUsername_ms.php");
$username = $data['username'] ?? 'unknown';

$debug = "NONE!";

// Permission checks
$haswrite = hasAccess($userid, $courseid, 'w');
$isSuperUserVar = isSuperUser($userid);
$studentTeacher = hasAccess($userid, $courseid, 'st');

if (!($haswrite || $isSuperUserVar || $studentTeacher)) {
    $debug = "Access not granted";
    $postData = [
        'debug' => $debug,
        'opt' => $opt,
        'uid' => $userid,
        'cid' => $courseid,
        'vers' => null,
        'log_uuid' => null
    ];
    $retrieveArray = callMicroservicePOST("sectionedService/retrieveSectionedService_ms.php", $postData, true );
    echo $retrieveArray;
    return;
}

if (strcmp($opt, "UPDATEVRS") !== 0) {
    $debug = "OPT does not match.";
    $postData = [
        'debug' => $debug,
        'opt' => $opt,
        'uid' => $userid,
        'cid' => $courseid,
        'vers' => null,
        'log_uuid' => null
    ];
    $retrieveArray = callMicroservicePOST("sectionedService/retrieveSectionedService_ms.php", $postData, true );
    echo $retrieveArray;
    return;
}

$query = $pdo->prepare("UPDATE vers SET versname=:versname, startdate=:startdate, enddate=:enddate, motd=:motd WHERE cid=:cid AND coursecode=:coursecode AND vers=:vers;");
$query->bindParam(':cid', $courseid);
$query->bindParam(':coursecode', $coursecode);
$query->bindParam(':vers', $versid);
$query->bindParam(':versname', $versname);
$query->bindParam(':motd', $motd);

if ($startdate != "null")
    $query->bindParam(':startdate', $startdate);
else
    $query->bindValue(':startdate', null, PDO::PARAM_INT);

if ($enddate != "null")
    $query->bindParam(':enddate', $enddate);
else
    $query->bindValue(':enddate', null, PDO::PARAM_INT);

if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error updating entries " . $error[2];
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

$description = "Course: " . $courseid . ". Version: " . $versid . ".";
logUserEvent($userid, $username, EventTypes::EditCourseVers, $description);

$postData = [
    'debug' => $debug,
    'opt' => $opt,
    'uid' => $userid,
    'cid' => $courseid,
    'vers' => null,
    'log_uuid' => null
];

$retrieveArray = callMicroservicePOST("sectionedService/retrieveSectionedService_ms.php", $postData, true );
echo $retrieveArray;
