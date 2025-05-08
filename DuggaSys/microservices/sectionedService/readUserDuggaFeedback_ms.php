<?php
//---------------------------------------------------------------------------------------------------------------
// Microservice readUserDuggaFeedback
//---------------------------------------------------------------------------------------------------------------

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "./retrieveSectionedService_ms.php";

// Connect to database and start session
pdoConnect();
session_start();

if (!checklogin()) {
    $userid = "guest"; 
} else {
    $userid = isset($_SESSION['uid']) ? $_SESSION['uid'] : "guest"; 
}

$opt=getOP('opt');
$courseid=getOP('courseid');
$moment=getOP('moment');
$versid = getOP('vers');
$log_uuid=getOP('log_uuid');
$coursevers=getOP('coursevers');
$debug='NONE!';


$userfeedback=array();
$avgfeedbackscore=array();

// Fetches All data from Userduggafeedback

if(strcmp($opt,"GETUF")==0){
    $query = $pdo->prepare("SELECT * FROM userduggafeedback WHERE lid=:lid AND cid=:cid");
    $query->bindParam(':cid', $courseid);
    $query->bindParam(':lid', $moment);
    if(!$query->execute()) {
        $error=$query->errorInfo();
        $debug="Error reading userduggafeedback:".$error[2];
    }else{
        foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
            array_push(
                $userfeedback,
                array(
                    'ufid' => $row['ufid'],
                    'username' => $row['username'],
                    'cid' => $row['cid'],
                    'lid' => $row['lid'],
                    'score' => $row['score'],
                    'entryname' => $row['entryname']
                )
            );
        }
    }
    $query = $pdo->prepare("SELECT AVG(score) AS avgScore FROM userduggafeedback WHERE lid=:lid AND cid=:cid");
    $query->bindParam(':cid', $courseid);
    $query->bindParam(':lid', $moment);

    if(!$query->execute()) {
        $error=$query->errorInfo();
        $debug="Error reading userduggafeedback".$error[2];
    } else {
        $result = $query->fetch(PDO::FETCH_ASSOC);
        $avgfeedbackscore = $result['avgScore'];
    }

    $query = $pdo->prepare("SELECT feedbackquestion FROM listentries WHERE lid=:lid");
	$query->bindParam(':lid', $moment);
	if(!$query->execute()) {
        $error=$query->errorInfo();
        $debug="Error reading listentries".$error[2];
    } else {
        $result = $query->fetch(PDO::FETCH_ASSOC);
        $feedbackquestion = $result['feedbackquestion'];
    }
}

$data = retrieveSectionedService($debug, $opt, $pdo, $userid, $courseid, $coursevers, $log_uuid);
$data['userfeedback'] = $userfeedback;
$data['feedbackquestion'] = $feedbackquestion;
$data['avgfeedbackscore'] = $avgfeedbackscore;
echo json_encode($data);
return;
