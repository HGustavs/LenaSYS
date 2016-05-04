<?php 
session_start();
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";

$ha = checklogin();

if ($ha) {
	$username = $_SESSION["loginname"];
	//sets a cookie so its known that this particular user allows cookies and will not be bothered with a "do you allow cookies" dialog in a while
	if (!isset($_COOKIE[$username."_allow_cookies"])) {
		setcookie($username."_allow_cookies", "set", time() + (86400 * 60) ) ; //86400 = 1day
	}
}

echo json_encode($ha);
 ?>