<?php
date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "retrieveShowDuggaService_ms.php";

// Connect to database and start session
pdoConnect();
session_start();

if(isset($_SESSION['uid'])){
	$userid=$_SESSION['uid'];
	$loginname=$_SESSION['loginname'];
	$lastname=$_SESSION['lastname'];
	$firstname=$_SESSION['firstname'];
}else{
	$userid="student";		
} 	

$hash=getOP('hash');
$moment=getOP('moment');

$variant = array();
$answer = array();
$variantanswer = null;
$param = null;
$newcourseid=array();
$newcoursevers=array();
$newduggaid=array();

if($hash!="UNK"){
    $sql="SELECT vid,variant.variantanswer AS variantanswer,useranswer,param,cid,vers,quiz FROM userAnswer LEFT JOIN variant ON userAnswer.variant=variant.vid WHERE hash=:hash";
    $query = $pdo->prepare($sql);
    $query->bindParam(':hash', $hash);
    $result = $query->execute();
    $rows = $query->fetchAll();

    //if the hash didn't work then retrive all answers for that moment
    if($rows == NULL){
        //changed WHERE key to moment instead of hash since hash isn't working correctly. It appears to work so long as their is an entry for that moment in userAnswer
        $sql="SELECT vid,variant.variantanswer AS variantanswer,useranswer,param,cid,vers,quiz FROM userAnswer LEFT JOIN variant ON userAnswer.variant=variant.vid WHERE moment=:moment";
        $query = $pdo->prepare($sql);
        $query->bindParam(':moment', $moment);
        $query->execute();
        $rows = $query->fetchAll();
    }

    foreach($rows as $row){
        $variant=$row['vid'];
        $answer=$row['useranswer'];
        $variantanswer=html_entity_decode($row['variantanswer']);
        $param=html_entity_decode($row['param']);
        $newcourseid=$row['cid'];
        $newcoursevers=$row['vers'];
        $newduggaid=$row['quiz'];
    }

}

$result = retrieveShowDuggaService(
    $moment,
    $pdo,
    $courseid,
    $hash,
    $hashpwd,
    $coursevers,
    $duggaid,
    $opt,
    $group,
    $score
);
echo json_encode($result);
exit;