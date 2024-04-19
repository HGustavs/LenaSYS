<?php
date_default_timezone_set("Europe/Stockholm");

// Include basic application services
include_once "../shared_microservices/getUid_ms.php";
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";

// Connect to database and start session
pdoConnect();
session_start();

// Global variables
$exampleId = getOP('exampleid');
$boxId = getOP('boxid');
$opt = getOP('opt');

getUid();

$exampleCount = 0;

$query = $pdo->prepare("SELECT exampleid,sectionname,examplename,runlink,cid,cversion,beforeid,afterid,public FROM codeexample WHERE exampleid = :exampleid;");
$query->bindParam(':exampleid', $exampleId);
$query->execute();

while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
	$exampleCount++;
}

if ($exampleCount > 0) {
	if (checklogin() && ($writeAccess == "w" || isSuperUser($_SESSION['uid']))) {

		if (strcmp('EDITTITLE', $opt) === 0) {
			$exampleid = $_POST['exampleid'];
			$boxId = $_POST['boxid'];
			$boxTitle = $_POST['boxtitle'];

			$query = $pdo->prepare("UPDATE box SET boxtitle=:boxtitle WHERE boxid=:boxid AND exampleid=:exampleid;");
			$query->bindParam(':boxtitle', $boxTitle);
			$query->bindValue(':exampleid', $exampleId);
			$query->bindParam(':boxid', $boxId);
			$query->execute();

			echo json_encode(array('title' => $boxTitle, 'id' => $boxId));
			return;
		}
	}
}
