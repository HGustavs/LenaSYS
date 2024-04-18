<?php
date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";

// Connect to database and start session
pdoConnect();
session_start();

// Global variables
$fid = getOP('fid');
$cid = getOP('cid');
$kind = getOP('kind');
$filename = getOP('filename');
$coursevers = getOP('coursevers');

// Get the path
$query = $pdo->prepare("SELECT path from fileLink WHERE fileid = :fid");
$query->bindParam(':fid', $fid);
$result = $query->execute();

if($row = $query->fetch(PDO::FETCH_ASSOC)){
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
    } else {
        $debug = "The file was deleted.";
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

echo json_encode($debug);
