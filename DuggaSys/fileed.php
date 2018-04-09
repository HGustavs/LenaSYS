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
	
		<button class="switchContent" onclick="switchcontent(),keyUpSearch()" type="button">Switch to One table</button>

		<div id="searchBar">
			<input id="searchinput" type="text" name="search" placeholder="Search.." onkeypress="return searchKeyPress(event);">
			<button id="searchbutton" class="switchContent" onclick="searchcontent()" type="button">
				<svg id="lookingGlassSVG" fill="#FFFFFF" height="18" viewBox="0 0 22 22" width="18" xmlns="http://www.w3.org/2000/svg">
				    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
				    <path d="M0 0h24v24H0z" fill="none"/>
				</svg>
			</button>
		</div>

		<div id="thetable" style='width:100%;'></div>

        <div id="searchresults" style='width:100%; display:none;'>
            <table class='list list--nomargin' style='margin-bottom:8px;' >
                <tr><th class='first' style='width:64px;'>ID</th><th>Search Results</th><th style='width:30px' class='last'></th></tr>
            </table>
        </div>
		<div id="alllinks" style='width:100%;'>
			<table class='list list--nomargin' style='margin-bottom:8px;' >
				<tr><th><input class='submit-button fileed-button' type='button' value='Add Link' onclick='createLink();'/></th></tr>
				<tr><th class='first' style='width:64px;'>ID</th><th>Link URL</th><th style='width:30px' class='last'></th></tr>
			</table>
		</div>
		<!-- allcontent -->
		<div id="allcontent" style="width:100%;display:none">

			<table class='list list--nomargin' style='margin-bottom:8px;' >
				<tr><th><input class='submit-button fileed-button' type='button' value='Add File' onclick='createFile("GFILE");'/></th></tr>
				<tr><th class='first' style='width:64px;'>ID</th><th>File Group</th><th style='width:30px' class='last'></th></tr>
			</table>			

		</div>
		<div id="allglobalfiles" style='width:100%;'>
			<table class='list list--nomargin' style='margin-bottom:8px;' >
				<tr><th><input class='submit-button fileed-button' type='button' value='Add File' onclick='createFile("GFILE");'/></th></tr>
				<tr><th class='first' style='width:64px;'>ID</th><th>Global File</th><th style='width:30px' class='last'></th></tr>
			</table>
		</div>
		<div id="allcoursefiles" style='width:100%;'>
				<table class='list list--nomargin'>
						<tr><th><input class='submit-button fileed-button' type='button' value='Add File' onclick='createFile("MFILE");'/></th></tr>
						<tr><th class='first' style='width:64px;'>ID</th><th>Course Local File</th><th style='width:30px' class='last'></th></tr>
				</table>
		</div>
		<div id="alllocalfiles" style='width:100%;'>
			<table class='list list--nomargin'>
				<tr><th><input class='submit-button fileed-button' type='button' value='Add File' onclick='createFile("LFILE");'/></th></tr>
				<tr><th class='first' style='width:64px;'>ID</th><th>Local File</th><th style='width:30px' class='last'></th></tr>
			</table>
		</div>
	</div>
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
      				<!--<div id="selecty" class='inputwrapper'><span>Existing File:</span><select id="selectedfile" name="selectedfile"></select></div>-->
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
