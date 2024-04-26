<?php

date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../sharedMicroservices/getUid_ms.php";
include_once "../sharedMicroservices/retrieveUsername_ms.php";

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


// Check access
if (hasAccess($userid, $cid, 'w') || hasAccess($userid, $cid, 'st') || isSuperUser($userid) || hasAccess($userid, $cid, 'sv')) {
    $hasAccess = true;
} else {
    $hasAccess = false;
}

// Service 
if ((strcmp($opt, "SAVEFILE") === 0)) {
    if (checklogin()) {
        if ($hasAccess) {
            if (!($kind == 2 && !(isSuperUser($userid)))) {
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
                    
                // Check if file exists at set path
                if (file_exists($currcwd)) {
                    // Update the database if the save is successful
                    if (file_put_contents($currcwd, html_entity_decode($contents))) {
                        $fileSize = filesize($currcwd);
        
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
                    } else {
                        $debug = "Something went wrong when updating the file";
                    }
                } else {
                    $debug = "No such file exists";
                }
            } else {
                $debug = "Access denied: Only superusers can update global files";
            }
        } else {
            $debug = "Access denied";
        }
    } else {
        $debug = "You need to be logged in to update a file";
    }
} else{
    $debug = "You can only update a file through the file editor";
}

if (is_null($debug)) 
    $debug = "File successfully updated";

echo json_encode($debug);
