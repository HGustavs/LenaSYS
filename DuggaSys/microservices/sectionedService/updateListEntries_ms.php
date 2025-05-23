<?php
date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../sharedMicroservices/getUid_ms.php";
include_once "../curlService.php";

// Connect to database and start session.
pdoConnect();
session_start();

$opt=getOP('opt');
$motd=getOP('courseid');
$readonly=getOP('coursevers');

$coursename=getOP('coursename');
$sectid=getOP('lid');
$sectname=getOP('sectname');
$comments=getOP('comments');
$highscoremode=getOP('highscoremode');
$feedbackenabled =getOP('feedback');
$feedbackquestion =getOP('feedbackquestion');
$courseid=getOP('courseid');
$coursevers=getOP('coursevers');
$link=getOP('link');
$kind=getOP('kind');
$moment=getOP('moment');
$visibility=getOP('visibility');
$grptype=getOP('grptype');
$tabs=getOP('tabs');
$gradesys=getOP('gradesys');
$userid = getUid();
$log_uuid=getOP('log_uuid');
$debug='NONE!';

if($feedbackenabled != 1){
	$feedbackenabled = 0;
}

if(strcmp($opt,"UPDATE")===0) {
    // Insert a new code example and update variables accordingly.
    if($link==-1) {

        // Find section name - Last preceding section name if none - assigns UNK - so we know that nothing was found
        // kind 0 == Header || 1 == Section || 2 == Code  ||�3 == Test (Dugga)|| 4 == Moment�|| 5 == Link
        $sname = "UNK";
        $queryz = $pdo->prepare("SELECT entryname FROM listentries WHERE vers=:cversion AND cid=:cid AND (kind=1 or kind=0 or kind=4) AND (pos < (SELECT pos FROM listentries WHERE lid=:lid)) ORDER BY pos DESC LIMIT 1;");
        $queryz->bindParam(':cid', $courseid);
        $queryz->bindParam(':cversion', $coursevers);
        $queryz->bindParam(':lid', $sectid);
        if(!$queryz->execute()) {
            $error=$queryz->errorInfo();
            $debug="Error reading entries".$error[2];
        }
        foreach($queryz->fetchAll() as $row) {
            $sname=$row['entryname'];
        }

        $query2 = $pdo->prepare("INSERT INTO codeexample(cid,examplename,sectionname,uid,cversion) values (:cid,:ename,:sname,1,:cversion);");

        $query2->bindParam(':cid', $courseid);
        $query2->bindParam(':cversion', $coursevers);
        $query2->bindParam(':ename', $sectname);
        $query2->bindParam(':sname', $sname);

        if(!$query2->execute()) {
            $error=$query2->errorInfo();
            $debug="Error updating entries".$error[2];
        }

        $link=$pdo->lastInsertId();
    }

    $query = $pdo->prepare("UPDATE listentries set highscoremode=:highscoremode, gradesystem=:gradesys, moment=:moment,entryname=:entryname,kind=:kind,link=:link,visible=:visible,comments=:comments,groupKind=:groupkind, feedbackenabled=:feedbackenabled, feedbackquestion=:feedbackquestion WHERE lid=:lid;");

    if ($kind == 4) {
        $query->bindParam(':gradesys', $gradesys);
    } else {
        $query->bindParam(':gradesys', $tabs);
    }

    $query->bindParam(':lid', $sectid);
    $query->bindParam(':entryname', $sectname);
    $query->bindParam(':comments', $comments);
    $query->bindParam(':highscoremode', $highscoremode);
    $query->bindParam(':feedbackenabled', $feedbackenabled);
    $query->bindParam(':feedbackquestion', $feedbackquestion);

    if ($grptype != "UNK") {
        $query->bindParam(':groupkind', $grptype);
    } else {
        $query->bindValue(':groupkind', null, PDO::PARAM_STR);
    }

    if($moment=="null") $query->bindValue(':moment', null,PDO::PARAM_INT);
    else $query->bindParam(':moment', $moment);

    $query->bindParam(':kind', $kind);
    $query->bindParam(':link', $link);
    $query->bindParam(':visible', $visibility);

    if(!$query->execute()) {
        $error=$query->errorInfo();
        $debug="Error updating entries".$error[2];
    }

    // insert into list forthe specific course
    if($kind == 4){
        $query2 = $pdo->prepare("INSERT INTO list(listnr,listeriesid,responsible,course) values('23415',:lid,'Christina Sjogren',:cid);");

        $query2->bindParam(':cid', $courseid);
        $query2->bindParam(':lid', $sectid);

        if(!$query2->execute()) {
            $error=$query2->errorInfo();
            $debug="Error updating entries".$error[2];
        }
    }
}

$postData = [
    'debug' => $debug,
    'opt' => $opt,
    'uid' => $userid,
    'cid' => $courseid,
    'vers' => $coursevers,
    'log_uuid' => $log_uuid
];

header("Content-Type: application/json");
$data = callMicroservicePOST("sectionedService/retrieveSectionedService_ms.php", $postData, true );
echo $data;
return;