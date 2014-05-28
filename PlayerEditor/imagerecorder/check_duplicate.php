<?php
	require_once("../../Shared/database.php");
	
	pdoConnect();

	$lib = $_POST['lib'];
	
	if(isset($lib)) {
		
		$stmt = $pdo->prepare("SELECT id,path FROM playereditor_playbacks WHERE id = :id AND type=0 LIMIT 1");
		$stmt->bindParam(":id", $lib, PDO::PARAM_STR);
		
		$stmt->execute();
		$row = $stmt->fetch();		
		
		if($row['path']) {

			$result = array("DUPLICATE" => "true", "PATH" => $row['path']);
		} 
		else {
			$result = array("DUPLICATE" => "false");
		}
		
		echo json_encode($result);
		
		
		
	}
?>