<?php

//---------------------------------------------------------------------------------------------------------------
// updateFileLink_ms
//---------------------------------------------------------------------------------------------------------------
// Microservice that handles writing to files and updates filesize in fileLink
//---------------------------------------------------------------------------------------------------------------

date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../sharedMicroservices/getUid_ms.php";
include_once "../sharedMicroservices/retrieveUsername_ms.php";
include_once "retrieveFileedService_ms.php";

// Connect to database and start session
pdoConnect();
session_start();

// Global variables
$cid = getOP('cid');
$opt = getOP('opt');
$coursevers = getOP('coursevers');
$filename = getOP('filename');
$kind = getOP('kind');
$contents = getOP('contents');
$userid = getUid();
$username = retrieveUsername($pdo);
$debug = "NONE!";
$log_uuid = getOP('log_uuid');


// Check access
if (hasAccess($userid, $cid, 'w') || hasAccess($userid, $cid, 'st') || isSuperUser($userid) || hasAccess($userid, $cid, 'sv')) {
    $hasAccess = true;
} else {
    $hasAccess = false;
}

if (strcmp($opt, "SAVEFILE") !== 0) {
    $debug = "You can only update a file through the file editor";
    $retrieveArray = retrieveFileedService($debug, null, $hasAccess, $pdo, $cid, $coursevers, $userid, $log_uuid, $opt, null, $kind);
    echo json_encode($retrieveArray);
    return;
}

if (!checklogin()) {
    $debug = "You need to be logged in to update a file";
    $retrieveArray = retrieveFileedService($debug, null, $hasAccess, $pdo, $cid, $coursevers, $userid, $log_uuid, $opt, null, $kind);
    echo json_encode($retrieveArray);
    return;
}

if (!$hasAccess) {
    $debug = "Access denied";
    $retrieveArray = retrieveFileedService($debug, null, $hasAccess, $pdo, $cid, $coursevers, $userid, $log_uuid, $opt, null, $kind);
    echo json_encode($retrieveArray);
    return;
}

if ($kind == 2 && !(isSuperUser($userid))) {
    $debug = "Access denied: Only superusers can update global files";
    $retrieveArray = retrieveFileedService($debug, null, $hasAccess, $pdo, $cid, $coursevers, $userid, $log_uuid, $opt, null, $kind);
    echo json_encode($retrieveArray);
    return;
}

// Change path to file depending on filename and filekind
chdir("../../../");
$currcwd = getcwd();

switch ($kind) {
    case 2:
        $currcwd .= "/courses/global/" . $filename;
        $description="Global"." ".$filename;
        break;
    case 3:
        $currcwd .= "/courses/" . $cid . "/" . $filename;
        $description="CourseLocal"." ".$filename;     
        break;
    case 4:
        $currcwd .= "/courses/" . $cid . "/" . $coursevers . "/" . $filename;
        $description="VersionLocal"." ".$filename;
        break;
}

// Check if file exists at set path
if (!file_exists($currcwd)) {
    $debug = "No such file exists";
    $retrieveArray = retrieveFileedService($debug, null, $hasAccess, $pdo, $cid, $coursevers, $userid, $log_uuid, $opt, null, $kind);
    echo json_encode($retrieveArray);
    return;
}

// Try writing to file
if (!file_put_contents($currcwd, html_entity_decode($contents))) {
    $debug = "Something went wrong when updating the file";
    $retrieveArray = retrieveFileedService($debug, null, $hasAccess, $pdo, $cid, $coursevers, $userid, $log_uuid, $opt, null, $kind);
    echo json_encode($retrieveArray);
    return;
}  

$fileSize = filesize($currcwd);

// Update filesize
switch ($kind) {
    case 2:
        $query = $pdo->prepare("UPDATE fileLink SET filesize=:filesize, uploaddate=NOW() WHERE kind=:kindid AND filename=:filename;");
        break;
    case 3:
        $query = $pdo->prepare("UPDATE fileLink SET filesize=:filesize, uploaddate=NOW() WHERE cid=:cid AND kind=:kindid AND filename=:filename;");
        $query->bindParam(':cid', $cid);
        break;
    case 4:
        $query = $pdo->prepare("UPDATE fileLink SET filesize=:filesize, uploaddate=NOW() WHERE vers=:vers AND cid=:cid AND kind=:kindid AND filename=:filename;");
        $query->bindParam(':cid', $cid);
        $query->bindParam(':vers', $coursevers);
        break;
}

$query->bindParam(':filename', $filename);
$query->bindParam(':filesize', $fileSize);
$query->bindParam(':kindid', $kind);

if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error updating filesize and uploaddate. Details: " . $error[2];
}

logUserEvent($userid, $username, EventTypes::EditFile, $description);

$retrieveArray = retrieveFileedService($debug, null, $hasAccess, $pdo, $cid, $coursevers, $userid, $log_uuid, $opt, null, $kind);
echo json_encode($retrieveArray);
