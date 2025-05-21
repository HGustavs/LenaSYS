<?php
date_default_timezone_set("Europe/Stockholm");

// Include basic application services
include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";


    checklogin();

    // Checks user id, if user has none a guest id is set
    if (isset($_SESSION['uid'])) {
        $userid = $_SESSION['uid'];
    } else {
        $userid = "guest";
    }

    // Global variables
    $opt = getOP('opt');
    $courseId = getOP('courseId');
    $courseVersion = getOP('courseVersion');
    $exampleName = getOP('exampleName');
    $sectionName = getOP('sectionName');
    $exampleId = getOP('exampleId');
    $log_uuid = getOP('log_uuid'); // unique identifier for the event
    $log_timestamp = getOP('log_timestamp');

    $info = "opt: " . $opt . " courseId: " . $courseId . " courseVersion: " . $courseVersion . " exampleName: " . $exampleName . " sectionName: " . $sectionName . " exampleId: " . $exampleId;
    logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "getUid_ms.php", $userid, $info, $log_timestamp); //logging information into serviceLogEntries-table through logServiceEvent-function);

    header('Content-Type: application/json');
    echo json_encode($userid);

