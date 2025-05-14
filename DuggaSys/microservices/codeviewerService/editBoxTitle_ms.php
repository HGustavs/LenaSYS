<?php
date_default_timezone_set("Europe/Stockholm");

// Include basic application services
include_once "../sharedMicroservices/getUid_ms.php";
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "../curlService.php";

// Connect to database and start session
pdoConnect();
session_start();

// Global variables
$exampleId = getOP('exampleid');
$boxId = getOP('boxid');
$opt = getOP('opt');
$courseId = getOP('courseid');
$courseVersion = getOP('cvers');
$boxTitle = getOP('boxtitle');
$debug = "NONE!";
$userid = getUid();

$exampleCount = 0;

$query = $pdo->prepare("SELECT exampleid,sectionname,examplename,runlink,cid,cversion,beforeid,afterid,public FROM codeexample WHERE exampleid = :exampleid;");
$query->bindParam(':exampleid', $exampleId);
$query->execute();

while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
	$exampleCount++;
}

if ($exampleCount > 0) {
	if (checklogin() && ($writeAccess == "w" || isSuperUser($userid))) {

		if (strcmp('EDITTITLE', $opt) === 0) {
			$query = $pdo->prepare("UPDATE box SET boxtitle=:boxtitle WHERE boxid=:boxid AND exampleid=:exampleid;");
			$query->bindParam(':boxtitle', $boxTitle);
			$query->bindValue(':exampleid', $exampleId);
			$query->bindParam(':boxid', $boxId);
			$query->execute();
		}
	}
}

//Re-engineer
$postData = [
    'opt' => $opt,
    'exampleid' => $exampleId,
    'courseid' => $courseId,
    'cvers' => $courseVersion
];

$response = callMicroservicePOST("codeviewerService/retrieveCodeviewerService_ms.php", $postData, true);
$link = json_decode($response, true);
echo json_encode($link);
return;