<?php
// Set JSON content type header
header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status'=>'error', 'message'=>'Only POST supported']);
    exit;
}

// Variables for the refresh button, deadlines specified in seconds
$shortdeadline = 300; // 300 = 5 minutes
$longdeadline = 600; // 600 = 10 minutes

// Validate input parameters
$cid = filter_input(INPUT_POST, 'cid', FILTER_VALIDATE_INT);
$user = filter_input(INPUT_POST, 'user', FILTER_SANITIZE_STRING);

if ($cid === null || $cid === false) {
    echo json_encode(['status'=>'error', 'message'=>'Missing or bad cid']);
    exit;
}

if (empty($user)) {
    echo json_encode(['status'=>'error', 'message'=>'Missing user parameter']);
    exit;
}

// Include the curlService for making REST calls
require_once __DIR__.'/../curlService.php';

// Base URL for microservice calls
$baseURL = "https://" . $_SERVER['HTTP_HOST'];

// Call the clearGitFiles microservice
$clearResponse = callMicroservicePOST(
    "gitCommitService/clearGitFiles_ms.php", 
    ['cid' => $cid],
    true
);

// Get old commit and URL from SQLite
try {
    $pdolite = new PDO('sqlite:../../githubMetadata/metadata2.db');
    $query = $pdolite->prepare('SELECT lastCommit, repoURL FROM gitRepos WHERE cid = :cid');
    $query->bindParam(':cid', $cid);
    $query->execute();

    $result = $query->fetch(PDO::FETCH_ASSOC);
    
    if (!$result || empty($result['repoURL'])) {
        echo json_encode(['status'=>'error', 'message'=>'No repository found for this course']);
        exit;
    }
    
    $commit = $result['lastCommit'] ?? "";
    $url = $result['repoURL'];
    
    // Call refreshCheck microservice
    $refreshCheckResponse = callMicroservicePOST(
        "gitCommitService/refreshCheck_ms.php", 
        ['cid' => $cid, 'user' => $user],
        true
    );
    
    $refreshData = json_decode($refreshCheckResponse, true);
    
    if (!$refreshData || !isset($refreshData['status']) || $refreshData['status'] !== 'success') {
        echo json_encode(['status'=>'error', 'message'=>$refreshData['message'] ?? 'Refresh check failed']);
        exit;
    }
    
    if (!$refreshData['canRefresh']) {
        echo json_encode(['status'=>'info', 'message'=>$refreshData['message'] ?? 'Refresh not allowed at this time']);
        exit;
    }
    
    // Get the latest commit from GitHub
    $getCommitResponse = callMicroservicePOST(
        "gitCommitService/getLatestCommit_ms.php", 
        ['url' => $url, 'cid' => $cid],
        true
    );
    
    $commitData = json_decode($getCommitResponse, true);
    
    if (!$commitData || !isset($commitData['status']) || $commitData['status'] !== 'success') {
        echo json_encode(['status'=>'error', 'message'=>$commitData['message'] ?? 'Failed to get latest commit']);
        exit;
    }
    
    $latestCommit = $commitData['commit'];
    
    // Compare old commit in db with the new one from the url
    if ($latestCommit != $commit) {
        // Update the SQLite db with the new commit
        $query = $pdolite->prepare('UPDATE gitRepos SET lastCommit = :latestCommit WHERE cid = :cid');
        $query->bindParam(':cid', $cid);
        $query->bindParam(':latestCommit', $latestCommit);
        
        if ($query->execute()) {
            // Download files and metadata
            $downloadResponse = callMicroservicePOST(
                "gitCommitService/downloadRepo_ms.php", 
                ['url' => $url, 'cid' => $cid],
                true
            );
            
            $downloadData = json_decode($downloadResponse, true);
            
            if (!$downloadData || !isset($downloadData['status']) || $downloadData['status'] !== 'success') {
                echo json_encode(['status'=>'error', 'message'=>$downloadData['message'] ?? 'Failed to download repository']);
                exit;
            }
            
            echo json_encode(['status'=>'success', 'message'=>'The course has been updated, files have been downloaded!']);
        } else {
            echo json_encode(['status'=>'error', 'message'=>'Failed to update commit information']);
        }
    } else {
        echo json_encode(['status'=>'info', 'message'=>'The course is already up to date!']);
    }
} catch (Exception $e) {
    echo json_encode(['status'=>'error', 'message'=>'Database error: ' . $e->getMessage()]);
}
exit;
