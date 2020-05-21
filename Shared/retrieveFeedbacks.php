<?php
date_default_timezone_set("Europe/Stockholm");
include_once ("../Shared/database.php");
pdoConnect();

$uid = $_POST['uid'];
$gradedAnswer =array();
$htmlCode='';
$todayDate = date("Y-m-d H:i:s");
foreach ($pdo->query('SELECT * FROM useranswer WHERE uid="'.$uid.'" ORDER BY marked DESC') as $useranswer){
  $creatorid = $useranswer['creator'];
  $aid = $useranswer['aid'];
  $uid = $useranswer['uid'];
  $moment = $useranswer['moment'];
  $grade = $useranswer['grade'];
  $marked = $useranswer['marked'];
  $unfiltered_feedback = $useranswer['feedback'];
  $cid = $useranswer['cid'];
  $versid = $useranswer['vers'];
  $recent_feedback;
  $dayName = date('D', strtotime($marked));
  $monthName = date('M', strtotime($marked));
  $date = new DateTime($marked);
  $dateTime = $date->format('d Y H:i:s');
  $markedDate = $dayName. " ".$monthName." ".$dateTime;
  $seen_status = $useranswer['seen_status'];
  if(strpos($unfiltered_feedback, '||') !== false){
    $recent_feedback = substr(strrchr($unfiltered_feedback, '||'), 1);
  }else{
    $recent_feedback = $unfiltered_feedback;
  }
  $remove_date = strstr($recent_feedback, '%%');
  $feedback = str_replace('%%', "\n", $remove_date);
  $feedbackAvailableDate= date('Y-m-d H:i:s', strtotime($marked. ' + 7 days'));
  if($feedbackAvailableDate > $todayDate){
    $htmlCode .="<div class='feedback_card recentFeedbacks'>";

  }elseif ($feedbackAvailableDate < $todayDate) {
    $htmlCode .="<div class='feedback_card oldFeedbacks'>";
    
  }

  //$htmlCode .= "<div>Marked date: ".$marked."<br>Feedback available date: ".$feedbackAvailableDate."<br>Today's date: ".$todayDate."</div>";
  if($grade != null  || $grade != 0){
    if ($grade == 2) {
    	 $htmlCode .="<div><span><img src='../Shared/icons/complete.svg'></span>";
    	 foreach ($pdo->query('SELECT entryname FROM listentries WHERE lid="'.$moment.'"') as $listentries) {
    	 	$entryname = $listentries['entryname'];
    	 	$htmlCode .="<span class='entryname'><b>".$entryname."</b></span></div>";
    	 	
    	 }
    	 $htmlCode .="<div class='markedPass'><p>Dugga marked as pass: ".$markedDate."</p></div>";
    }else if($grade == 1){
    	 $htmlCode .="<div><span><img src='../Shared/icons/uncomplete.svg'></span>";
    	 foreach ($pdo->query('SELECT entryname FROM listentries WHERE lid="'.$moment.'"') as $listentries) {
    	 	$entryname = $listentries['entryname'];
    	 	$htmlCode .="<span class='entryname'><b>".$entryname."</b></span></div>";
    	 	
    	 }
    	 $htmlCode .="<div class='markedFail'><p>Dugga marked as fail: ".$markedDate."</p></div>";
    }
    if($feedback == null || $feedback == ''){
       $htmlCode .="<div><p class='feedbackComment'>No comments.........</p></div>";
    }else{
      $htmlCode .="<div><p class='feedbackComment'>\"".$feedback." "."\"</p></div>";

    }
    $htmlCode .="<div class='feedback_card_footer'>";
    foreach ($pdo->query('SELECT firstname, lastname FROM user WHERE uid="'.$creatorid.'"') as $user) {
      $firstname = $user['firstname'];
      $lastname = $user['lastname'];
      $creator = $firstname." ".$lastname;
    }
    foreach ($pdo->query('SELECT * FROM vers WHERE cid="'.$cid.'" AND vers="'.$versid.'"') as $vers) {
      $coursecode = $vers['coursecode'];
      $versname = $vers['versname'];
      $coucode = $coursecode." ".$versname;
    }
    $htmlCode .="<div>- ".$creator."</div>";
    $htmlCode .= "<div>".$coucode." - ".$versid."</div>";
    $htmlCode .= "</div>";
  }
  $htmlCode .= "</div>";
}
if(isset($_POST['uid']) && isset($_POST['viewed'])){
  $uid = $_POST['uid'];
  $seen_status = 1;
  $update_seen_feedback_status = 'UPDATE useranswer SET seen_status=:seen_status WHERE uid=:uid AND grade IS NOT NULL';
  $stmt = $pdo->prepare($update_seen_feedback_status); 
  $stmt->bindParam(':uid', $uid);
  $stmt->bindParam(':seen_status', $seen_status);     

  $stmt->execute();
}
//count un-seen feedbacks
$unreadFeedbackNotification = $pdo->query('SELECT COUNT(*) FROM useranswer WHERE uid ="'.$uid.'" AND seen_status = "0" AND grade IS NOT NULL')->fetchColumn(); 

echo json_encode(["gradedAnswer" => $htmlCode, "unreadFeedbackNotification" => $unreadFeedbackNotification]);

?>