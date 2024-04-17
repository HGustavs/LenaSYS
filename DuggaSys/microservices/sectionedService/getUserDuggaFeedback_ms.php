<?php
//---------------------------------------------------------------------------------------------------------------
// Microservice getUserDuggaFeedback
//---------------------------------------------------------------------------------------------------------------

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";

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
$sectid=getOP('lid');


$userfeedback=array();
$avgfeedbackscore=array();

// Fetches All data from Userduggafeedback

if(strcmp($opt,"GETUF")==0){
    $query = $pdo->prepare("SELECT * FROM userduggafeedback WHERE lid=:lid AND cid=:cid");
    $query->bindParam(':cid', $courseid);
    $query->bindParam(':lid', $sectid);
    if(!$query->execute()) {
        $error=$query->errorInfo();
        $debug="Error reading courses".$error[2];
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
    $query->bindParam(':lid', $sectid);

    if(!$query->execute()) {
        $error=$query->errorInfo();
        $debug="Error reading courses".$error[2];
    } else {
        $result = $query->fetch(PDO::FETCH_ASSOC);
        $avgfeedbackscore = $result['avgScore'];
    }
}
echo json_encode(array('userfeedback'=> $userfeedback,'avgfeedbackscore' => $avgfeedbackscore));

return;
