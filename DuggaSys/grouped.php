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
	<div id='groupSection' class='loginBox newGroups' style='width:285px;display:none;'>
		<div class='loginBoxheader'>
			<h3>Create Groups</h3>
			<div onclick='closeWindows();clearGroupWindow();'>x</div>
		</div>
		<div style='padding:5px;'>
			<div id='inputwrapper-name' class='inputwrapper' style='display:inline-block;'>
				<select id='selectMomentCreate' style='float:none; width:100%; margin: 8px 0px;'>
				</select><br/>
				<select id="nameTypeCreate" style='float:none; width:100%;'>
					<option value="a">Letters (A,B,C,...)</option>
					<option value="1">Numbers (1,2,3,...)</option>
				</select><br/>
				<input id="numberOfGroupsCreate" type="number" placeholder="  Amount of groups" style='float:none; width:271px; height:24px; margin: 8px 0px;' min="0" max="26"/><br/>
				<!-- <span>Name:</span><input style='float:none; margin-left: 5px;' type='text' class='textinput' id='name' placeholder='Name' /> -->
			</div>
		</div>
		<p style="display:none; color:red;" id="numberOfGroupsError">You have to assign how many groups should be created.</p> 
		<p style="display:none; color:red;" id="toManyCreatedGroupsError">You have created a maximum amount of groups.</p> 
		<div style='padding:5px;'>
			<input style='float:none; display: inline-block;' class='submit-button ' type='button' value='Cancel' onclick='closeWindows();clearGroupWindow();' /> 
			<input style='margin-left: 40px; float:none; display: inline-block;' class='submit-button' type='button' value='Submit' onclick='createGroup();' /> 
		</div>
	</div>
	<!-- Create Group Dialog END -->
	
	<!-- Remove Group Dialog START -->
	<div id='removeGroup' class='loginBox removeGroups' style='width:285px;display:none;'>
		<div class='loginBoxheader'>
			<h3>Remove Groups</h3>
			<div onclick='closeWindows();clearGroupWindow();'>x</div>
		</div>
		<div style='padding:5px;'>
			<div id='inputwrapper-name' class='inputwrapper' style='display:inline-block;'>
				<select id='selectMomentRemove' style='float:none; width:100%; margin: 8px 0px;'>
				</select><br/>
				<select id="nameTypeRemove" style='float:none; width:100%;'>
					<option value="a">Letters (A,B,C,...)</option>
					<option value="1">Numbers (1,2,3,...)</option>
				</select><br/>
				<input id="numberOfGroupsRemove" type="number" placeholder="  Amount of groups" style='float:none; width:271px; height:24px; margin: 8px 0px;' min="0" max="26"/><br/>
			
			</div>
		</div>
		<p style="display:none; color:red;" id="numberOfGroupsError">You have to assign how many groups should be created.</p> 
		<p style="display:none; color:red;" id="toManyCreatedGroupsError">You have created a maximum amount of groups.</p> 
		<div style='padding:5px;'>
			<input style='float:none; display: inline-block;' class='submit-button ' type='button' value='Cancel' onclick='closeWindows();clearGroupWindow();' /> 
			<input style='margin-left: 40px; float:none; display: inline-block;' class='submit-button' type='button' value='Remove' onclick='removeGroup();' /> 
		</div>
	</div>
	<!-- Remove Group Dialog END -->
	<!-- Maximum of Groups Dialog START -->
	<div id='toManyCreatedGroups' class='loginBox' style='width:285px;display:none;'>
		<div class='loginBoxheader'>
			<h3>Manage Groups</h3>
			<div onclick='closeGroupLimit();'>x</div>
		</div>
		<p style="display:inline-block; color:red;">You have created a maximum amount of groups.</p> 
		<div style='padding:5px;'>
			<input style='margin-left: 40px; float:none; display: inline-block;' class='submit-button' type='button' value='OK' onclick='closeGroupLimit();' /> 
		</div>
	</div>
	<!-- Maximum of Groups Dialog END -->
</body>
</html>
