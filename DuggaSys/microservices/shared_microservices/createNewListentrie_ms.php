<?php

include_once "../../../Shared/basic.php";
include_once "getUid_ms.php";

date_default_timezone_set("Europe/Stockholm");

// Connect to database and start session
pdoConnect();
session_start();

// Global variables
global $pdo;
$link = getOP('link');
$courseid = getOP('courseid');
$coursevers = getOP('coursevers');
$sectname = getOP('sectname');
$kind = getOP('kind');
$comments = getOP('comments');
$visibility = getOP('visibility');
$highscoremode = getOP('highscoremode');
$pos = getOP('pos');
$grptype = getOP('grptype');
$gradesys = getOP('gradesys');
$tabs = getOP('tabs');

$userid = getUid();

// TODO: the following will be changed to a microservice, as such this should be updated to a microservice call

// *********************** vvvv CHANGE TO MICROSERVICE CALL vvvv ***********************************
// Gets username based on uid, USED FOR LOGGING
$query = $pdo->prepare("SELECT username FROM user WHERE uid = :uid");
$query->bindParam(':uid', $userid);
$query->execute();

// This while is only performed if userid was set through getUid(), a guest will not have it's username set, USED FOR LOGGING
while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
    $username = $row['username'];
}
// *********************** ^^^^ CHANGE TO MICROSERVICE CALL ^^^^ ***********************************


$query = $pdo->prepare("INSERT INTO listentries (cid, vers, entryname, link, kind, pos, visible, creator, comments, gradesystem, highscoremode, groupKind) 
								    VALUES(:cid, :cvs, :entryname, :link, :kind, :pos, :visible, :usrid, :comment, :gradesys, :highscoremode, :groupkind)");

$query->bindParam(':cid', $courseid);
$query->bindParam(':cvs', $coursevers);
$query->bindParam(':usrid', $userid);
$query->bindParam(':entryname', $sectname);
$query->bindParam(':link', $link);
$query->bindParam(':kind', $kind);
$query->bindParam(':comment', $comments);
$query->bindParam(':visible', $visibility);
$query->bindParam(':highscoremode', $highscoremode);
$query->bindParam(':pos', $pos);

if ($kind == 4) {
    $query->bindParam(':gradesys', $gradesys);
} else {
    $query->bindParam(':gradesys', $tabs);
}

if ($grptype != "UNK") {
    $query->bindParam(':groupkind', $grptype);
} else {
    $query->bindValue(':groupkind', null, PDO::PARAM_STR);

    // Logging for newly added items
    logUserEvent($userid, $username, EventTypes::SectionItems, $sectname);
}

if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error updating entries" . $error[2];
}
