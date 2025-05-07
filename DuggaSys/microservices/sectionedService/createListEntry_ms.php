<?php
date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../sharedMicroservices/getUid_ms.php";

include_once "../sharedMicroservices/createNewListEntry_ms.php";
include_once "./retrieveSectionedService_ms.php";
include_once "../curlService.php";

pdoConnect();
session_start();

$opt = getOP('opt');
$courseid = getOP('courseid');
$coursevers = getOP('coursevers');
$sectname = getOP('sectname');
$kind = getOP('kind');
$link = getOP('link');
$visibility = getOP('visibility');
$gradesys = getOP('gradesys');
$highscoremode = getOP('highscoremode');
$comments = getOP('comments');
$grptype = getOP('grptype');
$pos = getOP('pos');
$tabs = getOP('tabs');
$userid = getUid();

// Microservice for retrieveUsername
$baseURL = "https://" . $_SERVER['HTTP_HOST'];
$url = $baseURL . "/LenaSYS/duggaSys/microservices/sharedMicroservices/retrieveUsername_ms.php";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
$username = $data['username'] ?? 'unknown';

$log_uuid = getOP('log_uuid');
$templateNumber = getOP('templateNumber');
$exampleid = getOP('exampleid');
$debug = "NONE!";

global $pdo;


// Insert a new code example and update variables accordingly.
if ($link == -1) {
    $queryz2 = $pdo->prepare("SELECT * FROM codeexample ORDER BY exampleid DESC LIMIT 1");
    if (!$queryz2->execute()) {
        $error = $queryz2->errorInfo();
        $debug = "Error reading entries" . $error[2];
    }
    foreach ($queryz2->fetchAll() as $row) {
        $exampleid = $row['exampleid'];
    }

    //set url for createNewCodeExample.php path
    header("Content-Type: application/json");
    $baseURL = "https://" . $_SERVER['HTTP_HOST'];
    $url = $baseURL . "/LenaSYS/DuggaSys/microservices/sharedMicroservices/createNewCodeExample_ms.php";

    $dataToSend = [
        'exampleid' => $exampleid,
        'courseid' => $courseid,
        'coursevers' => $coursevers,
        'sectname' => $sectname,
        'link' => $link,
        'log_uuid' => $log_uuid,
        'templatenumber' => $templateNumber
    ];

    $response = callMicroservicePOST($url,  $dataToSend, true);
    $data = json_decode($response, true);
    $link = $data['link'];
}

$listEntryData = [
    'cid' => $courseid,
    'cvs' => $coursevers,
    'usrid' => $userid,
    'entryname' => $sectname,
    'link' => $link,
    'kind' => $kind,
    'comment' => $comments,
    'visible' => $visibility,
    'highscore' => $highscoremode,
    'pos' => $pos,
    'gradesys' => $gradesys,
    'tabs' => $tabs,
    'groupkind' => $grptype
];

$debug = callMicroservicePOST("sharedMicroservices/createNewListEntry_ms.php", $ListEntryData, true);

$data = retrieveSectionedService($debug, $opt, $pdo, $userid, $courseid, $coursevers, $log_uuid);
header('Content-Type: application/json');
echo json_encode($data);
