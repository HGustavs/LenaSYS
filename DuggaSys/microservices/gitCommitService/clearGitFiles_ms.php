<?php

// Remove includes
// Include basic application services!
// include_once "../../../Shared/basic.php";
// include_once "../../../Shared/sessions.php";

//--------------------------------------------------------------------------------------------------
// clearGitFiles: Clear the gitFiles table in SQLite db when a course has been updated with a new github repo. This function is used by other github microservices.
//--------------------------------------------------------------------------------------------------

// Check if it's a POST request and get cid
$cid = null;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['cid'])) {
        $cid = $_POST['cid'];
        
        $pdolite = new PDO('sqlite:../../githubMetadata/metadata2.db');
        $query = $pdolite->prepare("DELETE FROM gitFiles WHERE cid = :cid"); 
        $query->bindParam(':cid', $cid);
        if (!$query->execute()) {
            $error = $query->errorInfo();
            $errorvar = $error[2];
            
            // Return error as JSON
            header('Content-Type: application/json');
            echo json_encode(['status' => 'error', 'message' => "Error updating file entries: " . $errorvar]);
        } else {
            // Return success as JSON
            header('Content-Type: application/json');
            echo json_encode(['status' => 'success']);
        }
    } else {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Missing cid parameter']);
    }
} else {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method. Use POST.']);
}