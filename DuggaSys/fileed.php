<?php
session_start();
include_once "../../coursesyspw.php";
include_once "../Shared/sessions.php";
pdoConnect();
?>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Dugga editor</title>

	<link type="text/css" href="css/style.css" rel="stylesheet">
  <link type="text/css" href="css/jquery-ui-1.10.4.min.css" rel="stylesheet">  

	<script src="js/jquery-1.11.0.min.js"></script>
	<script src="js/jquery-ui-1.10.4.min.js"></script>

	<script src="dugga.js"></script>
	<script src="fileed.js"></script>

</head>
<body>
	
	<?php 
		$noup="SECTION";
		$loginvar="FILE";
		include '../Shared/navheader.php';
	?>
		
	<!-- content START -->
	<div id="content">
					
	</div>
	
	<?php 
		include '../Shared/loginbox.php';
	?>

	<!--- Edit File Dialog START --->
	<div id='editFile' class='loginBox' style='width:464px;display:none;'>

	<div class='loginBoxheader'>
	<h3>Edit File/Link</h3>
	<div onclick='closeEditFile();'>x</div>
	</div>
				
	<form enctype="multipart/form-data" action="filereceive.php" method="POST">
	
	<input type='hidden' id='cid' name='cid' value='Toddler' />
	<input type='hidden' id='coursevers' name='coursevers' value='Toddler' />
	<input type='hidden' id='kind' name='kind' value='Toddler' />
	
	<table width="100%">
		<tr id="linky">
			<td colspan='2' style='line-height:40px;'>URL:&nbsp;<input name="link" type="text" size="40" /></td>		
		</tr>
		<tr id="filey">
			<td colspan='2' style='line-height:40px;'>Upload File:&nbsp;<input name="uploadedfile" type="file" /></td>		
		</tr>
		<tr id="selecty">
			<td colspan='2' style='line-height:40px;'>Existing File:&nbsp;<select id="selectedfile" name="selectedfile"></select></td>		
		</tr>
	</table>

	<table width="100%"><tr>
			<td align='right'><input class='submit-button' type="submit" value="Upload File" /></td>
		</tr>
	</table>
	
	</form>

	</div>
	<!--- Edit File Dialog END --->
	
		
</body>
</html>
