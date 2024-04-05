<?php
/**
 * Handles creation of new items on a course, not just for code examples (as the name would suggest)
 * I presume that the title of the file is for consistency with the legacy system... Hey, I just work here....
 */

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../../../../coursesyspw.php";
include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../../../recursivetesting/FetchGithubRepo.php";
include('../shared_microservices/getUid_ms.php');

// Connect to database and start session
pdoConnect();
session_start();

// Global variables
$opt = getOP('opt');
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
$gradesys=getOP('gradesys');
$tabs=getOP('tabs');


getUid(); // call to microservice getUid_ms.php
$userid = $_SESSION['uid'];


// TODO: the following will be changed to a microservice, as such this should be updated to a microservice call

// *********************** vvvv CHANGE TO MICROSERVICE CALL vvvv ***********************************
// Gets username based on uid, USED FOR LOGGING
$query = $pdo->prepare( "SELECT username FROM user WHERE uid = :uid");
$query->bindParam(':uid', $userid);
$query-> execute();

// This while is only performed if userid was set through _SESSION['uid'] check above, a guest will not have it's username set, USED FOR LOGGING
while ($row = $query->fetch(PDO::FETCH_ASSOC)){
	$username = $row['username'];
}
// *********************** ^^^^ CHANGE TO MICROSERVICE CALL ^^^^ ***********************************


if (strcmp($opt, "NEW") === 0) {

	// Insert a new code example and update variables accordingly.
	if ($link == -1) {
		$query1 = $pdo->prepare("SELECT * FROM codeexample ORDER BY exampleid DESC LIMIT 1");
		if (!$query1->execute()) {
			$error = $query1->errorInfo();
			$debug = "Error reading entries" . $error[2];
		}

		foreach ($query1->fetchAll() as $row) {
			$sname = $row['exampleid'] + 1;
		}

		$sname = $sectname . $sname;
		$query2 = $pdo->prepare("INSERT INTO codeexample(cid,examplename,sectionname,uid,cversion) values (:cid,:ename,:sname,1,:cversion);");

		$query2->bindParam(':cid', $courseid);
		$query2->bindParam(':cversion', $coursevers);
		$query2->bindParam(':ename', $sectname);
		$query2->bindParam(':sname', $sname);

		if (!$query2->execute()) {
			$error = $query2->errorInfo();
			$debug = "Error updating entries" . $error[2];
		}

		$link = $pdo->lastInsertId();
	}

	$query = $pdo->prepare("INSERT INTO listentries (cid,vers, entryname, link, kind, pos, visible,creator,comments, gradesystem, highscoremode, groupKind) 
												 VALUES(:cid,:cvs,:entryname,:link,:kind,:pos,:visible,:usrid,:comment, :gradesys, :highscoremode, :groupkind)");

	if ($kind == 4) {
		$query->bindParam(':gradesys', $gradesys);
	} else {
		$query->bindParam(':gradesys', $tabs);
	}

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

	if ($grptype != "UNK") {
		$query->bindParam(':groupkind', $grptype);
	} else {
		$query->bindValue(':groupkind', null, PDO::PARAM_STR);

		// Logging for newly added items
		//$description = $sectname; // this isn't used
		logUserEvent($userid, $username, EventTypes::SectionItems, $sectname);
	}


	if (!$query->execute()) {
		$error = $query->errorInfo();
		$debug = "Error updating entries" . $error[2];
	}
}
?>