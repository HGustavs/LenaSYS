<?php
//---------------------------------------------------------------------------------------------------------------
// changeActiveCourseVersion_sectioned_ms
//---------------------------------------------------------------------------------------------------------------
// Microservice that updates the active version of a course
//---------------------------------------------------------------------------------------------------------------

date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "../curlService.php";

pdoConnect();
session_start();

if(isset($_SESSION['uid'])){
	$userid=$_SESSION['uid'];
}else{
	$userid="guest";
}

$courseid = getOP('courseid');
$coursevers = getOP('coursevers');
$versid = getOP('vers');
$log_uuid=getOP('log_uuid');
$opt=getOP('opt');
$debug = "NONE!";

// Authorization
$isSuperUserVar = isSuperUser($userid);
$ha = (checklogin() && ($haswrite || $isSuperUserVar));

if($ha || $studentTeacher) {
    $query = $pdo->prepare("UPDATE course SET activeversion=:vers WHERE cid=:cid");
    $query->bindParam(':cid', $courseid);
    $query->bindParam(':vers', $versid);

    if(!$query->execute()) {
        $error=$query->errorInfo();
        $debug="Error updating entries".$error[2];
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
$response = callMicroservicePOST("sectionedService/retrieveSectionedService_ms.php", $postData, true );
$data = json_decode($response, true);
$data['coursevers'] = $versid;
echo json_encode($data);
return;

?>
