<?php
date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
//include_once "retrieveShowDuggaService_ms.php";

// Connect to database and start session
pdoConnect();
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $moment = $_POST['moment'] ?? null;
    $courseid = $_POST['courseid'] ?? null;
    $hash = $_POST['hash'] ?? null;
    $hashpwd = $_POST['hashpwd'] ?? null;
    $coursevers = $_POST['coursevers'] ?? null;
    $duggaid = $_POST['duggaid'] ?? null;
    $opt = $_POST['opt'] ?? null;
    $group = $_POST['group'] ?? null;
    $score = $_POST['score'] ?? null;
}

if(isset($_SESSION['uid'])){
	$userid=$_SESSION['uid'];
	$loginname=$_SESSION['loginname'];
	$lastname=$_SESSION['lastname'];
	$firstname=$_SESSION['firstname'];
}else{
	$userid="student";		
} 	
/*
$hash=getOP('hash');
$moment=getOP('moment');
$courseid   = getOP('courseid');
$hashpwd    = getOP('hashpwd');
$coursevers = getOP('coursevers');
$duggaid    = getOP('duggaid');
$opt        = getOP('opt');
$group      = getOP('group');
$score      = getOP('score');
*/
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

header("Content-Type: application/json");
//set url for setAsActiveCourse.php path
$baseURL = "https://" . $_SERVER['HTTP_HOST'];
$url = $baseURL . "/LenaSYS/DuggaSys/microservices/showDuggaService/retrieveShowDuggaService_ms.php";
$ch = curl_init($url);
    //options for curl
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'moment' => $moment, 
    'courseid' => $courseid, 
    'hash' => $hash, 
    'hashpwd' => $hashpwd, 
    'coursevers' => $coursevers,
    'duggaid' =>  $duggaid,
    'opt' =>  $opt,
    'group' =>  $group,
    'score' => $score
]));

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);

/*$result = retrieveShowDuggaService(
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
);*/
echo json_encode([
  'variant'       => $variant,
  'answer'        => $answer,
  'variantanswer' => $variantanswer,
  'param'         => $param,
  'newcourseid'   => $newcourseid,
  'newcoursevers' => $newcoursevers,
  'newduggaid'    => $newduggaid
]);
exit;