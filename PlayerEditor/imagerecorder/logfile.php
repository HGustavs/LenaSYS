<?php

	require_once("../../Shared/coursesyspw.php");
	require_once("../../Shared/database.php");
	
	pdoConnect();

	$content = $_POST['string'];
	
	if(isset($_POST['lib'])) {
		// TODO: Sanitize the POST-data
		$library = $_POST['lib'];
	
		$path = "../canvasrenderer/libs/".$library."/data.xml";

		if(isset($content)) {
			file_put_contents($path, $content);
		} else {
			die("No content.");
		}
	}
?>