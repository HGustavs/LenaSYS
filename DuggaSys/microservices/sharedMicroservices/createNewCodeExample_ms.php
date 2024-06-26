<?php
include_once "./getUid_ms.php";
include_once "./retrieveUsername_ms.php";

function createNewCodeExample($pdo, $exampleid, $courseid, $coursevers, $sectname, $link, $log_uuid, $templateNumber=0){
	if (!is_null($exampleid)){
		$sname = $sectname . ($exampleid + 1);
	}else{
		$sname= $sectname;
	}
	$debug="NONE!";
	$query2 = $pdo->prepare("INSERT INTO codeexample(cid,examplename,sectionname,uid,cversion,templateid) values (:cid,:ename,:sname,1,:cversion, :templateid);");
	$query2->bindParam(':cid', $courseid);
	$query2->bindParam(':cversion', $coursevers);
	$query2->bindParam(':ename', $sectname);
	$query2->bindParam(':sname', $sname);
	$query2->bindParam(":templateid", $templateNumber);
	if (!$query2->execute()) {
		$error = $query2->errorInfo();
		$debug = "Error updating entries" . $error[2];
	}
	$link = $pdo->lastInsertId();

	$userid = getUid();
	$username = retrieveUsername($pdo);
	logUserEvent($userid, $username, EventTypes::SectionItems, $sectname);

	return array('debug'=>$debug,'link'=>$link);
}
