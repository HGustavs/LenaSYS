<?php
include_once "retrieveUsername_ms.php";

function createNewListentrie($pdo, $listEntry){
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

	// Logging for newly added items, USE retrieveUsername() when it is implemented. UNK temporary
    $username = retrieveUsername();
	logUserEvent($listEntry['userid'],$username,EventTypes::SectionItems, $listEntry['entryname']);
    }

    if (!$query->execute()) {
	$error = $query->errorInfo();
	$debug = "Error updating entries" . $error[2];
    }
}
