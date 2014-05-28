<?php
	require_once("../../Shared/database.php");
	
	pdoConnect();

	$content = $_POST['string'];
	
	if(isset($_POST['lib'])) {
		// TODO: Sanitize the POST-data
		$library = $_POST['lib'];
	
		$path = "libs/image/".$library."/data.xml";

		if(isset($content)) {
			file_put_contents("../canvasrenderer/".$path, $content);
			
			$stmt = $pdo->prepare("INSERT INTO playereditor_playbacks(id, type, path) VALUES(:id, :type, :path)");
			
			$stmt->bindParam(":id", $library, PDO::PARAM_STR);
			$stmt->bindParam(":type", $int = 0, PDO::PARAM_INT);
			$stmt->bindParam(":path", $path, PDO::PARAM_STR);
			
			$stmt->execute();

			
		} else {
			die("No content.");
		}
		
		
		
	}
?>