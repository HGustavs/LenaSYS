<?php
header('Content-Type: application/json');

// Remove includes
// include_once "../../../Shared/basic.php";
// include_once "../../../Shared/sessions.php";
// include_once "../../gitfetchService.php";

// Check if it's a POST request and get parameters
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['githubURL']) && isset($_POST['cid'])) {
        $url = $_POST['githubURL'];
        $cid = $_POST['cid'];
        $token = isset($_POST['token']) ? $_POST['token'] : '';
        
        if (strlen($token) < 1) {
            // Call fetchOldToken microservice
            $baseURL = "https://" . $_SERVER['HTTP_HOST'];
            $tokenURL = $baseURL . "/LenaSYS/DuggaSys/microservices/gitCommitService/fetchOldToken_ms.php";
            $ch = curl_init($tokenURL);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
                'cid' => $cid
            ]));
            $tokenResponse = curl_exec($ch);
            curl_close($ch);
            
            $tokenResult = json_decode($tokenResponse, true);
            if ($tokenResult && isset($tokenResult['token'])) {
                $token = $tokenResult['token'];
            }
        }
        
        $pdolite = new PDO('sqlite:../../githubMetadata/metadata2.db');
        
        // Call BFS function from gitFetchService to get commit
        $baseURL = "https://" . $_SERVER['HTTP_HOST'];
        $bfsURL = $baseURL . "/LenaSYS/DuggaSys/microservices/gitFetchService/bfs_ms.php";
        $ch = curl_init($bfsURL);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
            'url' => $url,
            'cid' => $cid,
            'action' => 'GETCOMMIT'
        ]));
        $lastCommitResponse = curl_exec($ch);
        curl_close($ch);
        
        $lastCommitResult = json_decode($lastCommitResponse, true);
        $lastCommit = $lastCommitResult['commit'];
        
        // Splits the url into different parts for every "/" there is
        $urlParting = explode('/', $url);
        // The 4th part contains the name of the repo, which is accessed by [4]
        $repoName = $urlParting[4];
        
        $query = $pdolite->prepare("INSERT OR REPLACE INTO gitRepos (cid,repoName, repoURL, lastCommit, gitToken) VALUES (:cid, :repoName, :repoURL, :lastCommit, :gitToken )"); 
        $query->bindParam(':cid', $cid);
        $query->bindParam(':repoName', $repoName);
        $query->bindParam(':repoURL', $url);
        $query->bindParam(':lastCommit', $lastCommit);
        $query->bindParam(':gitToken', $token);

        if (!$query->execute()) {
            $error = $query->errorInfo();
            $errorvar = $error[2];
                        echo json_encode(['status' => 'error', 'message' => "Error updating file entries: " . $errorvar]);
        } else {
            // Call BFS function for REFRESH
            $ch = curl_init($bfsURL);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
                'url' => $url,
                'cid' => $cid,
                'action' => 'REFRESH'
            ]));
            curl_exec($ch);
            curl_close($ch);
            
            echo json_encode(['status' => 'success']);
        }
    } else {
         echo json_encode(['status' => 'error', 'message' => 'Missing required parameters']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method. Use POST.']);
}
?>
