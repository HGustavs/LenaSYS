<?php
session_start();
include_once "../../coursesyspw.php";
include_once "../Shared/sessions.php";
pdoConnect();

if (file_exists("../.git/refs/heads/master")) {
	$versionFile = fopen("../.git/refs/heads/master", "r");
	$version = fgets($versionFile);
	fclose($versionFile);
} else {
	$version = "v0.7+";
}
$noup="NONE";

if(isset($_SESSION['uid'])){
	$userid=$_SESSION['uid'];	
}else{
	$userid="00";		
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
	<link rel="icon" type="image/ico" href="../Shared/icons/favicon.ico"/>
	<meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Course Editor</title>
	<link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
	<link id="themeBlack" type="text/css" href="../Shared/css/blackTheme.css" rel="stylesheet">

	<script src="darkmodeToggle.js"></script>
	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
	<script src="../Shared/dugga.js"></script>
	<script src="courseed.js"></script>
</head>
<body>

	<?php
	include '../Shared/navheader.php';
	?>

	<!-- content START -->
	<div id="content">
		<!-- Section List -->
		<div id='Courselist'>
		</div>
	</div>

	<!-- version identification -->
	<div id="version" class='version' style='display:none'>Master hash <br /><?php echo $version ?></div>

	<!-- content END -->

	<?php
	include '../Shared/loginbox.php';
	?>

	<!-- Server Msg -->
	<div id="servermsgcontainer" class="alertmsg" style="display:none;">
			<h3 id="servermsgtitle">Message of the day</h3>
			<p id="servermsg"></p>
			<input type='button' id="MOTDbutton" value='Close' class='submit-button' onclick='hideServerMessage()'/>
	</div>
	<!-- Server Msg END -->

<!-- New Course Section Dialog START -->
<div id='newCourse' class='loginBoxContainer' style='display:none;'>
    <div class='loginBox DarkModeBackgrounds DarkModeText' style='width:464px;  overflow:hidden;'>
    		<div class='loginBoxheader'>
    			<h3>New Course</h3>
    			<div class="cursorPointer" onclick='closeWindows();' title='Close window'>x</div>
    		</div>
    		<div style='padding:5px;'>
    			<input type='hidden' id='cid' value='Toddler' />
    			<div class='inputwrapper'>
					<span>Course Name:</span>
					<input oninput="quickValidateForm('newCourse','createCourse')"  class='textinput validate' type='text' id='ncoursename' name='coursename' placeholder='Course Name' />
				</div>
				<div class="formDialog" style="display: block;left:50px; top:-8px;"><span id="courseNameError" style="display: none; left:0px; bottom:-10px;" class="formDialogText">Only letters. Dash allowed in between words</span></div>
				<p id="dialog4" class="validationDialog">Only letters. Dash allowed in between words</p>
    			<div class='inputwrapper'>
					<span>Course code:</span>
					<input oninput="quickValidateForm('newCourse','createCourse')"  class='textinput validate' type='text' id='ncoursecode' name='coursecode' placeholder='Course Code' />
				</div>
				<div class="formDialog" style="display: block; left:50px; top:0px;"><span id="courseCodeError" style="display: none; left:0px; bottom:5px;" class="formDialogText">2 Letters, 3 digits, 1 letter</span></div>
				<p id="dialog3" class="validationDialog">2 Letters, 3 digits, 1 letter</p>
    		</div>
				<!-- Input field to Github repository START-->
				<div style="padding:5px;">
					<div class="inputwrapper">
						<span style="padding-right: 10px;">GitHub URL:</span>
						<input oninput="quickValidateForm('newCourse','createCourse')" class="textinput validate" type="text" id="ncoursegit-url" name="courseGitURL" placeholder="https://github.com/..."/>
					</div>
					<div class="formDialog" style="display: block; left:50px; top:0px;"><span id="courseCodeError" style="display: none; left:0px; bottom:0px;" class="formDialogText">Enter a valid github url</span></div>
					<p id="dialog5" class="validationDialog">Enter a valid github url</p>
				</div>
				<!-- Input field to Github repository END-->
    		<div style='padding:5px;'>
    			<input class='submit-button' id="createCourse" type='button' value='Create' disabled title='Create course' onclick="validateForm('newCourse')" />
    		</div>
      </div>
	</div>
	<!-- New Course Section Dialog END -->

	<!-- Edit Section Dialog START -->
	<div id='editCourse' class='loginBoxContainer' style='display:none;'>
      <div class='loginBox DarkModeBackgrounds DarkModeText' style='width:464px;  overflow:hidden;'>
    		<div class='loginBoxheader'>
    			<h3>Edit Course</h3>
    			<div class="cursorPointer" onclick='closeWindows();'>x</div>
    		</div>
    		<div style='padding:5px;'>
    			<input type='hidden' id='cid' value='Toddler' />
    			<div class='inputwrapper'>
					<span>Course Name:</span>
					<input oninput="quickValidateForm('editCourse','saveCourse')"  class='textinput validate' type='text' id='coursename' name='coursename' placeholder='Course Name' />
				</div>
				<div class="formDialog" style="display: block; left:50px; top:-10px;"><span id="editcourseCodeError" style="display: none; left:0px;" class="formDialogText">Only letters. Dash allowed in between words</span></div>
				<p id="dialog4" class="validationDialog">Only letters. Dash allowed in between words</p>
    			<div class='inputwrapper'>
					<span>Course code:</span>
					<input oninput="quickValidateForm('editCourse','saveCourse')"  class='textinput validate' type='text' id='coursecode' name='coursecode' placeholder='Course Code' />
				</div>
				<div class="formDialog" style="display: block; left:50px; top:0px;"><span id="editcourseCodeError" style="display: none; left:0px;" class="formDialogText">2 Letters, 3 digits, 1 letter</span></div>
				<p id="dialog2" class="validationDialog">2 letters, 3 digits, 1 letter</p>
    			<div class="inputwrapper">
					<span>GitHub URL:</span>
					<input oninput="quickValidateForm('editCourse','saveCourse')" class="textinput validate" type="text" id="editcoursegit-url" name="courseGitURL" placeholder="https://github.com/..."/>
				</div>
				<div class="formDialog" style="display: block; left:50px; top:0px;"><span id="courseCodeError" style="display: none; left:0px;" class="formDialogText">Enter a valid github url</span></div>
				<p id="dialog6" class="validationDialog">Enter a valid github url</p>
				<div class='inputwrapper'>
					<span>Visibility:</span>
					<select class='selectinput' id='visib'></select>
				</div>
    		</div>
    		<div style='float:right; padding-top:20px; width: 464px;' >
    			<input id='saveCourse' class='submit-button' type='button' value='Save' title='Save changes' onclick="validateForm('editCourse')" />
    		</div>
      </div>
	</div>
	<!-- Edit Section Dialog END -->


	<!-- Edit Server Settings START -->

	<div id='editSettings' onmouseover="validateMOTD('motd','dialog5', 'dialog52', 'submitMotd');" class='loginBoxContainer' style='display:none;' >
    <div class='loginBox DarkModeBackgrounds DarkModeText' style='width:464px; overflow:hidden;'>

    		<div class='loginBoxheader'>
    			<h3>Edit Server Settings</h3>
    			<div class="cursorPointer" onclick='closeWindows();'>x</div>
    		</div>
    		<div style='padding:5px;'>

    			<div class='inputwrapper'><span>Message of the day:</span><input class='textinput' onkeyup="validateMOTD('motd','dialog5', 'dialog52', 'submitMotd')" type='text' id='motd' placeholder='Leave blank for no MOTD' /></div>
    			<div class='inputwrapper'><span style='font-style:italic;'>Read Only:</span><input type="checkbox" name='readonly' id='readonly' title='Disables uploads/submits. Useful for active backup servers.'></select></div>
				
    		</div>
			<!--<p id="dialog5" style="font-size:11px; border:0px; margin-left: 10px; display:none;">Prohibited symbols</p>-->
			<div class="formDialog" style="display: block; left:50px; top:-55px;"><span id="dialog5" style="display: none; left:0px; " class="formDialogText">Prohibited symbols</span></div>
			<!--<p id="dialog52" style="font-size:11px; border:0px; margin-left: 10px; display:none;">Message can only contain a maximum of 50 symbols</p>-->
			<div class="formDialog" style="display: block; left:50px; top:-30px;"><span id="dialog52" style="display: none; left:0px;" class="formDialogText">Message can only contain a maximum of 50 symbols</span></div>
    		<div style='padding:5px;'>
    			<input id='submitMotd' class='submit-button' type='button' value='Save' title='Save changes' onclick='updateSettings();' />
    		</div>
    </div>
	</div>
	<!-- Edit Server Settings END -->



</body>
</html>
