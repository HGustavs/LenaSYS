<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<title>Prototype imagerecorder</title>
<style>
</style>
	<link href="stylesheet.css" rel="stylesheet" type="text/css" />
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
				X(click): <span class="cordFont"><span id="xCord"></span></span>&nbsp;
				Y(click): <span class="cordFont"><span id="yCord"></span></span>&nbsp;
				X(realtime): <span class="cordFont"><span id="xCordReal"></span></span>&nbsp;
				Y(realtime): <span class="cordFont"><span id="yCordReal"></span></span>&nbsp;	
			</div>
			<canvas id="ImageCanvas" class="canvasStyle" width="1280" height="720"></canvas>
		<div class="uploadImages">
		Upload images here:
			<form name='form' method='post' action='Imagerecorder.php'>
				<input name='uploadImage' type='SUBMIT' value='Upload'/>
			</form>
			<?php
			if(isset($_POST['uploadImage'])){
				// TODO: Upload local images to the array in the javaScript file imagerecorder.js
			}
			?>	
		</div>
	</div>
	</body>		
</html>
