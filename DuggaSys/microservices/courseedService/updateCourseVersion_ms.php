<?php

date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "../sharedMicroservices/getUid_ms.php";
include_once "../sharedMicroservices/retrieveUsername_ms.php";
include_once "./retrieveCourseedService_ms.php";

// Connect to database and start session.
pdoConnect();
session_start();

$opt=getOP('opt');
$cid=getOP('cid');
$coursecode=getOP('coursecode');
$coursename=getOP('coursename');
$coursenamealt=getOP('coursenamealt');
$versname=getOP('versname');
$versid=getOP('versid');
$makeactive=getOP('makeactive');
$motd=getOP('motd');
$enddate=getOP('enddate');
$startdate=getOP('startdate');

$debug="NONE!";
$isSuperUserVar=false;
$ha=false;
$userid=getUid();
// Login is checked
if (checklogin()) {
	$isSuperUserVar = isSuperUser($userid);
	$ha = $isSuperUserVar;
}

if($ha) {

	if (strcmp($opt, "UPDATEVRS") === 0) {
		$query = $pdo->prepare("UPDATE vers SET motd=:motd,versname=:versname,startdate=:startdate,enddate=:enddate WHERE cid=:cid AND coursecode=:coursecode AND vers=:vers;");
		$query->bindParam(':cid', $cid);
		$query->bindParam(':coursecode', $coursecode);
		$query->bindParam(':vers', $versid);
		$query->bindParam(':versname', $versname);
		$query->bindParam(':motd', $motd);

		if($startdate=="UNK"){
			$query->bindValue(':startdate', null,PDO::PARAM_INT);
		}else {
			$query->bindParam(':startdate', $startdate);
		}
		if($enddate=="UNK"){ 
			$query->bindValue(':enddate', null,PDO::PARAM_INT);
		}else {
			$query->bindParam(':enddate', $enddate);
		}
		if (!$query->execute()) {
			$error = $query->errorInfo();
			$debug = "Error updating entries\n" . $error[2];
		}
		if ($makeactive == 3) {
			$query = $pdo->prepare("UPDATE course SET activeversion=:vers WHERE cid=:cid");
			$query->bindParam(':cid', $cid);
			$query->bindParam(':vers', $versid);

			if (!$query->execute()) {
				$error = $query->errorInfo();
				$debug = "Error updating entries\n" . $error[2];
			}
		}
	}
}

echo json_encode(retrieveCourseedService($pdo, $ha, $debug, null, $isSuperUserVar));
