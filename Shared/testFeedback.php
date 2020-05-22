<?php
include_once ("../Shared/database.php");
pdoConnect();

$studentid = $_GET['studentid'];
$duggaFeedback = '';


foreach ($pdo->query('SELECT useranswer.aid, useranswer.moment, useranswer.grade, useranswer.marked, useranswer.feedback, useranswer.seen_status, listentries.entryname, user.firstname, user.lastname, vers.coursecode, vers.versname, useranswer.vers AS useranswerVersid, useranswer.cid AS useranswerCid, useranswer.uid AS studentid, useranswer.creator AS markedAuthorid FROM useranswer, listentries, user, vers WHERE useranswer.moment=listentries.lid AND useranswer.creator=user.uid AND useranswer.cid=vers.cid AND useranswer.vers=vers.vers AND useranswer.uid="'.$studentid.'" ORDER BY marked DESC') as $useranswer){

	 $aid = $useranswer['aid'];
	 $grade = $useranswer['grade'];
	 $unfiltered_feedback = $useranswer['feedback'];
	 $firstname = $useranswer['firstname'];
  	 $lastname = $useranswer['lastname'];
	 $creator = $firstname." ".$lastname;

	 $duggaFeedback .= "<div>".$aid." ".$grade." ".$unfiltered_feedback." ".$creator."</div>";

}

echo json_encode(["duggaFeedback" => $duggaFeedback]);


?>