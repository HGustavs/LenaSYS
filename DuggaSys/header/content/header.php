<?php
session_start();
include_once(dirname(__FILE__) . "/../../../../coursesyspw.php");
include_once(dirname(__FILE__) . "/../../../shared/database.php");
dbConnect();
?>
<!--END INCLUDE -->
<nav id="navigate">
	<img src="css/svg/Up.svg">
	<img onclick="historyBack()" src="css/svg/SkipB.svg">
</nav>
<div id="title">
	<h1></h1>
</div>
<nav id="user">
	<label>
		<?php 
			if(isset($_SESSION['loginname'])) { 
				echo $_SESSION['loginname']; 
			}
		?>
	</label>
	<img onclick="createDeleteLogin()" src="css/svg/Man.svg">
</nav>