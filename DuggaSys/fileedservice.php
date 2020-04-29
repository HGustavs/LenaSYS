<?php
date_default_timezone_set("Europe/Stockholm");

include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";

pdoConnect();
session_start();
if (isset($_SESSION['uid'])) {
    $userid = $_SESSION['uid'];
} else {
    $userid = "1";
}

$cid = getOP('cid');
$opt = getOP('opt');
$coursevers = getOP('coursevers');
$fid = getOP('fid');
$filename = getOP('filename');
$kind = getOP('kind');
$contents = getOP('contents');
$debug = "NONE!";
$studentTeacher = false;

$log_uuid = getOP('log_uuid');
$info = $opt . " " . $cid . " " . $coursevers . " " . $fid . " " . $filename . " " . $kind;
logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "fileedservice.php", $userid, $info);

if (hasAccess($userid, $cid, 'w') || hasAccess($userid, $cid, 'st') || isSuperUser($userid) || hasAccess($userid,$cid, 'sv')) {
    $hasAccess = true;
} else {
    $hasAccess = false;
}
if (hasAccess($userid, $cid, 'st')) {
    $studentTeacher = true;
}
//------------------------------------------------------------------------------------------------
// Services
//------------------------------------------------------------------------------------------------
if (checklogin() && $hasAccess) {
    if ($kind == 2 && isSuperUser($_SESSION['uid'] == false)) return;

    if (strcmp($opt, "DELFILE") === 0 && (hasAccess($userid, $cid, 'w') || isSuperUser($userid))) {
        // Remove file link from database
    if ($kind == 2 && isSuperUser($userid)){
        $querystring = 'DELETE FROM fileLink WHERE fileid=:fid';
        $query = $pdo->prepare($querystring);
        $query->bindParam(':fid', $fid);
        if (!$query->execute()) {
            $error = $query->errorInfo();
            $debug = "Error updating file list " . $error[2];
        }

        chdir("../");
        $currcwd = getcwd();

        if ($kind == 2) {
            $currcwd .= "/courses/global/" . $filename;

            if (file_exists($currcwd))
            unlink($currcwd);
    }
    }
    if($kind != 2){
        $querystring = 'DELETE FROM fileLink WHERE fileid=:fid';
        $query = $pdo->prepare($querystring);
        $query->bindParam(':fid', $fid);
        if (!$query->execute()) {
            $error = $query->errorInfo();
            $debug = "Error updating file list " . $error[2];
        }

        chdir("../");
        $currcwd = getcwd();

        if ($kind == 2) {
            $currcwd .= "/courses/global/" . $filename;
        } else if ($kind == 3) {
            $currcwd .= "/courses/" . $cid . "/" . $filename;
        } else if ($kind == 4) {
            $currcwd .= "/courses/" . $cid . "/" . $vers . "/" . $filename;
        }

        // Unlinks (deletes) a file from the directory given if it exists.
        if (file_exists($currcwd))
            unlink($currcwd);
    }
    } else if (strcmp($opt, "SAVEFILE") === 0) {
        // Change path to file depending on filename and filekind
        chdir("../");
        $currcwd = getcwd();

        if ($kind == 2) {
            $currcwd .= "/courses/global/" . $filename;
        } else if ($kind == 3) {
            $currcwd .= "/courses/" . $cid . "/" . $filename;
        } else if ($kind == 4) {
            $currcwd .= "/courses/" . $cid . "/" . $vers . "/" . $filename;
        }

        // Only edit the file if it already exisiting
        if (file_exists($currcwd)) {
            // Uppdate the database if the save was successful
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
                    $query->bindParam(':vers', $vers);
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
    }
}

//------------------------------------------------------------------------------------------------
// Retrieve Information			
//------------------------------------------------------------------------------------------------

$entries = array();
$files = array();
$lfiles = array();
$gfiles = array();
$access = False;
if (checklogin() && $hasAccess) {
    $query = $pdo->prepare("SELECT fileid,filename,kind, filesize, uploaddate FROM fileLink WHERE ((cid=:cid AND vers is null) OR (cid=:cid AND vers=:vers) OR isGlobal='1') ORDER BY filename;");
    $query->bindParam(':cid', $cid);
    $query->bindParam(':vers', $coursevers);

    if (!$query->execute()) {
        $error = $query->errorInfo();
        $debug = "Error reading files " . $error[2];
    }

    foreach ($query->fetchAll(PDO::FETCH_ASSOC) as $row) {
        // En till foreach om man vill hämta flera objekt i en cell och skicka med till rendercell

        $filekind = $row['kind'];
        $filename = $row['filename'];
        $splitname = explode(".", $filename);
        $extension = $splitname[count($splitname) - 1];
        $splitname = array_slice($splitname, 0, count($splitname) - 1);
        $shortfilename = implode(".", $splitname);

        if ($filekind == 1) {
            $filePath = "UNK";
            $filekindname = "Link";
            $extension = "-";
            $shortfilename = $filename;
        } else if ($filekind == 2) {
            // Global
            $filePath = "../courses/global/" . $filename;
            $filekindname = "Global";
        } else if ($filekind == 3) {
            // Course Local
            $filePath = "../courses/" . $cid . "/" . $filename;
            $filekindname = "Course local";
        } else if ($filekind == 4) {
            // Version Local
            $filePath = "../courses/" . $cid . "/" . $coursevers . "/" . $filename;
            $filekindname = "Version local";
        } else {
            $filePath = "UNK";
            $filekindname = "UNK";
        }
        
        $showTrashcan = false;
        $showEditor = false;

        if(isSuperUser($userid)){
            $showEditor = true;
        } else if($hasAccess && $filekind != 2){
            $showEditor = true;
        }

        if(isSuperUser($userid)){
            $showTrashcan = true;
        } else if(hasAccess($userid, $cid, 'w') && $filekind != 2){
            $showTrashcan = true;
        }

        $entry = array(
            'filename' => json_encode(['filename' => $row['filename'], 'shortfilename' => $shortfilename, "kind" => $filekindname, 'extension' => $extension, 'filePath' => $filePath]),
            'extension' => $extension,
            'kind' => $filekind,
            'filesize' => json_encode(['size' => $row['filesize'], 'kind' => $filekindname]),
            'uploaddate' => $row['uploaddate'],
            'editor' => json_encode(['filePath' => $filePath, 'kind' => $filekind, 'filename' => $filename, 'extension' => $extension, 'showeditor' => $showEditor]),
            'trashcan' => json_encode(['fileid' => $row['fileid'], 'filename' => $row['filename'], 'filekind' => $filekind, 'showtrashcan' => $showTrashcan])
        );

        
        array_push($entries, $entry);
    }

    // Start traversing the filesystem from LenaSYS root
    chdir('../');
    $currcvd = getcwd();
    $dir = $currcvd . "/templates/";

    if (file_exists($dir)) {
        $files = scandir($dir);
        foreach ($files as $value) {
            if (!is_dir($currcvd . "/templates/" . $value)) {
                array_push($gfiles, $value);
            }
        }
    }

    $dir = $currcvd . "/courses/" . $cid . "/";
    if (file_exists($dir)) {
        $gtiles = scandir($dir);
        foreach ($gtiles as $value) {
            if (!is_dir($currcvd . "/courses/" . $cid . "/" . $value)) {
                array_push($lfiles, $value);
            }
        }
    }

    $access = True;
}

$superuser = isSuperUser($userid);
$supervisor = hasAccess($userid, $cid , 'sv');
$waccess = hasAccess($userid, $cid, 'w');

$array = array(
    'entries' => $entries,
    'debug' => $debug,
    'gfiles' => $gfiles,
    'lfiles' => $lfiles,
    'access' => $access,
    'studentteacher' => $studentTeacher,
    'superuser' => $superuser,
    'waccess' => $waccess,
    'supervisor' => $supervisor,
);

echo json_encode($array);
logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "fileedservice.php", $userid, $info);
?>
