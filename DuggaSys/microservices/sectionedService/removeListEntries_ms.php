<?php
date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../sharedMicroservices/getUid_ms.php";
include_once "retrieveSectionedService_ms.php";

pdoConnect();
session_start();

$courseid=getOP('courseid');
$coursevers=getOP('coursevers');
$log_uuid=getOP('log_uuid');
$opt=getOP('opt');

if (checklogin()) { //This entire checklogin should be working by using the getUid instead, but for the time being it doesn't.
	if (isset($_SESSION['uid'])) {
		$userid = $_SESSION['uid'];
	} else {
		$userid = "UNK";
	}

	if(isSuperUser(getUid())) {
        $sectid=getOP('lid');

        $query = $pdo->prepare("UPDATE listentries SET visible = '3' WHERE lid=:lid");
        $query->bindParam(':lid', $sectid);

        if(!$query->execute()) {
            if($query->errorInfo()[0] == 23000) {
                $debug = "foreign key constraint.";
            } else {
                $debug = "Error.";
            }
        }
    }
}

$data = retrieveSectionedService($debug, $opt, $pdo, $userid, $courseid, $coursevers, $log_uuid);
echo json_encode($data);
return;