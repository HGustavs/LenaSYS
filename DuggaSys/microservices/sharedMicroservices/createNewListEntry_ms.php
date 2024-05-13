<?php
include_once "./retrieveUsername_ms.php";

function createNewListentry($pdo, $cid, $coursevers, $userid, $entryname, $link, $kind, $comment, $visible, $highscoremode, $pos, $gradesys, $tabs, $grptype){
    $query = $pdo->prepare("INSERT INTO listentries (cid, vers, entryname, link, kind, pos, visible, creator, comments, gradesystem, highscoremode, groupKind) 
	VALUES(:cid, :cvs, :entryname, :link, :kind, :pos, :visible, :usrid, :comment, :gradesys, :highscoremode, :groupkind)");
    $query->bindParam(':cid', $cid);
    $query->bindParam(':cvs', $coursevers);
    $query->bindParam(':usrid', $userid);
    $query->bindParam(':entryname', $entryname);
    $query->bindParam(':link', $link);
    $query->bindParam(':kind', $kind);
    $query->bindParam(':comment', $comment);
    $query->bindParam(':visible', $visible);
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
	$username = retrieveUsername($pdo);
	logUserEvent($userid ,$username,EventTypes::SectionItems, $entryname);
    }

    if (!$query->execute()) {
	$error = $query->errorInfo();
	$debug = "Error updating entries" . $error[2];
    }
}
