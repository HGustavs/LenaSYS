<?php
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "getUid_ms.php";
include_once "retrieveUsername_ms.php";

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

function createNewListentrie($listEntry){
    $query = $pdo->prepare("INSERT INTO listentries (cid, vers, entryname, link, kind, pos, visible, creator, comments, gradesystem, highscoremode, groupKind) 
	VALUES(:cid, :cvs, :entryname, :link, :kind, :pos, :visible, :usrid, :comment, :gradesys, :highscoremode, :groupkind)");
    $query->bindParam(':cid', $listEntry['cid']);
    $query->bindParam(':cvs', $listEntry['coursevers']);
    $query->bindParam(':usrid', $listEntry['userid']);
    $query->bindParam(':entryname', $listEntry['entryname']);
    $query->bindParam(':link', $listEntry['link']);
    $query->bindParam(':kind', $listEntry['kind']);
    $query->bindParam(':comment', $listEntry['comment']);
    $query->bindParam(':visible', $listEntry['visible']);
    $query->bindParam(':highscoremode', $listEntry['highscoremode']);
    $query->bindParam(':pos', $listEntry['pos']);

    if ($listEntry['kind'] == 4) {
	$query->bindParam(':gradesys', $listEntry['gradesys']);
    } else {
	$query->bindParam(':gradesys', $listEntry['tabs']);
    }

    if ($listEntry['grptype'] != "UNK") {
	$query->bindParam(':groupkind', $listEntry['grptype']);
    } else {
	$query->bindValue(':groupkind', null, PDO::PARAM_STR);

	// Logging for newly added items
	logUserEvent($listEntry['userid'], getUsername($listEntry['userid']), EventTypes::SectionItems, $sectname);
    }

    if (!$query->execute()) {
	$error = $query->errorInfo();
	$debug = "Error updating entries" . $error[2];
    }
}
