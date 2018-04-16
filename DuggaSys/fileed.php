<?php
session_start();
include_once "../../coursesyspw.php";
include_once "../Shared/sessions.php";
pdoConnect();
?>

<!DOCTYPE html>
<html>
<head>
	<link rel="icon" type="image/ico" href="../Shared/icons/favicon.ico"/>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>File editor</title>
	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">  
	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
	<script src="../Shared/dugga.js"></script>
	<script src="../Shared/SortableTableLibrary/sortableTable.js"></script> 
	<script src="fileed.js"></script>
</head>
<body onload="setupSort();">
	<?php 
		$noup="SECTION";
		include '../Shared/navheader.php';
	?>

	<!-- content START -->
	<div id="content" >
	
		<div class='titles' style='padding-top:10px;'>
			<h1 style='flex:1;text-align:center;'>Files</h1>
		</div>
    
		<button class="switchContent" onclick="switchcontent();keyUpSearch()" type="button">Switch to One table</button>
	
		<div id="searchBar">
			<input id="searchinput" type="text" name="search" placeholder="Search.." onkeyup="searchterm = document.getElementById('searchinput').value;fileLink.renderTable();">
			<button id="searchbutton" class="switchContent" onclick="return searchKeyDown(event)" type="button">
				<img id="lookingGlassSVG" style="height:18px;" src="../Shared/icons/LookingGlass.svg">
			</button>
		</div>
  
    	<input class='submit-button fileed-button' type='button' value='Add Link' onclick='createLink();'/>
		<input class='submit-button fileed-button' type='button' value='Add File' onclick='createFile("GFILE");'/>

		<div id="fileLink" style='width:100%;'></div>
	<!-- content END -->
	
	<?php 
		include '../Shared/loginbox.php';
	?>

	<!-- Add File Dialog START -->
	<div id='addFile' class='loginBoxContainer' style='display:none;'>
      <div class='loginBox' style='width:464px;'>
      		<div class='loginBoxheader'>
      			<h3>Add File/Link</h3>
      			<div class='cursorPointer' onclick='closeAddFile();'>x</div>
      		</div>
      		<form enctype="multipart/form-data" action="filereceive.php" onsubmit="return validateForm()" method="POST">
      			<div style='padding:5px;'>
      				<input type='hidden' id='cid' name='cid' value='Toddler' />
      				<input type='hidden' id='coursevers' name='coursevers' value='Toddler' />
      				<input type='hidden' id='kind' name='kind' value='Toddler' />
      				<div id="linky" class='inputwrapper'><span>URL:</span><input style="width:380px" id ="uploadedlink" class="textinput" name="link" placeholder="https://facebook.com" type="text" /></div>
      				<div id="filey" class='inputwrapper'><span>Upload File:</span><input name="uploadedfile[]" id="uploadedfile" type="file" multiple="multiple" /></div>
      			</div> 
      			<div style='padding:5px;'>
      				<td align='right'><div id='uploadbuttonname'><input class='submit-button' type="submit" value="Upload File" /></div></td>
      			</div> 
      			<div style ='padding:5px; display:none;' id='errormessage'>
      			</div> 
      		</form>
      </div>
	</div>
	<!-- Edit File Dialog END -->
</body>
</html>
