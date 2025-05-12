<?php
//---------------------------------------------------------------------------------------------------------------
// editorService - Saves and Reads content for Code Editor
//---------------------------------------------------------------------------------------------------------------

date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "../sharedMicroservices/getUid_ms.php";
include_once "../../../DuggaSys/microservices/curlService.php";
include_once "./retrieveCourseedService_ms.php";

// Connect to database and start session.
pdoConnect();
session_start();

// Gets the values
$coursename = getOP('coursename');
$coursecode = getOP('coursecode');
$courseGitURL = getOP('courseGitURL');
$debug = "NONE!";
$ha = null;
$isSuperUserVar = false;
$userid = getUid();

$LastCourseCreated = array();

// Login is checked
if (checklogin()) {
	$isSuperUserVar = isSuperUser($userid);
	$ha = $isSuperUserVar;
}

if($ha) {
    // insert into database 
    $query = $pdo->prepare("INSERT INTO course (coursecode,coursename,visibility,creator, hp, courseGitURL) VALUES(:coursecode,:coursename,0,:usrid, 7.5, :courseGitURL)");

	//binds the parameters
    $query->bindParam(':usrid', $userid);
    $query->bindParam(':coursecode', $coursecode);
    $query->bindParam(':coursename', $coursename);
    $query->bindParam(':courseGitURL', $courseGitURL);

	// Execute the query and handle errors
	if(!$query->execute()) {
        $error=$query->errorInfo();
        $debug="Error updating entries\n".$error[2];
    }

    
    // Retrieve last course created
    $query_1 = $pdo->prepare("SELECT cid FROM course ORDER BY cid DESC LIMIT 1");
    $query_1->execute();
    if (!$query_1->execute()) {
        $error = $query_1->errorInfo();
        $debug = "Error reading courses\n" . $error[2];
    } else {
        foreach ($query_1->fetchAll(PDO::FETCH_ASSOC) as $row) {
            array_push(
                $LastCourseCreated,
                array(
                    'LastCourseCreatedId' => $row['cid'],
                )
            );
        }
    }
    // Logging for creating new course
    $description = $coursename . " " . $coursecode . " " . $courseGitURL . " " . "Hidden";

    $data = callMicroserviceGET("sharedMicroservices/retrieveUsername_ms.php");
    $username = $data['username'] ?? 'unknown';
    
    logUserEvent($userid, $username, EventTypes::AddCourse, $description);
}

echo json_encode(retrieveCourseedService($pdo, $ha, $debug, $LastCourseCreated, $isSuperUserVar));
