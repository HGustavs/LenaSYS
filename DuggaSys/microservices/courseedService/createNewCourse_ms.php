<?php
//---------------------------------------------------------------------------------------------------------------
// editorService - Saves and Reads content for Code Editor
//---------------------------------------------------------------------------------------------------------------

date_default_timezone_set("Europe/Stockholm");
include ("../../../Shared/sessions.php");     
include('../shared_microservices/getUid_ms.php');

// Connect to database and start session.
pdoConnect();
session_start();

// Gets the values
$coursename = getOP('coursename');
$coursecode = getOP('coursecode');
$courseGitURL = getOP('courseGitURL');

// checks that the user is a superuser and logged in
if(checklogin() && isSuperUser(getUid()) == true) {

    $userid = getUid();   

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
}
?>