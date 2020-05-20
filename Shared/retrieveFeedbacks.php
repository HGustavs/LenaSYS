<?php
include_once ("../Shared/database.php");
pdoConnect();

$uid = $_POST['uid'];
$gradedAnswer =array();
$htmlCode='';

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
  //$htmlCode .= "<div>""</div>";
  if(strpos($unfiltered_feedback, '||') !== false){
    $recent_feedback = substr(strrchr($unfiltered_feedback, '||'), 1);
  }else{
    $recent_feedback = $unfiltered_feedback;
  }
  $remove_date = strstr($recent_feedback, '%%');
  $feedback = str_replace('%%', "\n", $remove_date);

  $htmlCode .="<div class='feedback_card'>";
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
      $htmlCode .="<div ><p class='feedbackComment'>\"".$feedback." "."\"</p></div>";

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
    $htmlCode .="<div><span>".$coucode." - ".$versid."</span><span class='creator'>- ".$creator."</span></div>";
    $htmlCode .= "</div></div>";
  }
}
echo json_encode(["gradedAnswer" => $htmlCode]);

?>