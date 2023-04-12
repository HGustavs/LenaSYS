<?php

	$logText = $_POST['logJSON'];
	
	$testVariabel = '<script>'.logText.'</script>';
	echo $testVariabel;

	if ($_POST) {
		echo var_dump($_POST);
    }


	//echo move_uploaded_file(
	//$_FILES["upfile"]["tmp_name"], 
	//"demo.txt"
	//) ? "OK" : "ERROR UPLOADING";

?>