<?php

// Include basic application services!
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";

global $pdo;

//--------------------------------------------------------------------------------------------------
// clearGitFiles: Clear the gitFiles table in SQLite db when a course has been updated with a new github repo. This function is used by other github microservices.
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