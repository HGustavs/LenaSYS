<?php

	$logText = $_POST['logJSON'];
	
	debug(logText);
	
	function debug($debug) {
		echo $debug;			
	}
	
	//echo move_uploaded_file(
	//$_FILES["upfile"]["tmp_name"], 
	//"demo.txt"
	//) ? "OK" : "ERROR UPLOADING";

?>