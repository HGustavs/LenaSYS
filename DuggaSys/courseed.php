<?php
session_start();
include_once "../Shared/sessions.php";
include_once "../Shared/toast.php";
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
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Course Editor</title>
	<link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
	<link id="themeBlack" type="text/css" href="../Shared/css/blackTheme.css" rel="stylesheet">
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

	<script src="darkmodeToggle.js"></script>
	<script src="../Shared/loadingButton.js"></script>
	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
	<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  	<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  	<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
	<script src="../Shared/dugga.js"></script>
	<script src="courseed.js"></script>
	
</head>
<body>

	<?php
	$courseed = true;
	include '../Shared/navheader.php';
	?>

	<!-- content START -->
	<div id="content">
		<!-- Section List -->
		<div id='Courselist'>
		</div>
	</div>

	<!-- version identification -->
	<div id="version" class='version display_none'>Master hash <br /><?php echo $version ?></div>

	<!-- content END -->

	<?php
	include '../Shared/loginbox.php';
	?>

	<!-- Server Msg -->
	<div id="servermsgcontainer" class="alertmsg display_none">
			<h3 id="servermsgtitle">Message of the day</h3>
			<p id="servermsg"></p>
			<input type='button' id="MOTDbutton" value='Close' class='submit-button' onclick='hideServerMessage(); removeMotdMargin();'/>
	</div>
	<!-- Server Msg END -->

<!-- New Course Section Dialog START -->

<div id='newCourse' class='loginBoxContainer display_none'>
    <div id='loginBox_DarkMode'  class='formBox DarkModeBackgrounds DarkModeText'>
    		<div class='formBoxHeader'>
    			<h3>New Course</h3>
    			<div class="cursorPointer" onclick='closeWindows();' title='Close window'>x</div>
    		</div>
    		<div class="formBody">
    			<input type='hidden' id='cid' value='Toddler' />
    			<div class='inputwrapper'>
					<span>Course Name:</span>
					<div class="dialogwrapper">
						<div class="formDialog"><span id="courseNameError" class="formDialogText">Only letters. Dash allowed in between words</span></div>
						<input oninput="quickValidateForm('newCourse','createCourse')" class='textinput validate' type='text' id='ncoursename' name='coursename' placeholder='Course Name' />
					</div>
				</div>
				<div class='inputwrapper'>
					<span>Course code:</span>
					<div class="dialogwrapper">
						<div class="formDialog"><span id="courseCodeError" class="formDialogText">2 Letters, 3 digits, 1 letter</span></div>
						<input oninput="quickValidateForm('newCourse','createCourse')" class='textinput validate' type='text' id='ncoursecode' name='coursecode' placeholder='Course Code' />
					</div>
				</div>
				<div class="emptywrapper"></div>
				<!-- Input field to Github repository START-->
				<div class="inputwrapper">
					<span>GitHub URL:</span>
					<div class="dialogwrapper">
						<div class="formDialog"><span id="courseCodeError" class="formDialogText">Enter a valid github url</span></div>
						<input oninput="quickValidateForm('newCourse','createCourse')" class="textinput validate" type="text" id="ncoursegit-url" name="courseGitURL" placeholder="https://github.com/..." />
					</div>
				</div>
				<!-- Input field to Github repository END-->
			</div>
			<div class="formFooter">
				<div id="buttonContainerCreateCourse"></div>
			</div>
		</div>
	</div>
	<!-- New Course Section Dialog END -->

	<!-- Edit Section Dialog START -->
	<div id='editCourse' class='loginBoxContainer display_none'>
	<div class='formBox DarkModeBackgrounds DarkModeText' id=loginBox_DarkMode>
    		<div class='formBoxHeader'>
    			<h3>Edit Course</h3>
    			<div class="cursorPointer" onclick='closeWindows();'>x</div>
    		</div>
    		<div class="formBody">
    			<input type='hidden' id='cid' value='Toddler' />
				<div class='inputwrapper'>
					<span>Course Name:</span>
					<div class="dialogwrapper">
						<div class="formDialog"><span class="formDialogText errorMessage">Only letters. Dash allowed in between words</span></div>
						<input oninput="quickValidateForm('editCourse','saveCourse')" class='textinput validate' type='text' id='coursename' name='coursename' placeholder='Course Name' />
					</div>
				</div>
				<div class='inputwrapper'>
					<span>Course code:</span>
					<div class="dialogwrapper">
						<div class="formDialog"><span class="formDialogText errorMessage">2 Letters, 3 digits, 1 letter</span></div>
						<input oninput="quickValidateForm('editCourse','saveCourse')" class='textinput validate' type='text' id='coursecode' name='coursecode' placeholder='Course Code' />
					</div>
				</div>
				<div class="inputwrapper">
					<span>GitHub URL:</span>
					<div class="dialogwrapper">
						<div class="formDialog"><span class="formDialogText errorMessage">Enter a valid github url</span></div>
						<input oninput="quickValidateForm('editCourse','saveCourse')" class="textinput validate" type="text" id="editcoursegit-url" name="courseGitURL" placeholder="https://github.com/..." />
					</div>
				</div>
				<div class='inputwrapper'>
					<span>(optional) Insert Github Key:</span>
					<div class="dialogwrapper">
						<div class="formDialog"><span class="formDialogText errorMessage">A Github key should be 40 characters</span></div>
						<input oninput="quickValidateForm('editCourse','saveCourse')" class='textinput validate' type='text' id='githubToken' name='githubToken' placeholder='Leave blank for no key' />
					</div>
				</div>			
				<div class='inputwrapper'>
					<span>Visibility:</span>
					<select class="selectDarkModeText margin-right_0px" id='visib'></select>
				</div>
    		</div>
			<div class="formFooter" id='editCourseButtonPlacement' >
				<div id="buttonContainerDeleteCourse"></div>
				<div id="buttonContainerSaveCourse"></div>
				<div class="form-popup" id="myForm">
					<form action="" class="form-popup_container DarkModeBackgrounds">
					<h1 Class="DarkModeText" id="deleteQustion">Are you sure? </h1>
						<button id="deleteCourseButtonYes" type="button" onclick="deleteCourse(); closeDeleteForm()">Yes</button>
						<button id="deleteCourseButtonNo" type="button" onclick="closeDeleteForm()">No</button>
					</form>
				</div>
			</div>
		</div>
	</div>
	<!-- Edit Section Dialog END -->


	<!-- Edit Server Settings START -->

	<div id='editSettings' onmouseover="validateMOTD('motd','dialog51', 'dialog52', 'submitMotd');" class='loginBoxContainer display_none'>
	<div class='formBox DarkModeBackgrounds DarkModeText' id='editSettings_loginBox'>

    		<div class='formBoxHeader'>
    			<h3>Edit Server Settings</h3>
    			<div class="cursorPointer" onclick='closeWindows();'>x</div>
    		</div>
			<div class="formBody">
    			<div class='inputwrapper'>
					<span>Message of the day:</span>
					<div class="dialogwrapper">
						<input class='textinput' onkeyup="validateMOTD('motd','dialog51', 'dialog52', 'submitMotd')" type='text' id='motd' placeholder='Leave blank for no MOTD' />
						<div class="formDialog"><span id="dialog51" class="formDialogText">Prohibited symbols</span></div>
						<div class="formDialog"><span id="dialog52" class="formDialogText">Message can only contain a maximum of 50 symbols</span></div>
					</div>
				</div>
				<div class='inputwrapper'><span class="italic">Read Only:</span><input type="checkbox" name='readonly' id='readonly' title='Disables uploads/submits. Useful for active backup servers.'></select></div>	
    		</div>
    		<div class="formFooter">
    			<input id='submitMotd' class='submit-button' type='button' value='Save' title='Save changes' onclick='updateSettings();' />
    		</div>
    	</div>
	</div>
	<!-- Edit Server Settings END -->



</body>
</html>
