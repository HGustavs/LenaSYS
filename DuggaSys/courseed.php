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

if($userid == "00"){
	if (!isset($_COOKIE["cookie_guest"])) {
		// Cookie for guest username is not present, send a guest cookie to user.
		$username = "Guest" . $userid . rand(0,50000);  // Guests have a random number between 0 and 50k added, this means there's a very small chance some guests have the same ID. These are only used for logging at the moment so this should not be an issue
		setcookie("cookie_guest", $username, time() + 3600, "/");
		
	}
}
else{
	// refreshes session cookies, thereby extending the time before users sees the alert or get logged out
	// refreshes takes place when navigating to codeviewer.php, courseed.php, and sectioned.php
	setcookie("sessionEndTime", "expireC", time() + 2700, "/"); // Alerts user in 45min
	setcookie("sessionEndTimeLogOut", "expireC", time() + 3600, "/"); // Ends session in 60min, user gets logged out
}

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
    			<div class='inputwrapper'>
					<span>Course Name:</span>
					<input oninput="elementIsValid(this);" class='textinput validate' type='text' id='ncoursename' name='coursename' placeholder='Course Name' />
				</div>
				<p id="dialog4" class="validationDialog">Only letters. Dash allowed in between words</p>
    			<div class='inputwrapper'>
					<span>Course code:</span>
					<input oninput="elementIsValid(this);" class='textinput validate' type='text' id='ncoursecode' name='coursecode' placeholder='Course Code' />
				</div>
				<p id="dialog3" class="validationDialog">2 Letters, 3 digits, 1 letter</p>
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
    			<div class='inputwrapper'>
					<span>Course Name:</span>
					<input oninput="elementIsValid(this);" class='textinput validate' type='text' id='coursename' name='coursename' placeholder='Course Name' />
				</div>
				<p id="dialog4" class="validationDialog">Only letters. Dash allowed in between words</p>
    			<div class='inputwrapper'>
					<span>Course code:</span>
					<input oninput="elementIsValid(this);" class='textinput validate' type='text' id='coursecode' name='coursecode' placeholder='Course Code' />
				</div>
				<p id="dialog2" class="validationDialog">2 letters, 3 digits, 1 letter</p>
    			<div class='inputwrapper'>
					<span>Visibility:</span>
					<select class='selectinput' id='visib'></select>
				</div>
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
    			<div class='inputwrapper'><span>Message of the day:</span><input class='textinput' onchange="validateMOTD('motd','dialog5')" type='text' id='motd' placeholder='Leave blank for no MOTD' /></div>
    			<div class='inputwrapper'><span style='font-style:italic;color:rgba(0,0,0,0.6)'>Read Only:</span><input type="checkbox" name='readonly' id='readonly' title='Disables uploads/submits. Useful for active backup servers.'></select></div>
				
    		</div>
			<p id="dialog5" style="font-size:11px; border:0px; margin-left: 10px; display:none;">Message can only contain a maximum of 50 non-nordic symbols</p>
    		<div style='padding:5px;'>
    			<input class='submit-button' type='button' value='Save' title='Save changes' onclick='updateSettings();' />
    		</div>
    </div>
	</div>
	<!-- Edit Server Settings END -->
</body>
</html>
