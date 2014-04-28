<?php
	
	$filename=date('d-m-Y G.i:s') . ".xml";
	$content = $_POST['string'];
	
	echo("creating file");
	if(isset($content)) {
		$fh=fopen("logs/".$filename,'w');
		
		fwrite($fh, $content);
		fclose($fh);
		echo("File Created, Click <a href='$filename'> Here </a> to view it.");
	} else {
		die("No string");
	}

?>