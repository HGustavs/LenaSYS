<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<title>Prototype imagerecorder</title>
<style>
</style>
	<link href="stylesheet.css" rel="stylesheet" type="text/css"/>
	<script language="javascript" src="../js/Imagerecorder/imagerecorder.js"></script>
	<script language="javascript" src="../js/jquery-1.11.0.min.js"></script>	
</head>
<script>
var imagerec = new imagerecorder("ImageCanvas");
</script>
	<body onload="">
	<div class="wrapper">
		<div class="header">Image Recorder</div>
			<div class="cords">
			<form name='form' method='post' action=''>
				<input id='test' name='test' style='width:1280px;'/>
				<input type="submit" value="Click me!"></input>
			</form>
				X(click): <span class="cordFont"><span id="xCord"></span></span>&nbsp;
				Y(click): <span class="cordFont"><span id="yCord"></span></span>&nbsp;
				X(realtime): <span class="cordFont"><span id="xCordReal"></span></span>&nbsp;
				Y(realtime): <span class="cordFont"><span id="yCordReal"></span></span>&nbsp;	
			</div>
			<canvas id="ImageCanvas" class="canvasStyle" width="1280" height="720"></canvas>
		<div class="uploadImages">
			<form name='form' method='post' action='Imagerecorder.php'>
				<input name='uploadImages' type='SUBMIT' value='Upload'/>
			</form>

				<?php
				$filename = 'test.txt';
				$textString = $_POST['test'];
			
				if (is_writable($filename)) {
	
					if (!$handle = fopen($filename, 'a')) {
						 echo "Can't open the file:($filename)";
						 exit;
					}

					if (fwrite($handle, $textString) === FALSE) {
						echo "Couldn't write to file: ($filename)";
						exit;
					}
					echo "Ok! ($textString) to file ($filename)";

					fclose($handle);

				} else {
					echo "Error!";
				}
				?>
		</div>
	</div>
	</body>		
</html>
