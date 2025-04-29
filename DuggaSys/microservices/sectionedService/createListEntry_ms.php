<?php
date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../sharedMicroservices/getUid_ms.php";
include_once "../sharedMicroservices/retrieveUsername_ms.php";
//include_once "../sharedMicroservices/createNewListEntry_ms.php";
include_once "../sharedMicroservices/createNewCodeExample_ms.php";
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

    $data = createNewCodeExample($pdo,$exampleid, $courseid, $coursevers, $sectname,$link,$log_uuid);
    $link=$data['link'];
    $debug=$data['debug']; header("Content-Type: application/json");
    
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

//get values from post
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['cid'], $_POST['versid'])) {
        $courseid = $_POST['courseid'];
        $coursevers = $_POST['coursevers'];
        $userid = $_POST['userid'];
        $sectname = $_POST['sectname'];
        $link = $_POST['link'];
        $kind = $_POST['kind'];
        $comments = $_POST['comments'];
        $visibility = $_POST['visibility'];
        $highscoremode = $_POST['highscoremode'];
        $pos = $_POST['pos'];
        $gradesys = $_POST['gradesys'];
        $tabs = $_POST['tabs'];
        $grptype = $_POST['grptype'];

    }
}

//set active course in database
$query = $pdo->prepare("INSERT INTO listentries 
(courseid, coursevers, userid, sectname, link, kind, comments, visibility, highscoremode, pos, gradesys, tabs, grptype)
VALUES
(:courseid, :coursevers, :userid, :sectname, :link, :kind, :comments, :visibility, :highscoremode, :pos, :gradesys, :tabs, :grptype)");

$query->bindParam(':courseid', $courseid);
$query->bindParam(':coursevers', $coursevers);
$query->bindParam(':userid', $userid);
$query->bindParam(':sectname', $sectname);
$query->bindParam(':link', $link);
$query->bindParam(':kind', $kind);
$query->bindParam(':comments', $comments);
$query->bindParam(':visibility', $visibility);
$query->bindParam(':highscoremode', $highscoremode);
$query->bindParam(':pos', $pos);
$query->bindParam(':gradesys', $gradesys);
$query->bindParam(':tabs', $tabs);
$query->bindParam(':grptype', $grptype);

$query->execute();

$data = retrieveSectionedService($debug, $opt, $pdo, $userid, $courseid, $coursevers, $log_uuid);
echo json_encode($data);
return;
?>
