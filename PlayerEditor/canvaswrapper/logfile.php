<?php
	//A variable containing date function and type of file.
	$filename=date('d-m-Y G.i:s') . ".xml";
	//The content that will be saved in the file.
	$content = $_POST['string'];
	//Tells that a file has been created
	echo("creating file");
	// Write the contents back to the file with a path.
	// Using the FILE_APPEND flag to append all content to the end of the file.
	file_put_contents("logs/".$filename, $content, FILE_APPEND);
?>