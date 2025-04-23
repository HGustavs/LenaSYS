<?php
// -------------==============######## Setup ###########==============-------------

// Variables for the refresh button, deadlines specified in seconds
$shortdeadline = 300; // 300 = 5 minutes
$longdeadline = 600; // 600 = 10 minutes

// Used to display errors on screen since PHP doesn't do that automatically.
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Remove includes
// include_once "../../../Shared/basic.php";
// include_once "../../../Shared/sessions.php";
// include_once "../../gitfetchService.php";
// include_once "./refreshCheck_ms.php";
// include_once "./clearGitFiles_ms.php";

//Get data from AJAX call in courseed.js and then runs the function getCourseID, refreshGithubRepo or updateGithubRepo depending on the action
if (isset($_POST['action']) && $_POST['action'] == 'refreshGithubRepo' && isset($_POST['cid']) && isset($_POST['user'])) {
    $cid = $_POST['cid'];

    // Call clearGitFiles microservice
    $baseURL = "https://" . $_SERVER['HTTP_HOST'];
    $clearURL = $baseURL . "/LenaSYS/DuggaSys/microservices/gitCommitService/clearGitFiles_ms.php";
    $ch = curl_init($clearURL);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        'cid' => $cid
    ]));
    curl_exec($ch);
    curl_close($ch);

    // Get old commit and URL from Sqlite 
    $pdolite = new PDO('sqlite:../../githubMetadata/metadata2.db');
    $query = $pdolite->prepare('SELECT lastCommit, repoURL FROM gitRepos WHERE cid = :cid');
    $query->bindParam(':cid', $cid);
    $query->execute();

    $commit = "";
    $url = "";

    foreach ($query->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $commit = $row['lastCommit'];
        $url = $row['repoURL'];
    }

    //If both values are valid
    if ($commit == "" && $url == "") {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'No repo']);
    } else {
        // Call refreshCheck microservice
        $refreshURL = $baseURL . "/LenaSYS/DuggaSys/microservices/gitCommitService/refreshCheck_ms.php";
        $ch = curl_init($refreshURL);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
            'cid' => $cid,
            'user' => $_POST['user']
        ]));
        $refreshResponse = curl_exec($ch);
        curl_close($ch);
        
        $refreshResult = json_decode($refreshResponse, true);
        
        if ($refreshResult && isset($refreshResult['status']) && $refreshResult['status'] == 'success') {
            // Call BFS function from gitFetchService
            $bfsURL = $baseURL . "/LenaSYS/DuggaSys/microservices/gitFetchService/bfs_ms.php";
            $ch = curl_init($bfsURL);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
                'url' => $url,
                'cid' => $cid,
                'action' => 'GETCOMMIT'
            ]));
            $latestCommitResponse = curl_exec($ch);
            curl_close($ch);
            
            $latestCommitResult = json_decode($latestCommitResponse, true);
            $latestCommit = $latestCommitResult['commit'];
            
            // Compare old commit in db with the new one from the url
            if ($latestCommit != $commit) {
                // Update the SQLite db with the new commit
                $query = $pdolite->prepare('UPDATE gitRepos SET lastCommit = :latestCommit WHERE cid = :cid');
                $query->bindParam(':cid', $cid);
                $query->bindParam(':latestCommit', $latestCommit);
                $query->execute();

                // Download files and metadata via BFS
                $ch = curl_init($bfsURL);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_POST, true);
                curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
                    'url' => $url,
                    'cid' => $cid,
                    'action' => 'DOWNLOAD'
                ]));
                curl_exec($ch);
                curl_close($ch);
                
                header('Content-Type: application/json');
                echo json_encode(['status' => 'success', 'message' => 'The course has been updated, files have been downloaded!']);
            } else if (http_response_code() == 200) {
                header('Content-Type: application/json');
                echo json_encode(['status' => 'success', 'message' => 'The course is already up to date!']);
            }
        } else {
            header('Content-Type: application/json');
            echo json_encode(['status' => 'error', 'message' => 'Refresh check failed']);
        }
    }
} else {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Invalid request parameters']);
}
