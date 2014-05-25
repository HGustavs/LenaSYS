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
	<label id="userName" onclick="showUserSettings()">
		<?php 
			if($loggedin) { 
				echo $_SESSION['loginname']; 
			}
		?>
	</label>
		<?php 
			if($loggedin) { 
				echo'<img class="loggedin" onclick="createDeleteLogin()" src="css/svg/Man.svg">';
			}
			else {
				echo'<img onclick="createDeleteLogin()" src="css/svg/Man.svg">';
			}
		?>
</nav>


