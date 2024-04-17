<?php



if(isset($dbpwd) && strcmp($hashpwd,$dbpwd) === 0){
	$query = $pdo->prepare("UPDATE userAnswer SET submitted=NOW(), useranswer=:useranswer, timesSubmitted=timesSubmitted+1 WHERE hash=:hash AND password=:hashpwd;");
	$query->bindParam(':hash', $hash);
	$query->bindParam(':hashpwd', $hashpwd);
	$query->bindParam(':useranswer', $answer);
	if(!$query->execute()) {
		$error=$query->errorInfo();
		$debug="Error updating variant (row ".__LINE__.") Error code: ".$error[2];
	}
}

?>