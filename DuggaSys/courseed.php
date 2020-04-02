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

?>
<!DOCTYPE html>
<html>
<head>
	<link rel="icon" type="image/ico" href="../Shared/icons/favicon.ico"/>
	<meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Course Editor</title>

	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">

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
			<p id="servermsg"></p>
			<input type='button' id="MOTDbutton" value='Close' class='submit-button' onclick='hideServerMessage()'/>
	</div>
	<!-- Server Msg END -->

	<!-- New Course Section Dialog START -->
	<div id='newCourse' class='loginBoxContainer' style='display:none;'>
    <div class='loginBox' style='width:464px;'>
    		<div class='loginBoxheader'>
    			<h3>New Course</h3>
    			<div class="cursorPointer" onclick='closeWindows();' title='Close window'>x</div>
    		</div>
    		<div style='padding:5px;'>
    			<input type='hidden' id='cid' value='Toddler' />
    			<div class='inputwrapper'><span>Course Name:</span><input oninput="validateCourseName('ncoursename', 'dialog4')" class='textinput' type='text' id='ncoursename' placeholder='Course Name' /></div>
				<p id="dialog4" style="font-size:11px; border:0px; margin-left: 25px; display:none;">Only letters</p>
    			<div class='inputwrapper'><span>Course code:</span><input oninput="validateCourseCode('ncoursecode', 'dialog3')" class='textinput' type='text' id='ncoursecode' placeholder='Course Code' /></div>
				<p id="dialog3" style="font-size:11px; border:0px; margin-left: 25px; display:none;">2 Letters, 3 digits, 1 letter</p>
    		</div>
    		<div style='padding:5px;'>
    			<input class='submit-button' type='button' value='Create' title='Create course' onclick="validateForm('newCourse')" />
    		</div>
      </div>
	</div>
	<!-- New Course Section Dialog END -->

		<!-- Edit Section Dialog START -->
		<div id='editCourse' class='loginBoxContainer' style='display:none;'>
      <div class='loginBox' style='width:464px;'>
    		<div class='loginBoxheader'>
    			<h3>Edit Course</h3>
    			<div class="cursorPointer" onclick='closeWindows();'>x</div>
    		</div>
    		<div style='padding:5px;'>
    			<input type='hidden' id='cid' value='Toddler' />
    			<div class='inputwrapper'><span>Course Name:</span><input oninput="validateCourseName('coursename', 'dialog')" class='textinput' type='text' id='coursename' placeholder='Course Name' />
				</div>
				<p id="dialog" style="font-size:11px; border:0px; margin-left: 25px; display:none;">Only</p>
    			<div class='inputwrapper'><span>Course code:</span><input oninput="validateCourseCode('coursecode', 'dialog2')" class='textinput' type='text' id='coursecode' placeholder='Course Code' /></div>
				<p id="dialog2" style="font-size:11px; border:0px; margin-left: 25px; display:none;">2 letters, 3 digits, 1 letter</p>
    			<div class='inputwrapper'><span>Visibility:</span><select class='selectinput' id='visib'></select></div>
    		</div>
    		<div style='padding:5px;'>
    			<input class='submit-button' type='button' value='Save' title='Save changes' onclick="validateForm('editCourse')" />
    		</div>
      </div>
	</div>
	<!-- Edit Section Dialog END -->


	<!-- Edit Server Settings START -->
	<div id='editSettings' class='loginBoxContainer' style='display:none;'>
    <div class='loginBox' style='width:464px;'>
    		<div class='loginBoxheader'>
    			<h3>Edit Server Settings</h3>
    			<div class="cursorPointer" onclick='closeWindows();'>x</div>
    		</div>
    		<div style='padding:5px;'>
    			<div class='inputwrapper'><span>Message of the day:</span><input class='textinput' type='text' id='motd' placeholder='Leave blank for no MOTD' /></div>
    			<div class='inputwrapper'><span style='font-style:italic;color:rgba(0,0,0,0.6)'>Read Only:</span><input type="checkbox" name='readonly' id='readonly' value="no" title='Disables uploads/submits. Usefull for active backup servers.'></select></div>
    		</div>
    		<div style='padding:5px;'>
    			<input class='submit-button' type='button' value='Save' title='Save changes' onclick='updateSettings();' />
    		</div>
    </div>
	</div>
	<!-- Edit Server Settings END -->
</body>
</html>
