<?php
	
	// $libname = $_POST['libname'];
	$filepath = $_POST['filepath'];
	
	if(unlink($filepath)) {
		$data = array("SUCCESS" => "Image successfully removed");
	}
	else {
		$data = array("ERROR" => "Couldn't execute UNLINK()");
	}

	// Give response
	
	echo json_encode($data);
	
?>