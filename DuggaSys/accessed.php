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
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
	<title>Access Editor</title>
	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">
	<link id="themeBlack" type="text/css" href="../Shared/css/blackTheme.css" rel="stylesheet">
	
	<script src="darkmodeToggle.js"></script>
	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
	<script src="../Shared/dugga.js"></script>
	<script src="../Shared/SortableTableLibrary/sortableTable.js"></script>
	<script src="accessed.js"></script>

</head>
<body onload="setup(); displayNavIcons();">
	<?php
		$noup="SECTION";
		include '../Shared/navheader.php';
	?>

	<!-- content START -->
	<div id="content">
		<div id="headerContent"> <!-- A div to place header content. -->
			<?php
				echo "<div class='titles' style='padding-top:10px;'>";
				echo "<h1 style='flex:1;text-align:start;'>Edit course access</h1>";
			?>
			</div>
			<div id='searchBarMobile' style='test-align:right;margin-bottom:15px;'>
				<div id='tooltip-mobile' class="tooltip-searchbar">
					<div class="tooltip-searchbar-box">
							<b>Keywords:</b> username, date <br>
						<b>Ex:</b> 2019-05-21
					</div>
					<span>?</span>
				</div>
				<input id='searchinputMobile' type='text' name='search' placeholder='Search..' onkeyup='searchterm=document.getElementById("searchinputMobile").value;searchKeyUp(event);myTable.reRender();document.getElementById("searchinput").value=document.getElementById("searchinputMobile").value;'/>

				<button id='searchbuttonMobile' class='switchContent' onclick='searchterm=document.getElementById("searchinputMobile").value;searchKeyUp(event);myTable.reRender();' type='button'>
					<img alt='search icon' id='lookingGlassSVG' style='height:18px;' src='../Shared/icons/LookingGlass.svg'/>
				</button>
			</div>
		</div>
		<div id='accessTable' style='width:100%; white-space: nowrap;'></div> <!-- A div to place the access table within. -->

	<!-- Login Dialog START -->
	<?php
		include '../Shared/loginbox.php';
	?>
	<!-- Login Dialog END -->

	<!-- Add User Dialog START -->
	<div id='createUser' class='loginBoxContainer' style='display:none;'>
		<div class='loginBox' style='width:494px;'>
			<div class='loginBoxheader'>
				<h3>Add user</h3>
				<div class='cursorPointer' onclick='closeWindows();'>x</div>
			</div>
			<div style='padding:5px;'>
				<input type='hidden' id='uid' value='Toddler' />
				<div class='flexwrapper'>
					<span>First Name:</span>
					<div class="tooltipDugga"><span id="tooltipFirst" style="display: none;" class="tooltipDuggatext">  </span></div>
					<input placeholder="Greger" class='textinput' type='text' id='addFirstname' onchange="tooltipFirst()" onkeyup="tooltipFirst()"/>
				</div>
				<div class='flexwrapper'>
					<span>Last Name:</span>
					<div class="tooltipDugga"><span id="tooltipLast" style="display: none;" class="tooltipDuggatext">  </span></div>
					<input placeholder="Gregersson" class='textinput' type='text' id='addLastname' onchange="tooltipLast()" onkeyup="tooltipLast()"/>
				</div>
				<div class='flexwrapper'>
					<span>Term:</span>
					<div class="tooltipDugga"><span id="tooltipTerm" style="display: none;" class="tooltipDuggatext">  </span></div>
					<input placeholder="HT-11" class='textinput' id='addTerm'onchange="tooltipTerm()" onkeyup="tooltipTerm()">
				</div>
				<div class='flexwrapper'>
					<span>Email:</span>
					<div class="tooltipDugga"><span id="tooltipEmail" style="display: none;" class="tooltipDuggatext">  </span></div>
					<input placeholder="b17mahgo@student.his.se" class='textinput' id='addEmail' onchange="tooltipEmail()" onkeyup="tooltipEmail()"/>
				</div>
			</div>
			 <div style='padding:5px;display:flex;justify-content: flex-end;'>
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

	<div class="fixed-action-button extra-margin" id="fabButtonAcc">
		<a class="btn-floating fab-btn-lg noselect" id="fabBtn">+</a>
		<ol class="fab-btn-list" style="margin: 0; padding: 0; display: none;" reversed>
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
