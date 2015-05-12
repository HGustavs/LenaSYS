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
	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
	 <link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">  
	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
	<script src="../Shared/dugga.js"></script>
	<script src="fileed.js"></script>

</head>
<body>
	
	<?php 
		$noup="SECTION";
		$loginvar="FILE";
		include '../Shared/navheader.php';
		setcookie("loginvar", $loginvar);
	?>
		
<!-- content START -->
	<div id="content" >
		<div style='height:32px;width:100%;float:right'>
				<input class='submit-button' type='button' value='Add Link' onclick='createLink();'/>
				</div>
				<div id="alllinks" style='width:100%;float:right'>
					<table class='list' style='margin-bottom:8px;' >
						<tr><th class='first' style='width:64px;'>ID</th><th>Link URL</th><th style='width:30px' class='last'></th></tr>
					</table>
				</div>
				<div style='height:32px;width:100%;float:right'>
				<input class='submit-button' type='button' value='Add File' onclick='createFile("GFILE");'/>
				</div>
				<div id="allglobalfiles" style='width:100%;float:right'>
					<table class='list' style='margin-bottom:8px;' >
						<tr><th class='first' style='width:64px;'>ID</th><th>Global File</th><th style='width:30px' class='last'></th></tr>
					</table>
				</div>
				<div style='height:32px;width:100%;float:right'>
				<input class='submit-button' type='button' value='Add File' onclick='createFile("MFILE");'/>
				</div>
				<div id="allcoursefiles" style='width:100%;float:right'>
					<table class='list'>
						<tr><th class='first' style='width:64px;'>ID</th><th>Course Local File</th><th style='width:30px' class='last'></th></tr>
					</table>
				</div>
				<div style='height:32px;width:100%;float:right;display:block'>
				<input class='submit-button' type='button' value='Add File' onclick='createFile("LFILE");'/>
				</div>
				<div id="alllocalfiles" style='width:100%;float:right'>
					<table class='list'>
					<tr><th class='first' style='width:64px;'>ID</th><th>Local File</th><th style='width:30px' class='last'></th></tr>
					</table>
				</div>
			<br style="clear:both" />
	</div>
	
	<?php 
		include '../Shared/loginbox.php';
	?>

	<!-- Edit File Dialog START -->
	<div id='editFile' class='loginBox' style='width:464px;display:none;'>
		<div class='loginBoxheader'>
			<h3>Edit File/Link</h3>
			<div onclick='closeEditFile();'>x</div>
		</div>
		<form enctype="multipart/form-data" action="filereceive.php" method="POST">
			<div style='padding:5px;'>
				<input type='hidden' id='cid' name='cid' value='Toddler' />
				<input type='hidden' id='coursevers' name='coursevers' value='Toddler' />
				<input type='hidden' id='kind' name='kind' value='Toddler' />
				<div id="linky" class='inputwrapper'><span>URL:</span><input style="width:380px" class="textinput" name="link" placeholder="https://facebook.com" type="text" /></div>
				<div id="filey" class='inputwrapper'><span>Upload File:</span><input name="uploadedfile" id="uploadedfile" type="file" /></div>
				<div id="selecty" class='inputwrapper'><span>Existing File:</span><select id="selectedfile" name="selectedfile"></select></div>
			</div> 
			<div style='padding:5px;'>
				<td align='right'><input class='submit-button' type="submit" value="Upload File" /></td>
			</div> 
		</form>
	</div>
	<!-- Edit File Dialog END -->
</body>
</html>
