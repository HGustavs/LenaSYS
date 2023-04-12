<?php

	$logText = $_POST['logJSON'];
	
	
	if($_POST['logJSON'])
		echo var_dump($_POST);			
	}
	
	//echo move_uploaded_file(
	//$_FILES["upfile"]["tmp_name"], 
	//"demo.txt"
	//) ? "OK" : "ERROR UPLOADING";

?>