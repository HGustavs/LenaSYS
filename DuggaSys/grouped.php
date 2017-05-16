<?php
	session_start(); // Needed for the user must be logged in. 

	include_once "../../coursesyspw.php"; // Passwords to the database etc. 
	include_once "../Shared/sessions.php"; // Session methods or something
	pdoConnect();
?>
<!DOCTYPE html>
<html>
<head>
	<link rel="icon" type="image/ico" href="../Shared/icons/favicon.ico"/>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Group editor for duggas</title>

	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
  	<link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">

	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>

	<script src="../Shared/dugga.js"></script>
	<script src="grouped.js"></script>
</head>
<body onload="setup();">

	<!-- Navigation Header START -->
	<?php
		$noup="SECTION"; // This makes the back-button available. 
		include '../Shared/navheader.php';
	?>
	<!-- Navigation Header END -->

	<!-- Content START -->
	<div id="content">

	</div>
	<!-- Content END -->

	<!-- Login Dialog START -->
	<?php
		include '../Shared/loginbox.php';
	?>
	<!-- Login Dialog END -->
	
	<!-- Create Group Dialog START -->
	<div id='groupSection' class='loginBox' style='width:285px;display:none;'>
		<div class='loginBoxheader'>
			<h3>Manage Groups</h3>
			<div onclick='closeWindows();'>x</div>
		</div>
		<div style='padding:5px;'>
			<div id='inputwrapper-name' class='inputwrapper' style='display:inline-block;'>
				<select id='selectMoment' style='float:none; width:100%; margin: 8px 0px;'>
				</select><br/>
				<select id="nameType" style='float:none; width:100%;'>
					<option value="a">a-z</option>
					<option value="1">1-</option>
				</select><br/>
				<input id="numberOfGroups" type="number" placeholder="  Amount of groups" style='float:none; width:271px; height:24px; margin: 8px 0px;' min="0"/><br/>
				<!-- <span>Name:</span><input style='float:none; margin-left: 5px;' type='text' class='textinput' id='name' placeholder='Name' /> -->
			</div>
		</div>
		<p style="display:none; color:red;" id="numberOfGroupsError">Du måste hur många grupper du vill skapa.</p> 
		<div style='padding:5px;'>
			<input style='float:none; display: inline-block;' class='submit-button ' type='button' value='Cancel' onclick='closeWindows();' /> 
			<input style='margin-left: 40px; float:none; display: inline-block;' class='submit-button' type='button' value='Submit' onclick='createGroup();' /> 
		</div>
	</div>
	<!-- Create Group Dialog END -->

</body>
</html>
