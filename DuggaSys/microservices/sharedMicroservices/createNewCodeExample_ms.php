<?php
include_once "getUid_ms.php";
include_once "retrieveUsername_ms.php";

function createNewCodeExample($pdo, $exampleid, $courseid, $coursevers, $sectname, $link, $log_uuid, $templateNumber=null){
	if (!is_null($exampleid)){
		$sname = $sectname . ($exampleid + 1);
	}else{
		$sname= $sectname;
	}
	$query2 = $pdo->prepare("INSERT INTO codeexample(cid,examplename,sectionname,uid,cversion) values (:cid,:ename,:sname,1,:cversion);");
	$query2->bindParam(':cid', $courseid);
	$query2->bindParam(':cversion', $coursevers);
	$query2->bindParam(':ename', $sectname);
	$query2->bindParam(':sname', $sname);
	if (!is_null($templateNumber)){
		$query2->bindParam(":templateid", $templateNumber);
	}
	if (!$query2->execute()) {
		$error = $query2->errorInfo();
		$debug = "Error updating entries" . $error[2];
	}
	$link = $pdo->lastInsertId();

	$userid = getUid();
	$username = retrieveUsername();
	logUserEvent($userid, $username, EventTypes::SectionItems, $sectname);

	return $link;
}
