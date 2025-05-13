<?php

//---------------------------------------------------------------------------------------------------------------
// updateFileLink_ms
//---------------------------------------------------------------------------------------------------------------
// Microservice that writes to files and updates their filesize in fileLink
//---------------------------------------------------------------------------------------------------------------

header('Content-Type: application/json');

date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../sharedMicroservices/getUid_ms.php";
include_once "../../../DuggaSys/microservices/curlService.php";
//include_once "./retrieveFileedService_ms.php";

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

// Microservice for retrieveUsername
$data = callMicroserviceGET("sharedMicroservices/retrieveUsername_ms.php");
$username = $data['username'] ?? 'unknown';

$debug="NONE!";
$log_uuid = getOP('log_uuid');

// Get the path (currently not used)
/*
$query = $pdo->prepare("SELECT path from fileLink WHERE kind=:kindid AND filename=:filename;");
$query->bindParam(':filename', $filename);
$query->bindParam(':kindid', $kind);
$result = $query->execute();
if($row = $query->fetch(PDO::FETCH_ASSOC)){
    $path = $row['path'];
} else {
    $path = "Lokal";
}
*/

// Check access
if (hasAccess($userid, $cid, 'w') || hasAccess($userid, $cid, 'st') || isSuperUser($userid) || hasAccess($userid, $cid, 'sv')) {
    $hasAccess = true;
} else {
    $hasAccess = false;
}

if (strcmp($opt, "SAVEFILE") !== 0) {
    $debug = "Wrong opt";
    $retrieveArray = callMicroserviceGET(
        "sectionedService/retrieveFileedService_ms.php?" .
        "courseid=" . urlencode($cid) .
        "&coursevers=" . urlencode($coursevers) .
        "&fid=" . urlencode($fid) .
        "&opt=" . urlencode($opt) .
        "&log_uuid=" . urlencode($log_uuid) .
        "&kind=" . urlencode($kind)
    );
    echo json_encode($retrieveArray);
    return;
}

if (!checklogin()) {
    $debug = "You need to be logged in to update a file";
    $retrieveArray = callMicroserviceGET(
        "sectionedService/retrieveFileedService_ms.php?" .
        "courseid=" . urlencode($cid) .
        "&coursevers=" . urlencode($coursevers) .
        "&fid=" . urlencode($fid) .
        "&opt=" . urlencode($opt) .
        "&log_uuid=" . urlencode($log_uuid) .
        "&kind=" . urlencode($kind)
    );
    echo json_encode($retrieveArray);
    return;
}

if (!$hasAccess) {
    $debug = "Access denied";
    $retrieveArray = callMicroserviceGET(
        "sectionedService/retrieveFileedService_ms.php?" .
        "courseid=" . urlencode($cid) .
        "&coursevers=" . urlencode($coursevers) .
        "&fid=" . urlencode($fid) .
        "&opt=" . urlencode($opt) .
        "&log_uuid=" . urlencode($log_uuid) .
        "&kind=" . urlencode($kind)
    );
    echo json_encode($retrieveArray);
    return;
}

if ($kind == 2 && !(isSuperUser($userid))) {
    $debug = "Access denied: Only superusers can update global files";
    $retrieveArray = callMicroserviceGET(
        "sectionedService/retrieveFileedService_ms.php?" .
        "courseid=" . urlencode($cid) .
        "&coursevers=" . urlencode($coursevers) .
        "&fid=" . urlencode($fid) .
        "&opt=" . urlencode($opt) .
        "&log_uuid=" . urlencode($log_uuid) .
        "&kind=" . urlencode($kind)
    );
    echo json_encode($retrieveArray);
    return;
}

// Change path to file depending on filename and kind
chdir("../../../");
$currcwd = getcwd();

switch ($kind) {
    case 2:
        $currcwd .= "/courses/global/" . $filename;
        $description="Global"." ".$filename;
        break;
    case 3:
        /*
        if (is_null($path)) {
            $currcwd .= "/courses/" . $cid . "/" . $filename;            
        }
        else {
            $currcwd .= "/courses/" . $cid . "/Github/" . $path;      
        
        }
        */
        $currcwd .= "/courses/" . $cid . "/" . $filename;  

        $description="CourseLocal"." ".$filename;
        break;
    case 4:
        $currcwd .= "/courses/" . $cid . "/" . $coursevers . "/" . $filename;
        $description="VersionLocal"." ".$filename;
        break;
}

// Check if file exists at current working directory
if (!file_exists($currcwd)) {
    $debug = "No such file exists";
    $retrieveArray = callMicroserviceGET(
        "sectionedService/retrieveFileedService_ms.php?" .
        "courseid=" . urlencode($cid) .
        "&coursevers=" . urlencode($coursevers) .
        "&fid=" . urlencode($fid) .
        "&opt=" . urlencode($opt) .
        "&log_uuid=" . urlencode($log_uuid) .
        "&kind=" . urlencode($kind)
    );
    echo json_encode($retrieveArray);
    return;
}

// Try writing to file
if (!file_put_contents($currcwd, html_entity_decode($contents))) {
    $debug = "Something went wrong when updating the file";
    $retrieveArray = callMicroserviceGET(
        "sectionedService/retrieveFileedService_ms.php?" .
        "courseid=" . urlencode($cid) .
        "&coursevers=" . urlencode($coursevers) .
        "&fid=" . urlencode($fid) .
        "&opt=" . urlencode($opt) .
        "&log_uuid=" . urlencode($log_uuid) .
        "&kind=" . urlencode($kind)
    );
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

$retrieveArray = callMicroserviceGET(
    "sectionedService/retrieveFileedService_ms.php?" .
    "courseid=" . urlencode($cid) .
    "&coursevers=" . urlencode($coursevers) .
    "&fid=" . urlencode($fid) .
    "&opt=" . urlencode($opt) .
    "&log_uuid=" . urlencode($log_uuid) .
    "&kind=" . urlencode($kind)
);
echo json_encode($retrieveArray);
