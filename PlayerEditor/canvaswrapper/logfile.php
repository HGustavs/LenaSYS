<?php
	
	$filename=date('d-m-Y G.i:s') . ".xml";
	$content = $_POST['string'];
	echo("creating file");
	file_put_contents("logs/".$filename, $content, FILE_APPEND);
?>