<?php


date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../sharedMicroservices/getUid_ms.php";
include_once "../curlService.php";


// Connect to database and start session
pdoConnect();
session_start();

$opt = getOP('opt');
$cid = getOP('cid');
$courseGitURL = getOP('courseGitURL');
$userid = getUid();  
$debug="NONE!";

// Permission checks
$haswrite = hasAccess($userid, $cid, 'w');
$isSuperUserVar = isSuperUser($userid);
$studentTeacher = hasAccess($userid, $cid, 'st');

$dataToSend = [
	'ha' => $studentTeacher,
	'debug' => $debug,
	'lastCourseCreated' => null,
	'isSuperUserVar' => $isSuperUserVar
];

// checks that the user is a superuser and logged in
if(!(checklogin() && $isSuperUserVar)) {
    $dataToSend['debug'] = "Access not granted";
    echo json_encode(callMicroservicePOST("courseedService/retrieveCourseedService_ms.php", $dataToSend, true));
    return;
}


if (strcmp($opt, "SPECIALUPDATE") !== 0) {
    $dataToSend['debug'] = "Incorrect opt provided";
    echo json_encode(callMicroservicePOST("courseedService/retrieveCourseedService_ms.php", $dataToSend, true));
    return;
}

$query = $pdo->prepare("SELECT * from course WHERE cid=:cid;");
$query->bindParam(':cid', $cid);

if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error finding course specifics\n" . $error[2];
} else {
    foreach ($query->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $query = $pdo->prepare("UPDATE course SET coursename=:coursename, visibility=:visibility, coursecode=:coursecode, courseGitURL=:courseGitURL WHERE cid=:cid;");

        //print_r($row['coursename'] . $row['visibility'] . $row['coursecode']);
        $query->bindParam(':cid', $cid);
        $query->bindParam(':coursename', $row['coursename']);
        $query->bindParam(':visibility', $row['visibility']);
        $query->bindParam(':coursecode', $row['coursecode']);
        $query->bindParam(':courseGitURL', $courseGitURL);
        try{
            $query->execute();
        }
        catch(Exception $e){
            $query = $pdo->prepare("UPDATE course SET coursename=:coursename, visibility=:visibility, coursecode=:coursecode WHERE cid=:cid;");
            $query->bindParam(':cid', $cid);
            $query->bindParam(':coursename', $row['coursename']);
            $query->bindParam(':visibility', $row['visibility']);
            $query->bindParam(':coursecode', $row['coursecode']);
            $query->execute();
        }

        if (!$query->execute()) {
            $error = $query->errorInfo();
            $debug = "Error updating entries\n" . $error[2];
        }
    }

}

echo json_encode(callMicroservicePOST("courseedService/retrieveCourseedService_ms.php", $dataToSend, true));
?>
