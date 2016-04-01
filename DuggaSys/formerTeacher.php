<?php

	$query = $pdo->prepare('SELECT DISTINCT  user.ssn, user.firstname, user.lastname, user.email FROM user LEFT JOIN user_course ON (user.uid=user_course.uid) WHERE user_course.access="W"');
	$query->execute();
	$row = $query->rowCount();
	$result = $query->fetch();
	
	echo("<select>");
	
//	for($i=0;$i<$row;$i++){
//		$str = $result[$i]['ssn']+" "+$result[$i]['firstname']+" "+$result[$i]['lastname']+" "+$result[$i]['email'];
//		$name = $teacher['firstname']+" "+$teacher['lastname'];
//		echo( "<option value=\""+$str+"\">"+$name+"</option>\n\0");
//	}
	
	// The above code dosn't work.
	// find a way to write out every teacher in the array.
	//
	//	
	//
	echo("</select>");
	
?>