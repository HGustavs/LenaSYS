<?php
//---------------------------------------------------------------------------------------------------------------
// Microservice uses service selectFromTableVers to get information it requires from vers.
//---------------------------------------------------------------------------------------------------------------

date_default_timezone_set("Europe/Stockholm");

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
