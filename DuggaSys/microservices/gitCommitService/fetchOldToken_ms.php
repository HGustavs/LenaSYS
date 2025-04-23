<?php

// Check if it's a POST request and get parameters
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['cid'])) {
        $cid = $_POST['cid'];
        
        $pdolite = new PDO('sqlite:../../githubMetadata/metadata2.db');
        
        $query = $pdolite->prepare('SELECT gitToken FROM gitRepos WHERE cid=:cid');
        $query->bindParam(':cid', $cid);
        $query->execute();

        $old_token = "";
        foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
            $old_token = $row['gitToken'];
        }

        header('Content-Type: application/json');
        if(strlen($old_token) > 1) {
            echo json_encode(['status' => 'success', 'token' => $old_token]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'No token found']);
        }
    } else {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Missing required parameters']);
    }
} else {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method. Use POST.']);
}
