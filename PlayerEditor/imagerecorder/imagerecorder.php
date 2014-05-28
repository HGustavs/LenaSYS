<!doctype html>
<html>
	<head>
		<title>Imagerecorder</title>
		<link href="stylesheet.css" rel="stylesheet" type="text/css"/>
		<script language="javascript" src="js/imagerecorder.js"></script>
		<script language="javascript" src="../js/jquery-1.11.0.min.js"></script>
		<script language="javascript" src="../js/jquery-ui-1.10.4.custom.min.js"></script>
		<meta charset="utf-8">
	</head>
	<body>
		<!--Div that shows the opacity behind the instructionwindow-->
		<div id="instructionopacity">
			<!--Div that stores the instructions-->
			<div id="instructionwindow">
				<img src="img/instruction_new.png" width="100%">
				<div class="closebutton" onClick="hideinstruction();"></div>
			</div>
		</div>	
			
		<div id="library-name-dialog" title="Library name">
			<h3><strong>Library name?</strong></h3>
			<p>Please choose your library name.</p>
			<input type="value" id="library-name-input" onClick="this.value='';" value="<?php echo date("YmdHis").rand(1,100); ?>">
			<input type="button" id="library-name-button" value="OK">
		</div>
		
		<div id="thumbMenu"></div>
		
		<div class="wrapper">
			<div class="header">Image Recorder</div>

			<div id="export-feedback">
			</div>
			<div id="loading-dialog"><center><img src="img/loading.gif" alt="Loading"><br>Uploading images</center></div>
			
			<div class='thumbMenu'></div>
			<!--Creating the big canvas, this canvas contains the big picture-->
			<canvas id="ImageCanvas" class="canvasStyle" width="1280" height="720"></canvas>
			
			<script>
				var imgrecorder = new imagerecorder("ImageCanvas");
			</script>
			
			<div id="controls">
				<input id="uploadButton" type="button" class='controlbutton' onClick="document.getElementById('imageLoader').click();" value="Upload image(s)">
				<input type="button" id="instructbutton" class="controlbutton" value="Instructions" onClick="showinstruction();"/>
			</div>
				
			<!--creating the small imageviewer, on the bottom of the screen-->
			<div id="thumbnails" class="thumbnails">
				<ul  style="overflow-x: hidden; margin-right:10px" id="sortableThumbs">
					<!-- Uploaded images will be appended in this list -->
				</ul>
			</div>
			<!-- Hidden upload form, this is called from controls -->
			<div class="uploadForm" style="visibility:hidden;">
				<form method='post' action="#" id="uploadForm" enctype="multipart/form-data">
					<input id='imageLoader' name='image' type="file" multiple />
				</form>
			</div>

		</div>
	
	</body>		
</html>
