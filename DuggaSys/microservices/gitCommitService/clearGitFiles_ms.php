<?php

// Include basic application services!
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";

global $pdo;

header("Content-Type: application/json");

//--------------------------------------------------------------------------------------------------
// clearGitFiles: Clear the gitFiles table in SQLite db when a course has been updated with a new github repo. This function is used by other github microservices.
//--------------------------------------------------------------------------------------------------

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['cid'])) {
    $cid = $_POST['cid'];
    
    $pdolite = new PDO('sqlite:../../githubMetadata/metadata2.db');
    $query = $pdolite->prepare("DELETE FROM gitFiles WHERE cid = :cid"); 
    $query->bindParam(':cid', $cid);
    
    if (!$query->execute()) {
        $error = $query->errorInfo();
        echo json_encode(["success" => false, "error" => $error[2]]);
        exit;
    }
}

// Returns JSON
echo json_encode(["success" => true]);