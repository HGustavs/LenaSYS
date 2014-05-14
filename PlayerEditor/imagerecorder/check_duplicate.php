<?php

	require_once("../../Shared/coursesyspw.php");
	require_once("../../Shared/database.php");
	
	pdoConnect();

	$lib = $_POST['lib'];
	
	if(isset($lib)) {
		
		$stmt = $pdo->prepare("SELECT id FROM playereditor_playbacks WHERE id = :id AND type=0 LIMIT 1");
		$stmt->bindParam(":id", $lib, PDO::PARAM_STR);
		
		$stmt->execute();
		
		
		if($stmt->fetch(PDO::FETCH_NUM) > 0) {
			$result = array("DUPLICATE" => "true");
		} 
		else {
			$result = array("DUPLICATE" => "false");
		}
		
		echo json_encode($result);
		
		
		
	}
?>