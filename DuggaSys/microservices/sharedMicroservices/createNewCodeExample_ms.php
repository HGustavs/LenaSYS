<?php
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
	$link = $pdo->lastInsertId();
	// TODO: Add logUserEvent call
	return $link;
}