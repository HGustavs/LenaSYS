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
            <p>SSN&lt;tab&gt;Lastname,&lt;space&gt;Firstname&lt;tab&gt;CID&lt;tab&gt;Ny&lt;tab&gt;PID,&lt;space&gt;Term&lt;tab&gt;Email&lt;linebreak&gt;</p>
            <p>Example:<br/>
                999102-5571	Gregersson, Greger	91001	Ny	WEBUG, H11	b17mahgo@student.his.se<br/>
                888107-4432	Sven Harkel, Egon	91001	Ny	WEBUG, H11	b14sveha@student.his.se<br/>
                777153-6699	Broskelsson, Dagmar	91001	Ny	WEBUG, H09	f16dagbr@student.his.se</p>
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
			<div class='inputwrapper'><span>Teacher:</span><select  id='teacher' value='Teacher' ></select></div>
			<div class='inputwrapper'><span>Study program, Start year:</span><input class='textinput' type='text' id='class' placeholder='WEBUG, H15' /></div>
		</div> 
		<div style='padding:5px;'>
			<input class='submit-button' type='button' value='Save' title='Save changes' onclick='updateUser();' />
		</div> 
	</div> 
	<!-- Add Users Dialog END -->
</body>
</html>
