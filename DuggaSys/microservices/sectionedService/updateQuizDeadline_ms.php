<?php
//-------------------------------------------------------------------------------------------------------
// Microservice updateQuizDeadline updates the deadline for a quiz (dugga)
//-------------------------------------------------------------------------------------------------------

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../curlService.php";

// Connect to database and start session
pdoConnect();
session_start();

$opt = getOP('opt');
$courseid = getOP('courseid');
$link = getOP('link');
$coursevers = getOP('coursevers');
$log_uuid = getOP('log_uuid');
$deadline = getOP('deadline');
$relativedeadline = getOP('relativedeadline');
$debug = "NONE!";

$studentTeacher = false;

//checklogin and session code should be replaced with getuid (is not working) when getuid is fixed
if (checklogin()) {
	if (isset($_SESSION['uid'])) {
		$userid = $_SESSION['uid'];
		$hasread = hasAccess($userid, $courseid, 'r');
		$studentTeacher = hasAccess($userid, $courseid, 'st');
		$haswrite = hasAccess($userid, $courseid, 'w');
	} else {
		$userid = "guest";
	}

	if (strcmp($opt, "UPDATEDEADLINE") === 0) {
		$deadlinequery = $pdo->prepare("UPDATE quiz SET deadline=:deadline, relativedeadline=:relativedeadline WHERE id=:link;");
		$deadlinequery->bindParam(':deadline', $deadline);
		$deadlinequery->bindParam(':relativedeadline', $relativedeadline);
		$deadlinequery->bindParam(':link', $link);

		if (!$deadlinequery->execute()) {
			$error = $deadlinequery->errorInfo();
		}
	}
}

$postData = [
    'debug' => $debug,
    'opt' => $opt,
    'uid' => $userid,
    'cid' => $courseid,
    'vers' => $coursevers,
    'log_uuid' => $log_uuid
];

header("Content-Type: application/json");
$data = callMicroservicePOST("sectionedService/retrieveSectionedService_ms.php", $postData, true );
echo $data;
return;
?>