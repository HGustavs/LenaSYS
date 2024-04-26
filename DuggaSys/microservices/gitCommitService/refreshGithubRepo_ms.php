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
include_once "refreshGithubRepo_ms.php";

global $pdo;

//Get data from AJAX call in courseed.js and then runs the function getCourseID, refreshGithubRepo or updateGithubRepo depending on the action
if(isset($_POST['action'])) {
    if($_POST['action'] == 'refreshGithubRepo') {
        //--------------------------------------------------------------------------------------------------
        // refreshGithubRepo: Updates the metadata from the github repo if there's been a new commit
        //--------------------------------------------------------------------------------------------------
        $cid = $_POST['cid'];
        clearGitFiles($cid);
        }

        // Get old commit and URL from Sqlite 
        $pdolite = new PDO('sqlite:../../githubMetadata/metadata2.db');
        $query = $pdolite->prepare('SELECT lastCommit, repoURL FROM gitRepos WHERE cid = :cid');
        $query->bindParam(':cid', $cid);
        $query->execute();
        
        $commmit = "";
        $url = "";
        foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
            $commit = $row['lastCommit'];
            $url = $row['repoURL'];
        }

        //If both values are valid
        if($commit == "" && $url == "") {
            print_r("No repo");
        } 
        else {
            if(refreshCheck($_POST['cid'], $_POST['user'])){
                // Get the latest commit from the URL
                $latestCommit = bfs($url,$cid,"GETCOMMIT");
                // Compare old commit in db with the new one from the url
                if($latestCommit != $commit) {
                    // Update the SQLite db with the new commit
                    $query = $pdolite->prepare('UPDATE gitRepos SET lastCommit = :latestCommit WHERE cid = :cid');
                    $query->bindParam(':cid', $cid);
                    $query->bindParam(':latestCommit', $latestCommit);
                    $query->execute();

                    // Download files and metadata
                    bfs($url, $cid, "DOWNLOAD");
                    print "The course has been updated, files have been downloaded!";
                } else if(http_response_code() == 200) {
                    print "The course is already up to date!";
                }
            }
        }   
    }
};

// -------------==============######## Refresh Github Repo in Course ###########==============-------------

//--------------------------------------------------------------------------------------------------
// refreshCheck: Decided how often the data can be updated, and if it can be updated again
//--------------------------------------------------------------------------------------------------

function refreshCheck($cid, $user) {
    global $shortdeadline, $longdeadline;
    // Connect to database and start session
    pdoConnect();
    session_start();

    // Fetching the latest update of the course from the MySQL database
    global $pdo;
    $query = $pdo->prepare('SELECT updated FROM course WHERE cid = :cid;');
    $query->bindParam(':cid', $cid);
    $query->execute();

    // Save the result in a variable
    $updated = "";
    foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
        $updated = $row['updated'];
    }

    $currentTime = time(); // Get the current time as a Unix timestamp
    $updateTime = strtotime($updated); // Format the update-time as Unix timestamp

    $_SESSION["updatetGitReposCooldown"][$cid]=$updateTime;

    $_SESSION["lastFetchTime"] = date("Y-m-d H:i:s", $currentTime);
    $fethCooldown = $longdeadline - (time() - $updateTime);
    if($fethCooldown<0){
        $_SESSION["fetchCooldown"]=0;
    }else{
        $_SESSION["fetchCooldown"]=$fethCooldown;
    }
    // Check if the user has superuser priviliges
    if($user == 1) { // 1 = superuser
        if(($currentTime - $_SESSION["updatetGitReposCooldown"][$cid]) < $shortdeadline) { // If they to, use the short deadline
            
            print "Too soon since last update, please wait.";
            return false;
        } else {
            newUpdateTime($currentTime, $cid);
            return true;
        }
    } else { 
        if(($currentTime - $_SESSION["updatetGitReposCooldown"][$cid]) > $longdeadline) { // Else use the long deadline
            newUpdateTime($currentTime, $cid);
            return true;
        } else {
            print "Too soon since last update, please wait.";
            return false;
        }
    }
}

//--------------------------------------------------------------------------------------------------
// newUpdateTime: Updates the MySQL database to save the latest update time
//--------------------------------------------------------------------------------------------------

function newUpdateTime ($currentTime, $cid) {
    // Connect to database and start session
    pdoConnect();
    session_start();

    // Formats the UNIX timestamp into datetime
    $parsedTime = date("Y-m-d H:i:s", $currentTime); 

    // Fetching the latest update of the course from the MySQL database
    global $pdo;
    $query = $pdo->prepare('UPDATE course SET updated = :parsedTime WHERE cid = :cid;');
    $query->bindParam(':cid', $cid);
    $query->bindParam(':parsedTime', $parsedTime);
    $query->execute();
}

?>