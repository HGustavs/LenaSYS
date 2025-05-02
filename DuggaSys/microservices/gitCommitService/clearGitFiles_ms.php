<?php
// Set JSON content type header
header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status'=>'error', 'message'=>'Only POST supported']);
    exit;
}

// Validate input parameters
$cid = filter_input(INPUT_POST, 'cid', FILTER_VALIDATE_INT);
if ($cid === null || $cid === false) {
    echo json_encode(['status'=>'error', 'message'=>'Missing or bad cid']);
    exit;
}

// Since there is no deleteGitFiles_ms.php yet, we'll implement the logic directly here
// In a proper microservice architecture, this would be a call to another microservice
try {
    $pdolite = new PDO('sqlite:../../githubMetadata/metadata2.db');
    $query = $pdolite->prepare("DELETE FROM gitFiles WHERE cid = :cid"); 
    $query->bindParam(':cid', $cid);
    
    if ($query->execute()) {
        echo json_encode(['status'=>'success', 'message'=>'Git files cleared']);
    } else {
        $error = $query->errorInfo();
        echo json_encode(['status'=>'error', 'message'=>'Error clearing git files: ' . $error[2]]);
    }
} catch (Exception $e) {
    echo json_encode(['status'=>'error', 'message'=>'Database error: ' . $e->getMessage()]);
}
exit;