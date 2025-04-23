<?php

//--------------------------------------------------------------------------------------------------
// newUpdateTime: Updates the MySQL database to save the latest update time
//--------------------------------------------------------------------------------------------------

// Check if it's a POST request and get parameters
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['currentTime']) && isset($_POST['cid'])) {
        $currentTime = $_POST['currentTime'];
        $cid = $_POST['cid'];
        
        // Connect to database
        $pdo = new PDO('mysql:host=localhost;dbname=LenaSYS', 'lena', 'password');
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Formats the UNIX timestamp into datetime
        $parsedTime = date("Y-m-d H:i:s", $currentTime); 

        // Update the latest update timestamp of the course from the MySQL database
        $query = $pdo->prepare('UPDATE course SET updated = :parsedTime WHERE cid = :cid;');
        $query->bindParam(':cid', $cid);
        $query->bindParam(':parsedTime', $parsedTime);
        
        if ($query->execute()) {
            header('Content-Type: application/json');
            echo json_encode(['status' => 'success']);
        } else {
            header('Content-Type: application/json');
            echo json_encode(['status' => 'error', 'message' => 'Failed to update time']);
        }
    } else {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Missing required parameters']);
    }
} else {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method. Use POST.']);
}
