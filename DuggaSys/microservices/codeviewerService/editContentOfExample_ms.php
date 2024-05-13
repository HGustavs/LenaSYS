<?php

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../sharedMicroservices/getUid_ms.php";
include_once "./retrieveCodeviewerService_ms.php";

pdoConnect();
session_start();

$opt=getOP('opt');

$exampleId=getOP('exampleid');
$boxId=getOP('boxid');
$boxTitle=getOP('boxtitle');
$boxContent=getOP('boxcontent');
$wordlist=getOP('wordlist');
$filename=getOP('filename');
$fontsize = getOP('fontsize');
$addedRows = getOP('addedRows');
$removedRows = getOP('removedRows');
$debug="NONE!";
$userid=getUid();

if(strcmp('EDITCONTENT',$opt)===0) {
    $query = $pdo->prepare("UPDATE box SET boxtitle=:boxtitle, boxcontent=:boxcontent, filename=:filename, fontsize=:fontsize, wordlistid=:wordlist WHERE boxid=:boxid AND exampleid=:exampleid;");
    $query->bindParam(':boxtitle', $boxTitle);
    $query->bindParam(':boxcontent', $boxContent);
    $query->bindParam(':wordlist', $wordlist);
    $query->bindParam(':filename', $filename);
    $query->bindParam(':fontsize', $fontsize);
    $query->bindParam(':boxid', $boxId);
    $query->bindParam(':exampleid', $exampleId);
    $query->execute();
    if (isset($_POST['addedRows'])) {
        preg_match_all("/\[(.*?)\]/", $addedRows, $matches, PREG_PATTERN_ORDER);
        foreach ($matches[1] as $match) {
            $row = explode(",", $match);
            $query = $pdo->prepare("INSERT INTO improw(boxid,exampleid,istart,iend,uid) VALUES (:boxid,:exampleid,:istart,:iend,:uid);");
            $query->bindValue(':boxid', $boxId);
            $query->bindValue(':exampleid', $exampleId);
            $query->bindValue(':istart', $row[1]);
            $query->bindValue(':iend', $row[2]);
            $query->bindValue(':uid', $_SESSION['uid']);
            $query->execute();
        }
    }

    if (isset($_POST['removedRows'])) {
        preg_match_all("/\[(.*?)\]/", $removedRows, $matches, PREG_PATTERN_ORDER);
        foreach ($matches[1] as $match) {
            $row = explode(",", $match);
            $query = $pdo->prepare("DELETE FROM improw WHERE boxid=:boxid AND istart=:istart AND iend=:iend AND exampleid=:exampleid;");
            $query->bindValue(':boxid', $boxId);
        $query->bindValue(':exampleid', $exampleId);
            $query->bindValue(':istart', $row[1]);
            $query->bindValue(':iend', $row[2]);
            $query->execute();
        }
    }
}
$array=retrieveCodeviewerService($opt,$pdo,$userid,$debug);
echo json_encode($array);
return;
