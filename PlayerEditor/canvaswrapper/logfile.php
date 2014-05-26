<?php
	// Set filename to current date.
	$filename=date('YmdHis');
	$error = false;
	
	// The content that will be saved in the file.
	$content = $_POST['string'];

	// Try to create log file.
	try { 
		if(!@file_put_contents("../canvasrenderer/libs/canvas/".$filename.".xml", $content, FILE_APPEND)) {
			throw new Exception();
		}
	} catch (Exception $e) {
		$error = true;
		$data = array("ERROR" => "Couldn't create logfile.");
	}
	
	if(!$error) {
		$data = array("SUCCESS" => $filename);
	}
	// Give JSON response
	echo json_encode($data);
?>