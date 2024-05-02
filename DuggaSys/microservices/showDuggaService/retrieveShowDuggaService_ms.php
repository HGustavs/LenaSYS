<?php

function retrieveShowDuggaService(
	$debug="NONE!",
	$param,
	$answer,
	$variantanswer,
	$score,
	$highscoremode,
	$grade,
	$submitted,
	$marked,
	$duggainfo,
	$files,
	$userfeedback,
	$feedbackquestion,
	$savedvariant,
	$ishashindb,
	$variantsize,
	$variantvalue,
	$password,
	$hashvariant,
	$isFileSubmitted,
	$isTeacher, // isTeacher is true for both teachers and superusers
	$variants,
	$duggatitle,
	$hash,
	$hashpwd,
	$opt,
	$link,
	$active,
	$group,
	){
	$array = array(
			"debug" => $debug,
			"param" => $param,
			"answer" => $answer,
			"danswer" => $variantanswer,
			"score" => $score,
			"highscoremode" => $highscoremode,
			"grade" => $grade,
			"submitted" => $submitted,
			"marked" => $marked,
			"deadline" => $duggainfo['deadline'],
			"release" => $duggainfo['qrelease'],
			"files" => $files,
			"userfeedback" => $userfeedback,
			"feedbackquestion" => $feedbackquestion,
			"variant" => $savedvariant,
			"ishashindb" => $ishashindb,
			"variantsize" => $variantsize,
			"variantvalue" => $variantvalue,
			"password" => $password,
			"hashvariant" => $hashvariant,
			"isFileSubmitted" => $isFileSubmitted,
			"isTeacher" => $isTeacher, // isTeacher is true for both teachers and superusers
			"variants" => $variants,
			"duggaTitle" => $duggatitle,
			"hash" => $hash,
			"hashpwd" => $hashpwd,
			"opt" => $opt,
			"link" => $link,
			"activeusers" => $active,

		);
	if (strcmp($opt, "GRPDUGGA")==0) $array["group"] = $group;
	header('Content-Type: application/json');
	echo json_encode($array);
}

?>