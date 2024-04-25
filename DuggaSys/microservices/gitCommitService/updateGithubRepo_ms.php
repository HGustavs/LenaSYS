<?php

date_default_timezone_set("Europe/Stockholm");

include_once "../Shared/basic.php";
include_once "../Shared/sessions.php";
include_once "../DuggaSys/gitfetchService.php";

function updateGithubRepo($repoURL, $cid) {
    // change to clearGitFiles microservice when it's implemented
    clearGitFiles($cid); // Clear the files before changing git repo

    $lastCommit = getCommit($repoURL); // Get the latest commit from the new URL

    $pdolite = new PDO('sqlite:../../githubMetadata/metadata2.db');
    $query = $pdolite->prepare("UPDATE gitRepos SET repoURL = :repoURL, lastCommit = :lastCommit WHERE cid = :cid"); 
    $query->bindParam(':cid', $cid);
    $query->bindParam(':repoURL', $repoURL);
    $query->bindParam(':lastCommit', $lastCommit);
    if (!$query->execute()) {
        $error = $query->errorInfo();
        echo "Error updating file entries" . $error[2];
        $errorvar = $error[2];
        print_r($error);
        echo $errorvar;
    } else {
        bfs($repoURL, $cid, "REFRESH");
    }
}
?>
