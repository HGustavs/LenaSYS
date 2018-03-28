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
			<input type='button' value='Close' class='submit-button' onclick='document.getElementById("servermsgcontainer").style.display="none";'/>
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
    			<div class='inputwrapper'><span>Course Name:</span><input class='textinput' type='text' id='ncoursename' placeholder='Course Name' /></div>
    			<div class='inputwrapper'><span>Course code:</span><input class='textinput' type='text' id='ncoursecode' placeholder='Course Code' /></div>
    		</div>
    		<div style='padding:5px;'>
    			<input class='submit-button' type='button' value='Create' title='Create course' onclick='createNewCourse();' />
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
    			<div class='inputwrapper'><span>Course Name:</span><input class='textinput' type='text' id='coursename' placeholder='Course Name' /></div>
    			<div class='inputwrapper'><span>Course code:</span><input class='textinput' type='text' id='coursecode' placeholder='Course Code' /></div>
    			<div class='inputwrapper'><span>Visibility:</span><select class='selectinput' id='visib'></select></div>
    		</div>
    		<div style='padding:5px;'>
    			<input class='submit-button' type='button' value='Save' title='Save changes' onclick='updateCourse();' />
    		</div>
      </div>
	</div>
	<!-- Edit Section Dialog END -->

	<!-- New Version Dialog START -->
	<div id='newCourseVersion' class='loginBoxContainer' style='display:none;'>
      <div class='loginBox' style='width:464px;'>
      		<div class='loginBoxheader'>
      			<h3>New Course Version</h3>
      			<div class="cursorPointer" onclick='closeWindows();' title="Close window">x</div>
      		</div>
      		<div style='padding:5px;'>
      			<div class='inputwrapper'><span>Course Name:</span><input class='textinput' type='text' readonly id='coursename1' placeholder='Course Name' /></div>
      			<div class='inputwrapper'><span>Course Code:</span><input class='textinput' type='text' readonly id='coursecode1' placeholder='Course Code' /></div>
      			<div class='inputwrapper'><span>Version Name:</span><input class='textinput' type='text' id='versname' placeholder='Version Name' /></div>
      			<div class='inputwrapper'><span>Version ID:</span><input class='textinput' type='text' id='versid' placeholder='Version ID' maxlength='8'/></div>
            <div class='inputwrapper'><span>Start Date:</span><input class='textinput datepicker' type='text' id='startdate' value='' /></div>
            <div class='inputwrapper'><span>End Date:</span><input class='textinput datepicker' type='text' id='enddate' value='' /></div>
      			<div class='inputwrapper'><span>Change this to default version</span><input type="checkbox" name="makeactive" id="makeactive" value="yes"></div>
      			<div class='inputwrapper'><span>Copy content from:</span><select id='copyvers'></select></div>
      		</div>
      		<div style='padding:5px;'>
      			<input class='submit-button' type='button' value='Create' title='Create new version' onclick='createVersion();' />
      		</div>
      </div>
	</div>
	<!-- New Verison Dialog END -->
	
	<!-- Edit Server Settings START -->
	<div id='editSettings' class='loginBoxContainer' style='display:none;'>
    <div class='loginBox' style='width:464px;'>
    		<div class='loginBoxheader'>
    			<h3>Edit Server Settings</h3>
    			<div onclick='closeWindows();'>x</div>
    		</div>
    		<div style='padding:5px;'>
    			<div class='inputwrapper'><span>MOTD:</span><input class='textinput' type='text' id='motd' placeholder='Leave blank for no MOTD' /></div>
    			<div class='inputwrapper'><span style='font-style:italic;color:rgba(0,0,0,0.6)'>Read Only:</span><input type="checkbox" name='readonly' id='readonly' value="no" title='Disables uploads/submits. Usefull for active backup servers.'  disabled></select></div>
    		</div>
    		<div style='padding:5px;'>
    			<input class='submit-button' type='button' value='Save' title='Save changes' onclick='updateSettings();' />
    		</div>
    </div>
	</div>
	<!-- Edit Server Settings END -->
</body>
</html>
