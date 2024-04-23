<?php
/**
 * Handles creation of new items on a course, not just for code examples (as the name would suggest)
 * I presume that the title of the file is for consistency with the legacy system... Hey, I just work here....
 */

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "getUid_ms.php";
include_once "retrieveUsername_ms.php";


function createNewCodeExample($pdo, $exampleid, $courseid, $coursevers, $sectname, $link, $log_uuid){
	$userid = getUid();
	$sname = $sectname . ($exampleid + 1);
	$query2 = $pdo->prepare("INSERT INTO codeexample(cid,examplename,sectionname,uid,cversion) values (:cid,:ename,:sname,1,:cversion);");
	$query2->bindParam(':cid', $courseid);
	$query2->bindParam(':cversion', $coursevers);
	$query2->bindParam(':ename', $sectname);
	$query2->bindParam(':sname', $sname);
	if (!$query2->execute()) {
		$error = $query2->errorInfo();
		$debug = "Error updating entries" . $error[2];
	}
	// link used by createNewListentrie, should probably be returned?
	$link = $pdo->lastInsertId();
	// TODO: Add logUserEvent call
	return $link;
}

