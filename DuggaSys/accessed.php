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
			<table style="float:right;">
				<tr>
					<td>	
						<?PHP
							if(isset($_SESSION['uid']))
							{
								echo "<div style='float:right;'><input class='submit-button' type='button' value='Create Users' onclick='showCreateUsersPopup();'/></div>";
								//needs to calculate if the user has access to this button before writing out
							}
						?>
					</td>
					<td>
						<?PHP
							if(isset($_SESSION['uid']))
							{
								echo "<div style='float:right;'><input class='submit-button' type='button' value='Add Users' onclick='showAddUsersPopup();'/></div>";
								//needs to calculate if the user has access to this button before writing out
							}
						?>
					</td>
				</tr>
			</table>
		</div>
		<div id="accessedcontent">
			
		</div>
	</div>
	<!--- Edit Section Dialog END --->
	
	<?php 
		include '../Shared/loginbox.php';
	?>
	
	<!--- Edit User Dialog START --->
	<div id='createUsers' class='loginBox' style='width:500px;display:none;'>
		<div class='loginBoxheader'>
			<h3>Create Users</h3>
			<div onclick='closeWindows();'>x</div>
		</div>
		<div class='note'>
			<p>Users must be separated with a linebreak and the format required for each user is as follows:</p>
			<p>SSN&lt;space&gt;Lastname,&lt;space&gt;Firstname&lt;space&gt;Anmkod&lt;space&gt;Type of registration&lt;space&gt;Study program&lt;space&gt;Year of admittance&lt;space&gt;Email&lt;linebreak&gt;</p>
			<p>Example:<br/>
			000000-0000 Lastname, Firstname 45656 student WEBUG15h 2012 a12firla@student.his.se<br/>
			111111-1111 Lastname, Firstname 45656 teacher FREE 2012 b12firla@student.his.se<br/>
			If a student dosn't have study program, follow this exampel: <br/>
			111111-1111 Lastname, Firstname 45656 student : 2015 b15firla@student.his.se <br/>
			111111-1111 Lastname, Firstname 45656 none : 2015 b15firla@student.his.se </p>
			
		</div>
		<div style='padding:5px;'>
			<input class='submit-button' type='button' value='Add Users' onclick='addUsers();' />
			<textarea id="import" ></textarea>
		</div>
	</div>
	
	<div id='addUsers' class='loginBox' style='width:464px;display:none;'>
		<div class='loginBoxheader'>
			<h3>Add Users</h3>
			<div onclick='closeWindows();'>x</div>
		</div>
		<div class='note'>
			<p>Check the users below to add them to his corse.</p>
			<br/>
			<div>
				<?PHP
					include_once "findUsers.php";
				?>
				<table style="float:right;">
					<tr>
						<td>
							<p>AnmKod:</p>
							<?PHP
								$cid = $_GET["cid"];
								$query = $pdo->prepare("SELECT activeversion FROM course WHERE cid=:cid");
								$query->bindParam(':cid', $cid);
								$query->execute();
								$data = $query->fetch();
								echo"<input id='anmKode' type='text' value='" . $data['activeversion'] . "'/>";
							?>
							
						</td>
						<td>
							<input class='submit-button' type='button' value='Add Users' onclick='addSelectedUsers();' />
						</td>
					</tr>
				</table>
			</div>
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
