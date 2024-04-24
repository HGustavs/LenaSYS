<?php

date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../sharedMicroservices/getUid_ms.php";

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

/*Gets username based on uid, USED FOR LOGGING.
  Will eventually be replaced with a microservice call*/ 
$query = $pdo->prepare( "SELECT username FROM user WHERE uid = :uid");
$query->bindParam(':uid', $userid);
$query-> execute();

// This while is only performed if userid was set through _SESSION['uid'] check above, a guest will not have it's username set, USED FOR LOGGING
while ($row = $query->fetch(PDO::FETCH_ASSOC)){
	$username = $row['username'];
}

// Permission checks
if (hasAccess($userid, $cid, 'w') || hasAccess($userid, $cid, 'st') || isSuperUser($userid) || hasAccess($userid, $cid, 'sv')) {
    $hasAccess = true;
} else {
    $hasAccess = false;
}

if (!(checklogin() && $hasAccess))
    return;

if ($kind == 2 && (isSuperUser($userid) == false))
    return;

if (!(strcmp($opt, "SAVEFILE") === 0))
    return;

// Change path to file depending on filename and filekind
chdir("../../../");
$currcwd = getcwd();

switch ($kind) {
    case 2:
        $currcwd .= "/courses/global/" . $filename;
        // Logging for global files
        $description="Global"." ".$filename;
        logUserEvent($userid, $username, EventTypes::EditFile, $description);
        break;
    case 3:
        $currcwd .= "/courses/" . $cid . "/" . $filename;
        // Logging for course local files
        $description="CourseLocal"." ".$filename;
        logUserEvent($userid, $username, EventTypes::EditFile, $description);            
        break;
    case 4:
        $currcwd .= "/courses/" . $cid . "/" . $coursevers . "/" . $filename;
        // Logging for version local files
        $description="VersionLocal"." ".$filename;
        logUserEvent($userid, $username, EventTypes::EditFile, $description);
        break;
}

// Only edit the file if it already exists
if (file_exists($currcwd)) {
    // Update the database if the save was successful
    if (file_put_contents($currcwd, html_entity_decode($contents))) {
        $fileSize = filesize($currcwd);

        if ($kind == 2) {
            $query = $pdo->prepare("UPDATE fileLink SET filesize=:filesize, uploaddate=NOW() WHERE kind=:kindid AND filename=:filename;");
        } else if ($kind == 3) {
            $query = $pdo->prepare("UPDATE fileLink SET filesize=:filesize, uploaddate=NOW() WHERE cid=:cid AND kind=:kindid AND filename=:filename;");
            $query->bindParam(':cid', $cid);
        } else if ($kind == 4) {
            $query = $pdo->prepare("UPDATE fileLink SET filesize=:filesize, uploaddate=NOW() WHERE vers=:vers AND cid=:cid AND kind=:kindid AND filename=:filename;");
            $query->bindParam(':cid', $cid);
            $query->bindParam(':vers', $coursevers);
        }

        $query->bindParam(':filename', $filename);
        $query->bindParam(':filesize', $fileSize);
        $query->bindParam(':kindid', $kind);

        if (!$query->execute()) {
            $error = $query->errorInfo();
            echo "Error updating filesize and uploaddate: " . $error[2];
        }
    } else {
        echo "Something went wrong when updating the file, Try again?";
        $error = True;
    }
}