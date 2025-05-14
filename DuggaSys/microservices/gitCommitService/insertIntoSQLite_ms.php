<?php

// Include basic application services!
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "../../gitfetchService.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['githubURL'], $_POST['cid'], $_POST['token'])) {
        $githubURL =$_POST['githubURL'];
        $cid = $_POST['cid'];
        $token = $_POST['token'];
    }
}
$url = $githubURL;
if(strlen($token)<1)
{
    $token=fetchOldToken($cid);
}

$pdolite = new PDO('sqlite:../../githubMetadata/metadata2.db');
$lastCommit = bfs($url, $cid, "GETCOMMIT");
print_r($lastCommit);
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
    echo "Error updating file entries" . $error[2];
    $errorvar = $error[2];
    print_r($error);
    echo $errorvar;
} else {
    bfs($url, $cid, "REFRESH");
}
?>
