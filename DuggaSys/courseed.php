<?php
session_start();
include_once "../../coursesyspw.php";
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
	<meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Course Editor</title>
	<link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
	<link id="themeBlack" type="text/css" href="../Shared/css/blackTheme.css" rel="stylesheet">

	<script src="darkmodeToggle.js"></script>
	<script src="../Shared/loadingButton.js"></script>
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
	<div id="version" class='version diplay_none'>Master hash <br /><?php echo $version ?></div>

	<!-- content END -->

	<?php
	include '../Shared/loginbox.php';
	?>

	<!-- Server Msg -->
	<div id="servermsgcontainer" class="alertmsg diplay_none">
			<h3 id="servermsgtitle">Message of the day</h3>
			<p id="servermsg"></p>
			<input type='button' id="MOTDbutton" value='Close' class='submit-button' onclick='hideServerMessage()'/>
	</div>
	<!-- Server Msg END -->

<!-- New Course Section Dialog START -->
<div id='newCourse' class='loginBoxContainer diplay_none'>
    <div id=loginBox_DarkMode class='formBox DarkModeBackgrounds DarkModeText'>
    		<div class='formBoxHeader'>
    			<h3>New Course</h3>
    			<div class="cursorPointer" onclick='closeWindows();' title='Close window'>x</div>
    		</div>
    		<div class="padding_5px">
    			<input type='hidden' id='cid' value='Toddler' />
    			<div class='inputwrapper'>
					<span>Course Name:</span>
					<div id="newCourse_Name_formDialog" class="formDialog"><span class="formDialogText errorMessage">Only letters. Dash allowed in between words</span></div>
					<p id="dialog4" class="validationDialog">Only letters. Dash allowed in between words</p>
					<input oninput="quickValidateForm('newCourse','createCourse')"  class='textinput validate' type='text' id='ncoursename' name='coursename' placeholder='Course Name' />
				</div>
    			<div class='inputwrapper'>
					<span>Course Code:</span>
					<div id="newCourse_Code_formDialog" class="formDialog"><span class="formDialogText errorMessage">2 Letters, 3 digits, 1 letter</span></div>
					<p id="dialog3" class="validationDialog">2 Letters, 3 digits, 1 letter</p>
					<input oninput="quickValidateForm('newCourse','createCourse')"  class='textinput validate' type='text' id='ncoursecode' name='coursecode' placeholder='Course Code' />
				</div>
    		</div>
				<!-- Input field to Github repository START-->
				<div class="padding_5px">
					<div class="inputwrapper">
						<span class="padding-right_10px">GitHub URL:</span>
						<div class="formDialog" id="newGithubformDialog"><span class="formDialogText errorMessage">Enter a valid github url</span></div>
						<p id="dialog5" class="validationDialog">Enter a valid github url</p>
						<input oninput="quickValidateForm('newCourse','createCourse')" class="textinput validate" type="text" id="ncoursegit-url" name="courseGitURL" placeholder="https://github.com/..."/>
					</div>
				</div>
				<!-- Input field to Github repository END-->
    		<div class="padding_5px">
    			<input class='submit-button' id="createCourse" type='button' value='Create' disabled title='Create course' onclick="validateForm('newCourse')" />
    		</div>
      </div>
	</div>
	<!-- New Course Section Dialog END -->

	<!-- Edit Section Dialog START -->
	<div id='editCourse' class='loginBoxContainer'>
      <div class='formBox DarkModeBackgrounds DarkModeText' id=loginBox_DarkMode>
    		<div class='formBoxHeader'>
    			<h3>Edit Course</h3>
    			<div class="cursorPointer" onclick='closeWindows();'>x</div>
    		</div>
    		<div class="padding_5px">
    			<input type='hidden' id='cid' value='Toddler' />
    			<div class='inputwrapper'>
					<span>Course Name:</span>
					<div class="formDialog" id='editCourse_Name_formDialog'><span class="formDialogText errorMessage">Only letters. Dash allowed in between words</span></div>
					<p id="dialog4" class="validationDialog">Only letters. Dash allowed in between words</p>
					<input oninput="quickValidateForm('editCourse','saveCourse')"  class='textinput validate' type='text' id='coursename' name='coursename' placeholder='Course Name' />
				</div>
    			<div class='inputwrapper'>
					<span>Course code:</span>
					<div class="formDialog" id="editCourse_Code_formDialog"><span class="formDialogText errorMessage">2 Letters, 3 digits, 1 letter</span></div>
					<p id="dialog2" class="validationDialog">2 letters, 3 digits, 1 letter</p>
					<input oninput="quickValidateForm('editCourse','saveCourse')"  class='textinput validate' type='text' id='coursecode' name='coursecode' placeholder='Course Code' />
				</div>
    			<div class="inputwrapper">
					<span>GitHub URL:</span>
					<div class="formDialog" id="editGithub_formDialog"><span class="formDialogText errorMessage">Enter a valid github url</span></div>
					<p id="dialog6" class="validationDialog">Enter a valid github url</p>
					<input oninput="quickValidateForm('editCourse','saveCourse')" class="textinput validate" type="text" id="editcoursegit-url" name="courseGitURL" placeholder="https://github.com/..."/>
				</div>
    			<div class='inputwrapper'>
					<span>(optional) Insert Github Key:</span>
					<div class="formDialog" id="GithubKey_formDialog"><span class="formDialogText errorMessage">A Github key should be 40 characters</span></div>
					<p id="dialog7" class="validationDialog">A Github key should be 40 characters</p>
					<input oninput="quickValidateForm('editCourse','saveCourse')" class='textinput validate' type='text' id='githubToken' name='githubToken' placeholder='Leave blank for no key' />
				</div>				
				<div class='inputwrapper'>
					<span>Visibility:</span>
					<select class='selectinput' id='visib'></select>
				</div>
    		</div>
			<div id='editCourseButtonPlacement' >
				<div id="buttonContainerDeleteCourse"></div>
				<div id="buttonContainerSaveCourse"></div>
				<div class="form-popup" id="myForm">
					<form action="" class="form-popup_container DarkModeBackgrounds">
						<h1 Class="DarkModeText" id="deleteQustion">Are you sure? </h1>
						<button id="deleteCourseButtonYes" type="button" onclick="deleteCourse(); closeDeleteForm();">Yes</button>
						<button id="deleteCourseButtonNo" type="button" onclick="closeDeleteForm()">No</button>
					</form>
				</div>
			</div>
		</div>
	</div>
	<!-- Edit Section Dialog END -->


	<!-- Edit Server Settings START -->

	<div id='editSettings' onmouseover="validateMOTD('motd','dialog51', 'dialog52', 'submitMotd');" class='loginBoxContainer' >
    <div class='formBox DarkModeBackgrounds DarkModeText' id='editSettings_loginBox'>

    		<div class='formBoxHeader'>
    			<h3>Edit Server Settings</h3>
    			<div class="cursorPointer" onclick='closeWindows();'>x</div>
    		</div>
    		<div class="padding_5px">

    			<div class='inputwrapper'><span>Message of the day:</span><input class='textinput' onkeyup="validateMOTD('motd','dialog51', 'dialog52', 'submitMotd')" type='text' id='motd' placeholder='Leave blank for no MOTD' /></div>
    			<div class='inputwrapper'><span class='italic'>Read Only:</span><input type="checkbox" name='readonly' id='readonly' title='Disables uploads/submits. Useful for active backup servers.'></select></div>
				
    		</div>
			<div class="formDialog" id="errorSymbol"><span id="dialog51" class="formDialogText errorMessage">Prohibited symbols</span></div>
			<div class="formDialog" id="error50"><span id="dialog52" class="formDialogText errorMessage">Message can only contain a maximum of 50 symbols</span></div>
    		<div class="padding_5px">
    			<input id='submitMotd' class='submit-button' type='button' value='Save' title='Save changes' onclick='updateSettings();' />
    		</div>
    </div>
	</div>
	<!-- Edit Server Settings END -->



</body>
</html>
