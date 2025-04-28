<?php
//--------------------------------------------------------------------------
// updateCourseVersion_sectioned_ms.php - Used for editing a course version.
//--------------------------------------------------------------------------

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "./retrieveSectionedService_ms.php";
include_once "../sharedMicroservices/getUid_ms.php";
include_once "../sharedMicroservices/retrieveUsername_ms.php";
include_once "../sharedMicroservices/setAsActiveCourse_ms.php";

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
$username = retrieveUsername($pdo);
$debug = "NONE!";

// Permission checks
$haswrite = hasAccess($userid, $courseid, 'w');
$isSuperUserVar = isSuperUser($userid);
$studentTeacher = hasAccess($userid, $courseid, 'st');

if (!($haswrite || $isSuperUserVar || $studentTeacher)) {
    $debug = "Access not granted";
    $retrieveArray = retrieveSectionedService($debug, $opt, $pdo, $userid, $courseid, null, null);
    echo json_encode($retrieveArray);
    return;
}

if (strcmp($opt, "UPDATEVRS") !== 0) {
    $debug = "OPT does not match.";
    $retrieveArray = retrieveSectionedService($debug, $opt, $pdo, $userid, $courseid, null, null);
    echo json_encode($retrieveArray);
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
    header("Content-Type: application/json");
    
    // Construct the URL to the target microservice
    $baseURL = "https://" . $_SERVER['HTTP_HOST'];
    $url = $baseURL . "/LenaSYS/DuggaSys/microservices/sharedMicroservices/setAsActiveCourse_ms.php";
    $ch = curl_init($url);

    //Configure cURL for POST with required data
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, false);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        'cid' => $courseid,
        'versid' => $versid
    ]));

    // Execute the POST request and close cURL
    curl_exec($ch);
    curl_close($ch);
}

$description = "Course: " . $courseid . ". Version: " . $versid . ".";
logUserEvent($userid, $username, EventTypes::EditCourseVers, $description);

$retrieveArray = retrieveSectionedService($debug, $opt, $pdo, $userid, $courseid, null, null);
echo json_encode($retrieveArray);
