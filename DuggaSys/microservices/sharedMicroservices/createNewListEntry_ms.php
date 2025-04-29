<?php
include_once "./retrieveUsername_ms.php";

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
	$username = retrieveUsername($pdo);
	logUserEvent($userid ,$username,EventTypes::SectionItems, $entryname);
    }

    $debug = "NONE!";
    if (!$query->execute()) {
	$error = $query->errorInfo();
	$debug = "Error updating entries" . $error[2];
    }
    return $debug;

//get values from post
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['cid'],
     $_POST['versid'],
      $_POST['userid'], 
      $_POST['sectname'], 
      $_POST['link'], 
      $_POST['kind'], 
      $_POST['comments'], 
      $_POST['visibility'], 
      $_POST['highscoremode'], 
      $_POST['pos'], 
      $_POST['gradesys'], 
      $_POST['tabs'], 
      $_POST['grptype'])) {
        $courseid = $_POST['cid'];
        $coursevers = $_POST['versid'];
        $userid = $_POST['userid'];
        $sectname = $_POST['sectname'];
        $link = $_POST['link'];
        $kind = $_POST['kind'];
        $comments = $_POST['comments'];
        $visibility = $_POST['visibility'];
        $highscoremode = $_POST['highscoremode'];
        $pos = $_POST['pos'];
        $gradesys = $_POST['gradesys'];
        $tabs = $_POST['tabs'];
        $grptype = $_POST['grptype'];

    }
}

//set active course in database
$query = $pdo->prepare("INSERT INTO listentries 
(cid, versid, userid, sectname, link, kind, comments, visibility, highscoremode, pos, gradesys, tabs, grptype)
VALUES
(:cid, :versid, :userid, :sectname, :link, :kind, :comments, :visibility, :highscoremode, :pos, :gradesys, :tabs, :grptype)");

$query->bindParam(':cid', $courseid);
$query->bindParam(':versid', $coursevers);
$query->bindParam(':userid', $userid);
$query->bindParam(':sectname', $sectname);
$query->bindParam(':link', $link);
$query->bindParam(':kind', $kind);
$query->bindParam(':comments', $comments);
$query->bindParam(':visibility', $visibility);
$query->bindParam(':highscoremode', $highscoremode);
$query->bindParam(':pos', $pos);
$query->bindParam(':gradesys', $gradesys);
$query->bindParam(':tabs', $tabs);
$query->bindParam(':grptype', $grptype);

$query->execute();
}
