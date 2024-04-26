<?php

// -------------==============######## Setup ###########==============-------------

// Variables for the refresh button, deadlines specified in seconds
$shortdeadline = 300; // 300 = 5 minutes
$longdeadline = 600; // 600 = 10 minutes

// Used to display errors on screen since PHP doesn't do that automatically.
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include basic application services!
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "../../gitfetchService.php";

global $pdo;

//Get data from AJAX call in courseed.js and then runs the function getCourseID, refreshGithubRepo or updateGithubRepo depending on the action
if(isset($_POST['action'])) 
{
    if($_POST['action'] == 'getCourseID') 
    {
        getCourseID($_POST['githubURL']);
    }
    else if($_POST['action'] == 'refreshGithubRepo') 
    {
        refreshGithubRepo($_POST['cid']);
    }
    else if($_POST['action'] == 'updateGithubRepo') 
    {
        updateGithubRepo($_POST['githubURL'], $_POST['cid']);
    }
    else if($_POST['action'] == 'directInsert'){
        
        insertIntoSQLite($_POST['githubURL'], $_POST['cid'], $_POST['token'],);
    }
};

//--------------------------------------------------------------------------------------------------
// clearGitFiles: Clear the gitFiles table in SQLite db when a course has been updated with a new github repo
//--------------------------------------------------------------------------------------------------


function clearGitFiles($cid) {
    $pdolite = new PDO('sqlite:../../githubMetadata/metadata2.db');
    $query = $pdolite->prepare("DELETE FROM gitFiles WHERE cid = :cid"); 
    $query->bindParam(':cid', $cid);
    if (!$query->execute()) {
        $error = $query->errorInfo();
        echo "Error updating file entries" . $error[2];
        $errorvar = $error[2];
        print_r($error);
        echo $errorvar;
    }
}

?>