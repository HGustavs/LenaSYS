<?php

date_default_timezone_set("Europe/Stockholm");
include('../shared_microservices/getUid_ms.php');
include ("../../../Shared/sessions.php");     

pdoConnect();
session_start();

$coursename = getOP('coursename');
$coursecode = getOP('coursecode');
$courseGitURL = getOP('courseGitURL');

if(checklogin() && isSuperUser(getUid()) == true) {

    $query = $pdo->prepare("INSERT INTO course (coursecode,coursename,visibility,creator, hp, courseGitURL) VALUES(:coursecode,:coursename,0,:usrid, 7.5, :courseGitURL)");

    $query->bindParam(':usrid', $userid);
    $query->bindParam(':coursecode', $coursecode);
    $query->bindParam(':coursename', $coursename);
    $query->bindParam(':courseGitURL', $courseGitURL);

    if (!$query->execute()) {
        $error = $query->errorInfo();
        $debug = "Error updating entries\n" . $error[2];
    }
}

echo "Hello, world!\n";

?>