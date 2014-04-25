<?php
	
	$filename=date('d-m-Y G.i:s') . ".xml";
	$content = $_POST['string'];
	
	echo("creating file");
	if(isset($content)) {
		$path=("/home/StudentHome/2012/a12madka/public_html/GitHub/LenaSYS_2014/PlayerEditor/CanvasWrapper/logs");
		$fh=fopen($path."/".$filename,'w');
		fwrite($fh, $content);
		fclose($fh);
		echo("File Created, Click <a href='$filename'> Here </a> to view it.");
	} else {
		die("No string");
	}

?>