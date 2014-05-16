<?php
session_start();
include_once(dirname(__FILE__) . "/../../../../coursesyspw.php");
include_once(dirname(__FILE__) . "/../../../Shared/sessions.php");
pdoConnect();
$loggedin = checklogin();
?>
<!--END INCLUDE -->
<nav id="navigate">
	<img onclick="changeURL('')" src="css/svg/Up.svg">
	<img onclick="historyBack()" src="css/svg/SkipB.svg">
</nav>
<div id="title">
	<h1></h1>
</div>
<nav id="user">
	<label id="userName">
		<?php 
			if($loggedin) { 
				echo $_SESSION['loginname']; 
			}
		?>
	</label>
		<?php 
			if($loggedin) { 
				echo'<img class="loggedin" onclick="createDeleteLogin()" src="css/svg/Man.svg">';
				echo '<img id="pwsettings" onclick="changeURL(\'newpassword\')" src="css/images/general_settings_button_white_small.svg" width="40" height="40"/>';
			}
			else {
				echo'<img onclick="createDeleteLogin()" src="css/svg/Man.svg">';
			}
		?>
</nav>
