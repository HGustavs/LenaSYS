<?php
// -------------==============######## Setup ###########==============-------------

// Variables for the refresh button, deadlines specified in seconds
$shortdeadline = 300; // 300 = 5 minutes
$longdeadline = 600; // 600 = 10 minutes

// Used to display errors on screen since PHP doesn't do that automatically.
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include basic application services!
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "../../gitfetchService.php";
include_once "./refreshCheck_ms.php";
include_once "../../../DuggaSys/microservices/curlService.php";

//Get data from AJAX call in courseed.js and then runs the function getCourseID, refreshGithubRepo or updateGithubRepo depending on the action
if (isset($_POST['action'])) {
    if ($_POST['action'] == 'refreshGithubRepo') {
        //--------------------------------------------------------------------------------------------------
        // refreshGithubRepo: Updates the metadata from the github repo if there's been a new commit
        //--------------------------------------------------------------------------------------------------
        $cid = $_POST['cid'];
        callMicroservicePOST("gitCommitService/clearGitFiles_ms.php", ['cid' => $cid]);
    }

    // Get old commit and URL from Sqlite 
    $pdolite = new PDO('sqlite:../../githubMetadata/metadata2.db');
    $query = $pdolite->prepare('SELECT lastCommit, repoURL FROM gitRepos WHERE cid = :cid');
    $query->bindParam(':cid', $cid);
    $query->execute();

    $commmit = "";
    $url = "";

    foreach ($query->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $commit = $row['lastCommit'];
        $url = $row['repoURL'];
    }

    //If both values are valid
    if ($commit == "" && $url == "") {
        print_r("No repo");
    } else {
        if (refreshCheck($_POST['cid'], $_POST['user'])) {
            // Get the latest commit from the URL
            $latestCommit = bfs($url, $cid, "GETCOMMIT");
            
            // Compare old commit in db with the new one from the url
            if ($latestCommit != $commit) {
                // Update the SQLite db with the new commit
                $query = $pdolite->prepare('UPDATE gitRepos SET lastCommit = :latestCommit WHERE cid = :cid');
                $query->bindParam(':cid', $cid);
                $query->bindParam(':latestCommit', $latestCommit);
                $query->execute();

                // Download files and metadata
                bfs($url, $cid, "DOWNLOAD");
                print "The course has been updated, files have been downloaded!";
            } else if (http_response_code() == 200) {
                print "The course is already up to date!";
            }
        }
    }
}
