<?php
include_once ("../Shared/database.php");
pdoConnect();

$studentid = 21;
$duggaFeedback = '';


foreach ($pdo->query('SELECT * FROM userAnswer WHERE uid="'.$studentid.'"') as $useranswer){

	 $aid = $useranswer['aid'];
	 $grade = $useranswer['grade'];
	 $unfiltered_feedback = $useranswer['feedback'];

	 $duggaFeedback .= "<div>".$aid." ".$grade." ".$unfiltered_feedback."</div>";

}

echo json_encode(["duggaFeedback" => $duggaFeedback]);


?>