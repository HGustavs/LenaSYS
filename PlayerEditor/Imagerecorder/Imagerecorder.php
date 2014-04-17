<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<title>Prototype imagerecorder</title>
<style>
</style>
	<link href="stylesheet.css" rel="stylesheet" type="text/css"/>
	<script language="javascript" src="js/imagerecorder.js"></script>
	<script language="javascript" src="../js/jquery-1.11.0.min.js"></script>

</head>
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
		
			<?php
			$image_name = null;
			if(isset($_POST['upload'])){
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
			if(isset($_POST['test'])){
			$filename = 'test.txt';
			$textString = $_POST['test'];
			if (is_writable($filename)) {
				if (!$handle = fopen($filename, 'a')) {
					 echo "Cannot open file ($filename)";
					 exit;
				}
				if (fwrite($handle, $textString) === FALSE) {
					echo "Error!";
					exit;
				}
				fclose($handle);
			} else {
				echo "Error!";
			}
			}
			?>
		<br/>
		<canvas id="canvasTemp" class="canvasStyle2" height="2000" width="200"></canvas>
		</div>
		<form method='post' action='' enctype="multipart/form-data">
			<input id='imageLoader' name='image' type='FILE'/>
			<input name='upload' type='SUBMIT' value='Upload'/>
		</form>
		<br/>
		<form name='form' method='post' action=''>
			<input id='XMLfile' name='test' style='width:1280px;'/>
			<input type="submit" value="Export XML"></input>
		</form>
	</div>
	<script>
	var imgSource = "<?php echo $image_name; ?>";
	var imagerec = new imagerecorder("ImageCanvas", imgSource);
	</script>
	</body>		
</html>
