<?php
include_once ("../Shared/database.php");
pdoConnect();

$studentid = $_GET['studentid'];
$duggaFeedback = '';


foreach ($pdo->query('SELECT * FROM useranswer') as $useranswer){

	 $aid = $useranswer['aid'];
	 $grade = $useranswer['grade'];
	 $unfiltered_feedback = $useranswer['feedback'];

	 $duggaFeedback .= "<div>".$aid." ".$grade." ".$unfiltered_feedback."</div>";

}

echo json_encode(["duggaFeedback" => $duggaFeedback]);


?>