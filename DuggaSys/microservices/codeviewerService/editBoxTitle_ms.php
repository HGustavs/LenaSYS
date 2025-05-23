<?php
date_default_timezone_set("Europe/Stockholm");

// Include basic application services
include_once "../curlService.php";
//include_once "./retrieveCodeviewerService_ms.php";
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";

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
$userid = callMicroserviceGET("sharedMicroservices/getUid_ms.php");

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
$baseURL = "https://" . $_SERVER['HTTP_HOST'];
$url = $baseURL . "/DuggaSys/microservices/codeviewerService/retrieveCodeviewerService_ms.php";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'opt' => $opt,
    'exampleid' => $exampleId,
    'courseid' => $courseId,
    'cvers' => $courseVersion
]));

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
echo json_encode($data);
return;