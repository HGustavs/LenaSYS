<?php

include_once "../../../DuggaSys/microservices/curlService.php";

function createNewListentry($pdo, $cid, $coursevers, $userid, $entryname, $link, $kind, $comment, $visible, $highscoremode, $pos, $gradesys, $tabs, $grptype){
    
    //Change position of elements one increment up to make space for insertion.
    $query = $pdo->prepare("UPDATE listentries SET pos = pos+1 WHERE cid = :cid and vers = :cvs and pos >= :pos");
    $query->bindParam(":cid", $cid);
    $query->bindParam(":cvs", $coursevers);
    $query->bindParam(":pos", $pos);
    $query->execute();
    
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
    
    // Microservice retrieveUsername
    $data = callMicroserviceGET("sharedMicroservices/retrieveUsername_ms.php");
    $username = $data['username'] ?? 'unknown';
    
    logUserEvent($userid, $username, EventTypes::SectionItems, $entryname);
    }

    $debug = "NONE!";
    if (!$query->execute()) {
	$error = $query->errorInfo();
	$debug = "Error updating entries" . $error[2];
    }
    return $debug;
}
