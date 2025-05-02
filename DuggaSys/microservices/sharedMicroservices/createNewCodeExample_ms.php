<?php
include_once "./getUid_ms.php";
include_once "../../../Shared/basic.php";
include_once "../../../DuggaSys/microservices/curlService.php"; // curlService


// Connect to database and start session
pdoConnect();
session_start();


	$userid = getUid();
	$data = callMicroserviceGET("sharedMicroservices/retrieveUsername_ms.php");
	$username = $data['username'] ?? 'unknown';



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


logUserEvent($userid, $username, EventTypes::SectionItems, $sectname);

$result = array('debug'=>$debug,'link'=>$link);
header('Content-Type: application/json');
echo json_encode($result);

