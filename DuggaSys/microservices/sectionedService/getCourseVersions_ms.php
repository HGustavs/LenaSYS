<?php
//---------------------------------------------------------------------------------------------------------------
// Microservice uses service selectFromTableVers to get information it requires from vers.
//---------------------------------------------------------------------------------------------------------------

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";

// Connect to database and start session
pdoConnect();
session_start();
// Fetch all course versions
function getCourseVersions($pdo) {
    $versions = [];
    try {
        $query = $pdo->prepare("SELECT cid,coursecode,vers,versname,coursename,coursenamealt,startdate,enddate,motd FROM vers;");
        $query->execute();
    
        $versions = $query->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        error_log("Error reading versions: " . $e->getMessage());
        echo "Error: " . $e->getMessage(); 
        return [];
    }
    return $versions;
}
$versions = getCourseVersions($pdo);
echo json_encode($versions);
return;