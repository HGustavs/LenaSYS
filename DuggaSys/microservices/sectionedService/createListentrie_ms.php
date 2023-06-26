<?php

pdoConnect();
session_start();

$opt=getOP('opt');
$courseid=getOP('courseid');
$coursevers=getOP('coursevers');
$moment=getOP('moment');
$sectid=getOP('lid');
$sectname=getOP('sectname');
$kind=getOP('kind');
$link=getOP('link');
$visibility=getOP('visibility');
$order=getOP('order');
$gradesys=getOP('gradesys');
$highscoremode=getOP('highscoremode');
$versid=getOP('versid');
$coursename=getOP('coursename');
$versname=getOP('versname');
$coursecode=getOP('coursecode');
$coursenamealt=getOP('coursenamealt');
$comments=getOP('comments');
$makeactive=getOP('makeactive');
$startdate=getOP('startdate');
$enddate=getOP('enddate');
$showgrps=getOP('showgrp');
$grptype=getOP('grptype');
$deadline=getOP('deadline');
$relativedeadline=getOP('relativedeadline');
$pos=getOP('pos');
$jsondeadline = getOP('jsondeadline');
$studentTeacher = false;
$feedbackenabled =getOP('feedback');
$feedbackquestion =getOP('feedbackquestion');
$motd=getOP('motd');
$tabs=getOP('tabs');
$exampelid=getOP('exampleid');
$url=getOP('url');

date_default_timezone_set("Europe/Stockholm");

include('../shared_microservices/getUid_ms.php');

else if(strcmp($opt,"NEW")===0) {

// Insert a new code example and update variables accordingly.
if($link==-1) {
    $queryz2 = $pdo->prepare("SELECT * FROM codeexample ORDER BY exampleid DESC LIMIT 1");
    if(!$queryz2->execute()) {
        $error=$queryz2->errorInfo();
        $debug="Error reading entries".$error[2];
    }
    foreach($queryz2->fetchAll() as $row) {
        $sname=$row['exampleid'] + 1;
    }
        $sname = $sectname . $sname;
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

$query = $pdo->prepare("INSERT INTO listentries (cid,vers, entryname, link, kind, pos, visible,creator,comments, gradesystem, highscoremode, groupKind) 
                                             VALUES(:cid,:cvs,:entryname,:link,:kind,:pos,:visible,:usrid,:comment, :gradesys, :highscoremode, :groupkind)");

if ($kind == 4) {
    $query->bindParam(':gradesys', $gradesys);
} else {
    $query->bindParam(':gradesys', $tabs);
}

$query->bindParam(':cid', $courseid);
$query->bindParam(':cvs', $coursevers);
$query->bindParam(':usrid', $userid);
$query->bindParam(':entryname', $sectname);
$query->bindParam(':link', $link);
$query->bindParam(':kind', $kind);
$query->bindParam(':comment', $comments);
$query->bindParam(':visible', $visibility);
$query->bindParam(':highscoremode', $highscoremode);
$query->bindParam(':pos', $pos);	

if ($grptype != "UNK") {
    $query->bindParam(':groupkind', $grptype);
} else {
    $query->bindValue(':groupkind', null, PDO::PARAM_STR);

    // Logging for newly added items
    $description=$sectname;
     logUserEvent($userid, $username, EventTypes::SectionItems,$sectname);

}


if(!$query->execute()) {
    $error=$query->errorInfo();
    $debug="Error updating entries".$error[2];
}

?>