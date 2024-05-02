<?php

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "./insertIntoSQLite_ms.php";


function getCourseID($githubURL) {

    global $pdo;
    // Connect to database and start session
    pdoConnect();
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
        insertIntoSQLite($githubURL, $cid, "");
    } else {
        print_r("No matches in database!");
    }
}
