<?php
date_default_timezone_set("Europe/Stockholm");

// Include basic application services
include_once "../curlService.php";
//include_once "./retrieveCodeviewerService_ms.php";
include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";

// Connect to database and start session
pdoConnect();
session_start();

// Global variables
$exampleId = getOP('exampleid');
$courseId = getOP('courseid');
$courseVersion = getOP('cvers');
$boxId = getOP('boxid');
$opt = getOP('opt');
$debug = "NONE!";
$userid = callMicroserviceGET("sharedMicroservices/getUid_ms.php");


$query1 = $pdo->prepare("DELETE FROM improw WHERE exampleid=:exampleid;");
$query1->bindValue(':exampleid', $exampleId);

$query2 = $pdo->prepare("DELETE FROM box WHERE exampleid=:exampleid;");
$query2->bindValue(':exampleid', $exampleId);

$query3 = $pdo->prepare("DELETE FROM impwordlist WHERE exampleid=:exampleid;");
$query3->bindValue(':exampleid', $exampleId);

$query4 = $pdo->prepare("DELETE FROM codeexample WHERE exampleid=:exampleid;");
$query4->bindValue(':exampleid', $exampleId);

$query5 = $pdo->prepare("DELETE FROM listentries WHERE lid=:lid;");
$lid = getOP('lid');
$query5->bindValue(':lid', $lid);

if (!$query1->execute()) {
    $error = $query1->errorInfo();
    echo (json_encode(array('writeaccess' => 'w', 'debug' => $error[2])));
    return;
}
if (!$query2->execute()) {
    $error = $query2->errorInfo();
    echo (json_encode(array('writeaccess' => 'w', 'debug' => $error[2])));
    return;
}
if (!$query3->execute()) {
    $error = $query3->errorInfo();
    echo (json_encode(array('writeaccess' => 'w', 'debug' => $error[2])));
    return;
}
if (!$query4->execute()) {
    $error = $query4->errorInfo();
    echo (json_encode(array('writeaccess' => 'w', 'debug' => $error[2])));
    return;
}
if (!$query5->execute()) {
    $error = $query5->errorInfo();
    echo (json_encode(array('writeaccess' => 'w', 'debug' => $error[2])));
    return;
}

//Re-engineer
$baseURL = "https://" . $_SERVER['HTTP_HOST'];
$url = $baseURL . "/DuggaSys/microservices/codeviewerService/retrieveCodeviewerService_ms.php";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'opt' => $opt,
    'exampleid' => $exampleId,
    'courseid' => $courseId,
    'cvers' => $courseVersion
]));

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
echo json_encode($data);
return;


