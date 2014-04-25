<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<title>Imagerecorder</title>
<style>
</style>
	<link href="stylesheet.css" rel="stylesheet" type="text/css"/>
	<script language="javascript" src="js/imagerecorder.js"></script>
	<script language="javascript" src="../js/jquery-1.11.0.min.js"></script>

</head>
	<body onload="">
	<div class="wrapper">
		<div class="header">Image Recorder</div>
			<!--Div that stores the cords-information-->
			<div class="cords">
				<!--Creating the cordinates-field. These id are used in the .js file to write out the cordinates first when clicking, last two realtime-->
				X(click): <span class="cordFont"><span id="xCord"></span></span>&nbsp;
				Y(click): <span class="cordFont"><span id="yCord"></span></span>&nbsp;
				X(realtime): <span class="cordFont"><span id="xCordReal"></span></span>&nbsp;
				Y(realtime): <span class="cordFont"><span id="yCordReal"></span></span>&nbsp;	
			</div>
			<!--Creating the big canvas, this canvas contains the big picture-->
			<canvas id="ImageCanvas" class="canvasStyle" width="1280" height="720"></canvas>
		<!--Div that stores uploaded pictures and the php-code for image-upload and .txt-file-->
		<div class="uploadImages">
		
	<?php
	
	$image_name = null;
	if(isset($_POST['upload'])){
		//variables that stores the name, type and size of the pictures that uploaded.
		$image_name = $_FILES['image']['name'];
		$image_type = $_FILES['image']['type'];
		$image_size = $_FILES['image']['size'];
		$image_tmp_name = $_FILES['image']['tmp_name'];	
	
	if($image_name==''){
		exit();
	}
	else
	move_uploaded_file($image_tmp_name,"pictures/$image_name");
	}	
	?>
		<br/>
		<!--creating the small imageviewer, on the right side of the screen-->
		<canvas id="canvasTemp" class="canvasStyle2" height="2000" width="200"></canvas>
		</div>
		<!--The form that handles the image upload function-->
		<div class="imguploader">
			<form method='post' action='' enctype="multipart/form-data">
				<input id='imageLoader' name='image' type='FILE'/>
				<input name='upload' type='SUBMIT' value='Upload'/>
			</form>
			<br/>
		</div>
	</div>
	<script>
	<!--A new variable withe value of the image_name in php. This is important to get the right pictures in the .js-file -->
	var imgSource = "<?php echo $image_name; ?>";
	var imagerec = new imagerecorder("ImageCanvas", imgSource);
	</script>
	</body>		
</html>
