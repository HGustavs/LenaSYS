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
	<meta http-equiv="X-UA-Compatible" content="IE=edge"> 
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Access Editor</title>
	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">  
	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
	<script src="../Shared/dugga.js"></script>
	<script src="accessed.js"></script>
</head>
<body>
	
	<?php 
		$noup=true;
		$loginvar="ACCESS"; 
		include '../Shared/navheader.php';
	?>
		
	<!-- content START -->
	<div id="wrappall">
		<div id="newbutton">
			<?PHP
				echo "<div style='float:right;'><input class='submit-button' type='button' value='Add Users' onclick='showCreateUsersPopup();'/></div>";
				//needs to calculate if the user has access to this button before writing out
			?>		
		</div>
		<div id="accessedcontent">
			
		</div>
	</div>
	<!--- Edit Section Dialog END --->
	
	<?php 
		include '../Shared/loginbox.php';
	?>
	
	<!--- Edit User Dialog START --->
	<div id='createUsers' class='loginBox' style='width:464px;display:none;'>
		<div class='loginBoxheader'>
			<h3>Create Users</h3>
			<div onclick='closeWindows();'>x</div>
		</div>
		<div class='note'>
			<p>Users must be separated with a linebreak and the format required for each user is as follows:</p>
			<p>SSN&lt;space&gt;Lastname,&lt;space&gt;Firstname&lt;space&gt;Email&lt;linebreak&gt;</p>
			<p>Example:<br/>
			000000-0000 Lastname, Firstname a12firla@student.his.se<br/>
			111111-1111 Lastname, Firstname b12firla@student.his.se</p>
		</div>
		<div style='padding:5px;'>
			<input class='submit-button' type='button' value='Add Users' onclick='addUsers();' />
			<textarea id="import" ></textarea>
		</div>
	</div>
	
	<!-- Edit User Dialog END -->
	<!-- Add Users Dialog START -->
	<div id='editUsers' class='loginBox' style='width:464px;display:none;'>
		<div class='loginBoxheader'>
			<h3>Edit Users</h3>
			<div onclick='closeWindows();'>x</div>
		</div>
					
		<div style='padding:5px;'>
			<input type='hidden' id='uid' value='Toddler' /></td>
			<div class='inputwrapper'><span>UserName:</span><input class='textinput' type='text' id='usrnme' value='User Name' /></div>
			<div class='inputwrapper'><span>SSN:</span><input class='textinput' type='text' id='ussn' value='SSN' /></div>
			<div class='inputwrapper'><span>First Name:</span><input class='textinput' type='text' id='firstname' value='First Name' /></div>	
			<div class='inputwrapper'><span>Last Name:</span><input class='textinput' type='text' id='lastname' value='Last Name' /></div>
		</div> 
		<div style='padding:5px;'>
			<input class='submit-button' type='button' value='Save' title='Save changes' onclick='updateUser();' />
		</div> 
	</div> 
	<!-- Add Users Dialog END -->
</body>
</html>
