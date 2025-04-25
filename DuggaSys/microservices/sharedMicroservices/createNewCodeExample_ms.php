<?php
include_once "./getUid_ms.php";
include_once "./retrieveUsername_ms.php";

// Connect to database and start session
pdoConnect();
session_start();


header('Content-Type: application/json');


//get values from post
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['exampleid'], $_POST['courseid'], $_POST['coursevers'], $_POST['sectname'], $_POST['link'], $_POST['log_uuid'], $_POST['templatenumber'])) {
		$exampleid = $_POST['exampleid'];
		$courseid = $_POST['courseid'];
		$coursevers = $_POST['coursevers'];
		$sectname = $_POST['sectname'];
		$link = $_POST['link'];
		$log_uuid  = $_POST['log_uuid'];
		$templateNumber = $_POST['templatenumber'];
    }
}

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

