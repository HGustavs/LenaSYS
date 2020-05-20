<?php
include_once ("../Shared/database.php");
pdoConnect();

$uid = $_POST['uid'];
$gradedAnswer =array();

foreach ($pdo->query('SELECT * FROM useranswer WHERE uid="'.$uid.'"') as $useranswer){
  $aid = $useranswer['aid'];
  $uid = $useranswer['uid'];
  $moment = $useranswer['moment'];
  $grade = $useranswer['grade'];
  $marked = $useranswer['marked'];
  $feedback = $useranswer['feedback'];

  $gradedAnswer[] = array("aid" => $aid, "uid" => $uid, "moment" => $moment, "grade" => $grade, "marked" => $marked, "feedback" => $feedback,);

}
echo json_encode(["gradedAnswer"=> $gradedAnswer]);

?>