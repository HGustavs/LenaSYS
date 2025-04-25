<?php
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status'=>'error','message'=>'Only POST allowed']);
    exit;
}

// Variables for the refresh button, deadlines specified in seconds
$shortdeadline = 300; // 300 = 5 minutes
$longdeadline = 600; // 600 = 10 minutes

foreach (['action','cid','user'] as $field) {
    if (!isset($_POST[$field])) {
        echo json_encode(['status'=>'error','message'=>"Missing {$field}"]);
        exit;
    }
}
$action = $_POST['action'];
$cid = $_POST['cid'];
$user = $_POST['user'];

if ($action != 'refreshGithubRepo') {
    echo json_encode(['status'=>'error','message'=>'Invalid action']);
    exit;
}

// POST to clearGitFiles_ms.php
$baseURL = "https://".$_SERVER['HTTP_HOST'];
$url = "{$baseURL}/LenaSYS/DuggaSys/microservices/gitCommitService/clearGitFiles_ms.php";
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query(['cid'=>$cid]));
$resp = curl_exec($ch);
curl_close($ch);
$res = json_decode($resp, true);
if (!$res || $res['status']!=='success') {
    echo json_encode($res ?: ['status'=>'error','message'=>'clearGitFiles failed']);
    exit;
}

// Get old commit and URL from Sqlite
try {
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

    // If both values are invalid
    if ($commit == "" && $url == "") {
        echo json_encode(['status' => 'error', 'message' => 'No repo']);
        exit;
    }
} catch (Exception $ex) {
    echo json_encode(['status'=>'error','message'=>$ex->getMessage()]);
    exit;
}

// POST to refreshCheck_ms.php
$refreshURL = "{$baseURL}/LenaSYS/DuggaSys/microservices/gitCommitService/refreshCheck_ms.php";
$ch = curl_init($refreshURL);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'cid' => $cid,
    'user' => $user
]));
$refreshResponse = curl_exec($ch);
curl_close($ch);

$refreshResult = json_decode($refreshResponse, true);

if (!$refreshResult || $refreshResult['status'] !== 'success') {
    echo json_encode($refreshResult ?: ['status' => 'error', 'message' => 'refreshCheck failed']);
    exit;
}

// Call BFS function from gitFetchService
$bfsURL = "{$baseURL}/LenaSYS/DuggaSys/microservices/gitFetchService/bfs_ms.php";
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
if (!$latestCommitResult || !isset($latestCommitResult['commit'])) {
    echo json_encode(['status' => 'error', 'message' => 'Failed to fetch latest commit']);
    exit;
}
$latestCommit = $latestCommitResult['commit'];

// Compare old commit in db with the new one from the url
if ($latestCommit != $commit) {
    // Update the SQLite db with the new commit
    try {
        $query = $pdolite->prepare('UPDATE gitRepos SET lastCommit = :latestCommit WHERE cid = :cid');
        $query->bindParam(':cid', $cid);
        $query->bindParam(':latestCommit', $latestCommit);
        if (!$query->execute()) {
            $e = $query->errorInfo();
            throw new Exception($e[2] ?? 'Unknown error');
        }
    } catch (Exception $ex) {
        echo json_encode(['status'=>'error','message'=>$ex->getMessage()]);
        exit;
    }

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
    
    echo json_encode([
        'status' => 'success', 
        'message' => 'The course has been updated, files have been downloaded!',
        'newCommit' => $latestCommit
    ]);
} else {
    echo json_encode([
        'status' => 'success', 
        'message' => 'The course is already up to date!'
    ]);
}
exit;
