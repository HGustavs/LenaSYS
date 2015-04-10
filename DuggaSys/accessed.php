<?php
session_start();
include_once "../../coursesyspw.php";
include_once "../Shared/sessions.php";
pdoConnect();
?>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=edge"> 
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Access Editor</title>

	<link type="text/css" href="css/style.css" rel="stylesheet">
  <link type="text/css" href="css/jquery-ui-1.10.4.min.css" rel="stylesheet">  

	<script src="js/jquery-1.11.0.min.js"></script>
	<script src="js/jquery-ui-1.10.4.min.js"></script>

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
	<div id="content">
					
	</div>

	<!--- Edit Section Dialog END --->
	
	<?php 
		include 'loginbox.php';
	?>
	
	<!--- Edit User Dialog START --->
	<div id='createUsers' class='loginBox' style='width:464px;display:none;'>

	<div class='loginBoxheader'>
	<h3>Create Users</h3>
	<div onclick='closeWindows();'>x</div>
	</div>
 
	The format required for the information is the following: SSN&lt;TAB&gt;NAME&lt;TAB&gt; EMAIL e.g.: 
	<div class='note'>000000-0000 LastName, FirstName a12firla@student.his.se</div>

	<table width="100%"><tr>
			<td align='right'><input class='submit-button' type='button' value='Add Users' onclick='addUsers();' /></td>
		</tr>
	</table>

	<table width="100%">
		<tr>
			<td><textarea id="import" style="width:100%;height:200px;" ></textarea></td> 
		</tr>
	</table>

	</div>
	<!--- Edit User Dialog END --->

	<!--- Add Users Dialog START --->
	<div id='editUsers' class='loginBox' style='width:464px;display:none;'>

	<div class='loginBoxheader'>
	<h3>Edit Users</h3>
	<div onclick='closeWindows();'>x</div>
	</div>
				
	<table width="100%">
		<tr>
			<input type='hidden' id='uid' value='Toddler' /></td>
			<td>UserName: <input class='form-control textinput' type='text' id='usrnme' value='User Name' /></td>		
			<td>SSN: <input class='form-control textinput' type='text' id='ussn' value='SSN' /></td>
		</tr>
		<tr>
			<td>First Name: <input class='form-control textinput' type='text' id='firstname' value='First Name' /></td>		
			<td>Last Name: <input class='form-control textinput' type='text' id='lastname' value='Last Name' /></td>
		</tr>
	</table>

	<table width="100%"><tr>
			<td align='right'><input class='submit-button' type='button' value='Save' onclick='updateUser();' /></td>
		</tr>
	</table>

	</div> 
	<!--- Add Users Dialog END --->
		
</body>
</html>
