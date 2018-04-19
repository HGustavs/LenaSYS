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
	<script src="../Shared/SortableTableLibrary/sortableTable.js"></script> 
	<script src="accessed.js"></script>

</head>
<body>
	
	<?php 
		$noup=true;
		include '../Shared/navheader.php';
	?>
		
	<!-- content START -->
	<div id="wrappall" style="border-top:0px">
		<div id="newbutton">
			<?PHP
				echo "<div class='titles' style='position:sticky;top:50px;z-index:100;background:#ffffff;padding-top:20px;padding-bottom:20px;margin-top:0px;'>";
				echo "<h1 style='flex:10;text-align:center;'>Access</h1>";
				echo "<div style='align-items: flex-end; display: flex; justify-content: space-between;'>";
				echo "<div style='display: inline-block;'>";
				echo "<input class='submit-button' type='button' value='Add user' onclick='showCreateUserPopup();'/>";
				echo "<input class='submit-button' type='button' value='Import user(s)' onclick='showImportUsersPopup();'/>";
				echo "</div>";
				echo "<input id='searchinput' type='text' name='search' placeholder='Search...' >";
				echo "</div>";
				//needs to calculate if the user has access to this button before writing out
			?>		
		</div>
	</div>
	<div id="user" style='width:100%; border: 2px solid green;'></div>
	<!--- Edit Section Dialog END --->
	
	<?php 
		include '../Shared/loginbox.php';
	?>
	
	<!-- Import Users Dialog START -->
	<div id='importUsers' class='loginBoxContainer' style='display:none;'>
      <div class='loginBox' style='width:464px;'>
      		<div class='loginBoxheader'> 
      			<h3>Import users</h3>
      			<div class='cursorPointer' onclick='closeWindows();'>x</div>
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
      			<textarea id="import" ></textarea>
      			<input class='submit-button' type='button' value='Import' onclick='importUsers();' />
      		</div>
      </div>
	</div>
	<!-- Import Users Dialog END -->

	<!-- Add User Dialog START -->
	<div id='createUser' class='loginBoxContainer' style='display:none;'>
      <div class='loginBox' style='width:464px;'>
      		<div class='loginBoxheader'> 
      			<h3>Add user</h3>
      			<div class='cursorPointer' onclick='closeWindows();'>x</div>
      		</div>
      		<div style='padding:5px;'>
      			<input type='hidden' id='uid' value='Toddler' /></td>
      			<div class='inputwrapper'><span>SSN:</span><input placeholder="999102-5571" class='textinput' type='text' id='addSsn'/></div>
      			<div class='inputwrapper'><span>First Name:</span><input placeholder="Greger" class='textinput' type='text' id='addFirstname'/></div>	
      			<div class='inputwrapper'><span>Last Name:</span><input placeholder="Gregersson" class='textinput' type='text' id='addLastname'/></div>
      			<div class='inputwrapper'><span>CID:</span><input placeholder="91001" class='textinput' id='addCid'></input></div>
      			<div class='inputwrapper'><span>Ny:</span><input placeholder="Ny" class='textinput' id='addNy'></input></div>
      			<div class='inputwrapper'><span>PID:</span><input placeholder="WEBUG" class='textinput' id='addPid'></input></div>
      			<div class='inputwrapper'><span>Term:</span><input placeholder="H11" class='textinput' id='addTerm'></input></div>
      			<div class='inputwrapper'><span>Email:</span><input placeholder="b17mahgo@student.his.se" class='textinput' id='addEmail'></input></div>
      			
      		</div> 
      		<div style='padding:5px;'>
      			<input class='submit-button' type='button' value='Add' onclick='addSingleUser();' />
      		</div> 
      </div>
	</div>
	
	<!-- Add User Dialog END -->
	<!-- Edit User Dialog START -->
	<div id='editUsers' class='loginBoxContainer' style='display:none;'>
      <div class='loginBox' style='width:464px;'>
      		<div class='loginBoxheader'>
      			<h3>Edit Users</h3>
      			<div class='cursorPointer' onclick='closeWindows();'>x</div>
      		</div>
      					
      		<div style='padding:5px;'>
      			<input type='hidden' id='uid' value='Toddler' /></td>
      			<div class='inputwrapper'><span>UserName:</span><input class='textinput' type='text' id='usrnme' value='User Name' /></div>
      			<div class='inputwrapper'><span>SSN:</span><input class='textinput' type='text' id='ussn' value='SSN' /></div>
      			<div class='inputwrapper'><span>First Name:</span><input class='textinput' type='text' id='firstname' value='First Name' /></div>
      			<div class='inputwrapper'><span>Last Name:</span><input class='textinput' type='text' id='lastname' value='Last Name' /></div>
      			<!--<div class='inputwrapper'><span>Teacher:</span><select  id='teacher' value='Teacher' ></select></div>-->
      			<div class='inputwrapper'><span>Study program, Start year:</span><select id='class' value='Class'></select></div>
      		</div> 
      		<div style='padding:5px;'>
      			<input class='submit-button' type='button' value='Save' title='Save changes' onclick='updateUser();' />
      		</div> 
      </div>
	</div> 
	<!-- Edit User Dialog END -->
</body>
</html>
