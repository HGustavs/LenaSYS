<?php

	$content = $_POST['string'];
	
	if(isset($_GET['lib'])) {
		// TODO: Sanitize the GET-data
		$library = $_GET['lib'];
	
		$path = "librarys/".$library."/data.xml";
		echo("creating file");
		if(isset($content)) {
			file_put_contents($path, $content);
		} else {
			die("No content.");
		}
	}
?>