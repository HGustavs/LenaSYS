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
  $feedback = $useranswer['feedback'];

  if ($grade == 2) {
  	 $htmlCode .="<div class='feedback_card'><span><img src='../Shared/icons/complete.svg'></span><span><b>".$moment."</b></span></div>";
  	 $htmlCode .="<div><p>Dugga marked as pass: ".$marked."</p></div>";
  }else if($grade == 1){
  	 $htmlCode .="<div><span><img src='../Shared/icons/uncomplete.svg'></span><span><b>".$moment."</b></span></div>";
  	 $htmlCode .="<div><p>Dugga marked as fail: ".$marked."</p></div>";
  }
  $htmlCode .="<div><p>".$feedback."</p></div>";

  //$gradedAnswer[] = array("aid" => $aid, "uid" => $uid, "moment" => $moment, "grade" => $grade, "marked" => $marked, "feedback" => $feedback,);

}
//echo json_encode(["gradedAnswer"=> $gradedAnswer]);
echo json_encode(["gradedAnswer" => $htmlCode]);

?>