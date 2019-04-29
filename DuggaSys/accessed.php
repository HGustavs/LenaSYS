<?php
	session_start();
	include_once "../../coursesyspw.php";
	include_once "../Shared/sessions.php";
	pdoConnect();
?><!DOCTYPE html>
<html lang="sv">
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
<body onload="setup();">
	<?php
		$noup="SECTION";
		include '../Shared/navheader.php';
	?>

	<!-- content START -->
		<div id="wrappall" style="border-top:0px;display:table; table-layout:auto;padding:0px 10px 0px 10px;border:none;width:auto;">
		<div id="newbutton">
			<?php
				echo "<div class='titles' style='position:sticky;top:50px;z-index:100;background:#ffffff;padding-top:20px;padding-bottom:20px;margin-top:0px;'>";
				echo "<h1 style='flex:1;text-align:center;position:relative;left:100px;'>Access</h1>";
				echo "<div style='align-items: flex-end; display: flex; justify-content: space-between;'>";
				echo "<div id='searchBar' style='position:relative; top:20px; left: 12px;'>";
				echo "<input id='searchinput' type='text' name='search' placeholder='Search..' onkeyup='searchterm=document.getElementById(\"searchinput\").value;searchKeyUp(event);myTable.renderTable();'> ";
				echo "<button id='searchbutton' class='switchContent' onclick='return searchKeyUp(event);' type='button'>";
				echo "<img id='lookingGlassSVG' style='height:18px;' src='../Shared/icons/LookingGlass.svg'>";
				echo "</button>";
				echo "</div>";
				echo "</div>";
				//needs to calculate if the user has access to this button before writing out
			?>
	</div>
</div>
	<div id='accessTable' style='width:100%; white-space: nowrap;'></div>
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
                  <p>SSN; Lastname; Firstname; CID; Date; Tempo; Regstatus; Status; Classname&lt;linebreak&gt;</p>
                  <p>Example:<br/>
				  	18972221-8475;Piraten-Nilsson; Sven;92337 ; 2019-01-21 - 2019-03-31 ; 50% ; Normal;Ej påbörjad;WEBUG<br/>
					18531603-5473;Grishufvud; Egon;92337 ; 2019-01-21 - 2019-03-31 ; 50% ; Normal;Registrerad; ej avklarad (1);DVSUG</p>
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
      			<input type='hidden' id='uid' value='Toddler' />
      			<div class='inputwrapper'><span>SSN:</span><input placeholder="999102-5571" class='textinput' type='text' id='addSsn'/></div>
      			<div class='inputwrapper'><span>First Name:</span><input placeholder="Greger" class='textinput' type='text' id='addFirstname'/></div>
      			<div class='inputwrapper'><span>Last Name:</span><input placeholder="Gregersson" class='textinput' type='text' id='addLastname'/></div>
      			<div class='inputwrapper'><span>CID:</span><input placeholder="91001" class='textinput' id='addCid'></div>
      			<div class='inputwrapper'><span>Ny:</span><input placeholder="Ny" class='textinput' id='addNy'></div>
      			<div class='inputwrapper'><span>PID:</span><input placeholder="WEBUG" class='textinput' id='addPid'></div>
      			<div class='inputwrapper'><span>Term:</span><input placeholder="H11" class='textinput' id='addTerm'></div>
      			<div class='inputwrapper'><span>Email:</span><input placeholder="b17mahgo@student.his.se" class='textinput' id='addEmail'></div>
      		</div>
      		<div style='padding:5px;'>
      			<input class='submit-button' type='button' value='Add' onclick='addSingleUser();' />
      		</div>
      </div>
	</div>

	<div id='createClass' class='loginBoxContainer' style='display:none;'>
      <div class='loginBox' style='width:464px;'>
      		<div class='loginBoxheader'>
      			<h3>Add class</h3>
      			<div class='cursorPointer' onclick='closeWindows();'>x</div>
      		</div>
      		<div style='padding:5px;'>
      		    <input type='hidden' id='uid' value='Toddler' />
      		    <div class='inputwrapper'><span>Class:</span><input placeholder="WEBUG13h" class='textinput' type='text' id='addClass'/></div>
      		    <div class='inputwrapper'><span>Responsible:</span><select class='textinput' id='addResponsible'></select></div>
      		    <div class='inputwrapper'><span>Classname:</span><input placeholder="Webbutvecklare - programmering" class='textinput' type='text' id='addClassname'/></div>
              <div class='inputwrapper'><span>Regcode:</span><input placeholder="199191" class='textinput' id='addRegcode'></div>
		    			<div class='inputwrapper'><span>Classcode:</span><input placeholder="WEBUG" class='textinput' type='text' id='addClasscode'/></div>
              <div class='inputwrapper'><span>Hp:</span><input placeholder="180.0" class='textinput' id='addHp'></div>
		    			<div class='inputwrapper'><span>Tempo:</span><input placeholder="100" class='textinput' id='addTempo'></div>
		    			<div class='inputwrapper'><span>HpProgress:</span><input placeholder="0.0" class='textinput' id='addHpProgress'></div>
      		</div>
      		<div style='padding:5px;'>
      			<input class='submit-button' type='button' value='Add' onclick='addClass();' />
            <div id='classErrorText' style='color:rgb(199, 80, 80); margin-top:10px; text-align:center;'></div>
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
      			<input type='hidden' id='uid' value='Toddler' />
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

	<div class="fixed-action-button" id="fabButtonAcc">
	    <a class="btn-floating fab-btn-lg noselect" id="fabBtn">+</a>
	    <ol class="fab-btn-list" style="margin: 0; padding: 0; display: none;" reversed>
	        <li onclick="showImportUsersPopup();" >
							<a id="iFabBtn" class="btn-floating fab-btn-sm scale-transition scale-out" data-tooltip='Import user(s)'>
									<img id="iFabBtnImg" class="fab-icon" src="../Shared/icons/importUser.svg">
							</a>
					</li>
	        <li onclick="showCreateUserPopup();">
							<a id="cFabBtn" class="btn-floating fab-btn-sm scale-transition scale-out" data-tooltip='Create user'>
									<img id="cFabBtnImg" class="fab-icon" src="../Shared/icons/createUser.svg">
							</a>
					</li>
	    </ol>
	</div>
	<div id="editpopover" style="display:none;"></div>
</body>
</html>
