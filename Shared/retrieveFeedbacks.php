<?php
include_once ("../Shared/database.php");
pdoConnect();

$uid = $_POST['uid'];
$gradedAnswer =array();
$htmlCode='';

foreach ($pdo->query('SELECT * FROM useranswer WHERE uid="'.$uid.'"') as $useranswer){
  $aid = $useranswer['aid'];
  $uid = $useranswer['uid'];
  $moment = $useranswer['moment'];
  $grade = $useranswer['grade'];
  $marked = $useranswer['marked'];
  $unfiltered_feedback = $useranswer['feedback'];
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
  $htmlCode .="<div><p>\"".$feedback." "."\"</p></div></div>";

}
echo json_encode(["gradedAnswer" => $htmlCode]);

?>