<?php
date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../curlService.php";


// Connect to database and start session
pdoConnect();
session_start();

$data = recieveMicroservicePOST([
    'moment','courseid','hash','hashpwd','coursevers','duggaid','opt','group','score'
]);

$moment = $data['moment'] ?? null;
$courseid  = $data['courseid'] ?? null;
$hash = $data['hash'] ?? null;
$hashpwd = $data['hashpwd'] ?? null;
$coursevers= $data['coursevers']?? null;
$duggaid = $data['duggaid'] ?? null;
$opt = $data['opt'] ?? null;
$group = $data['group'] ?? null;
$score = $data['score'] ?? null;


if(isset($_SESSION['uid'])){
	$userid=$_SESSION['uid'];
	$loginname=$_SESSION['loginname'];
	$lastname=$_SESSION['lastname'];
	$firstname=$_SESSION['firstname'];
}else{
	$userid="student";		
} 	

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


$postData = [
    'moment' => $moment, 
    'courseid' => $courseid, 
    'hash' => $hash, 
    'hashpwd' => $hashpwd, 
    'coursevers' => $coursevers,
    'duggaid' =>  $duggaid,
    'opt' =>  $opt,
    'group' =>  $group,
    'score' => $score
];
	
$response = callMicroservicePOST("showDuggaService/retrieveShowDuggaService_ms.php", $postData, true);

echo json_encode([
  'variant'       => $variant,
  'answer'        => $answer,
  'variantanswer' => $variantanswer,
  'param'         => $param,
  'newcourseid'   => $newcourseid,
  'newcoursevers' => $newcoursevers,
  'newduggaid'    => $newduggaid
]);