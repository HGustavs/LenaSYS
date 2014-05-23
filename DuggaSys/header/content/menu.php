<?php 
	session_start();
	include_once(dirname(__FILE__) . "/../../../Shared/sessions.php"); 
?>
<ul>
	<!--Add more to the usersettings list here within new <li> elements-->
	<li onclick="changeURL('newpassword')">Change password</li>
    <li onclick="changeURL('myresults')">My results</li>
    <?php if(isSuperUser($_SESSION['uid'])) { ?>
    	<li onclick="changeURL('myresults')">Märtas knapp här</li>
    <?php } ?>
</ul>