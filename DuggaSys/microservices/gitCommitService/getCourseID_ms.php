<?php

// Remove includes
// include_once "../../../Shared/sessions.php";
// include_once "../../../Shared/basic.php";
// include_once "./insertIntoSQLite_ms.php";

// Check if it's a POST request and get parameters
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['githubURL'])) {
        $githubURL = $_POST['githubURL'];
        
        // Connect to database
        $pdo = new PDO('mysql:host=localhost;dbname=LenaSYS', 'lena', 'password');
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Start session
        session_start();

        // Translates the url to the same structure as in mysql
        // The "/" needs to be "&#47;" for the query to work
        $newURL = str_replace("/", "&#47;", $githubURL);

        // Fetching from the database
        $query = $pdo->prepare('SELECT cid FROM course WHERE courseGitURL = :githubURL;');
        $query->bindParam(':githubURL', $newURL);
        $query->execute();

        $cid = "";
        foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
            $cid = $row['cid'];
            // TODO: Limit this to only one result
        }

        // Check if not null, else add it to Sqlite db
        if($cid != null) {
            // Call insertIntoSQLite microservice
            $baseURL = "https://" . $_SERVER['HTTP_HOST'];
            $insertURL = $baseURL . "/LenaSYS/DuggaSys/microservices/gitCommitService/insertIntoSQLite_ms.php";
            $ch = curl_init($insertURL);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
                'githubURL' => $githubURL,
                'cid' => $cid,
                'commit' => ''
            ]));
            curl_exec($ch);
            curl_close($ch);
            
            header('Content-Type: application/json');
            echo json_encode(['status' => 'success', 'cid' => $cid]);
        } else {
            header('Content-Type: application/json');
            echo json_encode(['status' => 'error', 'message' => 'No matches in database!']);
        }
    } else {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Missing required parameters']);
    }
} else {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method. Use POST.']);
}
