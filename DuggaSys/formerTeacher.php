<?php

	$query = $pdo->prepare('SELECT DISTINCT  user.ssn, user.firstname, user.lastname, user.email FROM user LEFT JOIN user_course ON (user.uid=user_course.uid) WHERE user_course.access="W"');
	$query->execute();
	$data = $query->fetchAll();
	
//	echo("<p>");
	
//	echo($data['ssn'] . " " . $data['firstname'] . " " . $data['lastname'] . " " . $data['email']);
	
//	echo("</p>");
//	$data = $query->fetchAll();
	
	echo("<select onchange=\"AddTeatcher(value);\">");
	echo( "<option selected=\"selected\"value=\"-1\" > Choose a teacher </option>\n\0");
	foreach($data as $result){
		echo( "<option value=\"" . $result['ssn'] . " " . $result['firstname'] . " " . $result['lastname'] . " " . $result['email'] . "\" >" . $result['firstname'] . " " . $result['lastname'] .  "</option>\n\0");
	}
	
	// The above code dosn't work.
	// find a way to write out every teacher in the array.
	//
	//	
	//
	echo("</select>");
	
?>