<?php
//---------------------------------------------------------------------------------------------------------------
// deleteFileLink_ms - Used when deleting files from a course
//---------------------------------------------------------------------------------------------------------------

header('Content-Type: application/json');

date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
//include_once "./retrieveFileedService_ms.php";
include_once "../curlService.php";

// Connect to database and start session
pdoConnect();
session_start();

// Global variables
$opt = getOP('opt');
$fid = getOP('fid');
$cid = getOP('cid');
$kind = getOP('kind');
$filename = getOP('filename');
$coursevers = getOP('coursevers');
$userid = callMicroserviceGET("sharedMicroservices/getUid_ms.php");
$debug = "NONE!";
$log_uuid = getOP('log_uuid');

// Permission checks
if (hasAccess($userid, $cid, 'w') || hasAccess($userid, $cid, 'st') || isSuperUser($userid) || hasAccess($userid, $cid, 'sv')) {
    $hasAccess = true;
} else {
    $hasAccess = false;
}

if (!(checklogin() && $hasAccess)) {
    $debug = "Access not granted.";
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

if ($kind == 2 && (isSuperUser($userid) == false)) {
    $debug = "Access not granted.";
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

if (!(strcmp($opt, "DELFILE") === 0 && (hasAccess($userid, $cid, 'w') || isSuperUser($userid)))) {
    $debug = "OPT does not match.";
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

// Get the path
$query = $pdo->prepare("SELECT path from fileLink WHERE fileid = :fid");
$query->bindParam(':fid', $fid);
$result = $query->execute();

if ($row = $query->fetch(PDO::FETCH_ASSOC)) {
    $path = $row['path'];
} else {
    $path = "Lokal";
}

//Check if file is in use
$querystring = "SELECT COUNT(*) counted FROM fileLink, box WHERE box.filename = fileLink.filename AND (fileLink.kind = 2 OR fileLink.kind = 3) AND fileLink.fileid=:fid ;";
$query = $pdo->prepare($querystring);
$query->bindParam(':fid', $fid);

if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error getting file list " . $error[2];
}

$result = $query->fetch(PDO::FETCH_OBJ);
$counted = $result->counted;

// Delete a fileLink if 0 counts
if ($counted == 0) {
    $querystring = "DELETE FROM fileLink WHERE fileid=:fid";
    $query = $pdo->prepare($querystring);
    $query->bindParam(':fid', $fid);

    if (!$query->execute()) {
        $error = $query->errorInfo();
        $debug = "Error updating file list " . $error[2];
    }

    // Deletes a file from the given directory
    chdir("../../../");
    $currcwd = getcwd();

    switch ($kind) {
        case 2:
            $currcwd .= "/courses/global/" . $filename;
            break;
        case 3:
            if ($path == null)
                $currcwd .= "/courses/" . $cid . "/" . $filename;
            else
                $currcwd .= "/courses/" . $cid . "/Github/" . $path;
            break;
        case 4:
            $currcwd .= "/courses/" . $cid . "/" . $coursevers . "/" . $filename;
            break;
    }

    if (file_exists($currcwd)) {
        unlink($currcwd);
    }

} else {
    $debug = "This file is part of a code example. Remove it from there before removing the file.";
}

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
