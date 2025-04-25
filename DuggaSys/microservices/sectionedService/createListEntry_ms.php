<?php
date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../sharedMicroservices/getUid_ms.php";
include_once "../sharedMicroservices/retrieveUsername_ms.php";
include_once "../sharedMicroservices/createNewListEntry_ms.php";
include_once "./retrieveSectionedService_ms.php";

pdoConnect();
session_start();

$opt=getOP('opt'); 
$courseid=getOP('courseid');
$coursevers=getOP('coursevers');
$sectname=getOP('sectname');
$kind=getOP('kind');
$link=getOP('link');
$visibility=getOP('visibility');
$gradesys=getOP('gradesys');
$highscoremode=getOP('highscoremode');
$comments=getOP('comments');
$grptype=getOP('grptype');
$pos=getOP('pos');
$tabs=getOP('tabs');
$userid=getUid();
$log_uuid=getOP('log_uuid');
$templateNumber=getOP('templateNumber');
$exampleid=getOP('exampleid');
$debug = "NONE!";

global $pdo;


// Insert a new code example and update variables accordingly.
if($link==-1) {
    $queryz2 = $pdo->prepare("SELECT * FROM codeexample ORDER BY exampleid DESC LIMIT 1");
    if(!$queryz2->execute()) {
        $error=$queryz2->errorInfo();
        $debug="Error reading entries".$error[2];
    }
    foreach($queryz2->fetchAll() as $row) {
        $exampleid=$row['exampleid'];
    }
    //$data = createNewCodeExample($pdo,$exampleid, $courseid, $coursevers, $sectname,$link,$log_uuid);
    //$link=$data['link'];

    //set url for createNewCodeExample.php path
    $baseURL = "https://" . $_SERVER['HTTP_HOST'];
    $url = $baseURL . "/LenaSYS/DuggaSys/microservices/sharedMicroservices/createNewCodeExample_ms.php";
    $ch = curl_init($url);
    //options for curl
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        'exampleid'=> $exampleid,
        'courseid'=> $courseid,
        'coursevers'=> $coursevers, 
        'sectionname'=> $sectionname,
        'link'=> $link,
        'log_uuid'=> $log_uuid, 
        'templateNumber'=> $templateNumber
    ]));
       
    $response = curl_exec($ch);
    $data = json_decode($response, true);
    $link = $data;
    curl_close($ch);
}

$debug = createNewListEntry($pdo,
    $courseid,
    $coursevers,
    $userid,
    $sectname,
    $link,
    $kind,
    $comments,
    $visibility,
    $highscoremode,
    $pos,
    $gradesys,
    $tabs,
    $grptype);


$data = retrieveSectionedService($debug, $opt, $pdo, $userid, $courseid, $coursevers, $log_uuid);
header('Content-Type: application/json')
echo json_encode($data);
return;
?>
