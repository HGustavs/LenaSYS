<?php
//---------------------------------------------------------------------------------------------------------------
// Microservice uses service selectFromTableVers to get information it requires from vers.
//---------------------------------------------------------------------------------------------------------------

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../../../Shared/sessions.php";
include_once "../sharedMicroservices/getUid_ms.php";

// Connect to database and start session
pdoConnect();

$log_uuid=getOP('log_uuid');
$opt=getOP('opt');
$userid=getUid();
$coursevers=getOP('coursevers');
$courseid=getOP('cid');

// Fetch all course versions
function getCourseVersions($pdo) {
    $versions = [];
    try {
        $query = $pdo->prepare("SELECT cid,coursecode,vers,versname,coursename,coursenamealt,startdate,enddate,motd FROM vers;");
        $query->execute();
    
        $versions = $query->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        error_log("Error reading versions: " . $e->getMessage());
        return [];
    }
    return $versions;
}
