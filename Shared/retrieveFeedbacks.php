<?php
date_default_timezone_set("Europe/Stockholm");
include_once ("../Shared/database.php");
pdoConnect();

$studentid = $_POST['studentid'];
$duggaFeedback = '';
$todayDate = date("Y-m-d H:i:s");
foreach ($pdo->query('SELECT userAnswer.aid, userAnswer.moment, userAnswer.grade, userAnswer.marked, userAnswer.feedback, userAnswer.seen_status, listentries.entryname, user.firstname, user.lastname, vers.coursecode, vers.versname, userAnswer.vers AS useranswerVersid, userAnswer.cid AS useranswerCid, userAnswer.uid AS studentid, userAnswer.creator AS markedAuthorid FROM userAnswer, listentries, user, vers WHERE userAnswer.moment=listentries.lid AND userAnswer.creator=user.uid AND userAnswer.cid=vers.cid AND userAnswer.vers=vers.vers AND userAnswer.uid="'.$studentid.'" ORDER BY marked DESC') as $useranswer){
  $markedAuthorid = $useranswer['markedAuthorid'];
  $aid = $useranswer['aid'];
  $studentid = $useranswer['studentid'];
  $moment = $useranswer['moment'];
  $grade = $useranswer['grade'];
  $marked = $useranswer['marked'];
  $unfiltered_feedback = $useranswer['feedback'];
  $cid = $useranswer['useranswerCid'];
  $versid = $useranswer['useranswerVersid'];
  $recent_feedback;
  $dayName = date('D', strtotime($marked));
  $monthName = date('M', strtotime($marked));
  $date = new DateTime($marked);
  $dateTime = $date->format('d Y H:i:s');
  $markedDate = $dayName. " ".$monthName." ".$dateTime;
  $seen_status = $useranswer['seen_status'];
  $entryname = $useranswer['entryname'];
  $firstname = $useranswer['firstname'];
  $lastname = $useranswer['lastname'];
  $creator = $firstname." ".$lastname;
  $coursecode = $useranswer['coursecode'];
  $versname = $useranswer['versname'];
 
  if(strpos($unfiltered_feedback, '||') !== false){
    $recent_feedback = substr(strrchr($unfiltered_feedback, '||'), 1);

  }else{
    $recent_feedback = $unfiltered_feedback;

  }
  $remove_date = strstr($recent_feedback, '%%');
  $feedback = str_replace('%%', "\n", $remove_date);
  $feedbackAvailableDate= date('Y-m-d H:i:s', strtotime($marked. ' + 7 days'));
  if($feedbackAvailableDate > $todayDate && $grade != null){
    $duggaFeedback .="<div class='feedback_card recentFeedbacks'>";

  }elseif ($feedbackAvailableDate < $todayDate && $grade != null) {
    $duggaFeedback .="<div class='feedback_card oldFeedbacks'>";
    
  }
  if($grade != null  || $grade != 0){
    if ($grade == 2) {
    	 $duggaFeedback .="<div class='listentries'><span><img src='../Shared/icons/complete.svg'></span>";
    	 $duggaFeedback .="<span class='entryname'><b>".$entryname."</b></span></div>";
    	 $duggaFeedback .="<div class='markedDate markedPass'><p>Dugga marked as pass: ".$markedDate."</p></div>";

    }else if($grade == 1){
    	 $duggaFeedback .="<div class='listentries'><span><img src='../Shared/icons/uncomplete.svg'></span>";
    	 $duggaFeedback .="<span class='entryname'><b>".$entryname."</b></span></div>";
    	 $duggaFeedback .="<div class='markedDate markedFail'><p>Dugga marked as fail: ".$markedDate."</p></div>";
    }
    if($feedback == null || $feedback == ''){
       $duggaFeedback .="<div class='feedbackCommentWrapper'><p class='feedbackComment'>No comments.........</p></div>";

    }else{
      $duggaFeedback .="<div class='feedbackCommentWrapper'><p class='feedbackComment'>\"".$feedback." "."\"</p></div>";

    }
    $duggaFeedback .="<div class='feedback_card_footer'>";
    $duggaFeedback .="<div>- ".$creator."</div>";
    $duggaFeedback .= "<div>".$coursecode." ".$versname." - ".$versid."</div>";
    $duggaFeedback .= "</div>";

  }
  $duggaFeedback .= "</div>";

}
if(isset($_POST['studentid']) && isset($_POST['viewed'])){
  $studentid = $_POST['studentid'];
  $seen_status = 1;
  $update_seen_feedback_status = 'UPDATE userAnswer SET seen_status=:seen_status WHERE uid=:uid AND grade IS NOT NULL';
  $stmt = $pdo->prepare($update_seen_feedback_status); 
  $stmt->bindParam(':uid', $studentid);
  $stmt->bindParam(':seen_status', $seen_status);     

  $stmt->execute();

}
//count un-seen feedbacks
$unreadFeedbackNotification = $pdo->query('SELECT COUNT(*) FROM userAnswer WHERE (grade IS NOT NULL) AND seen_status = "0" AND uid ="'.$studentid.'"')->fetchColumn(); 

echo json_encode(["duggaFeedback" => $duggaFeedback, "unreadFeedbackNotification" => $unreadFeedbackNotification]);

?>