<?php
	//init the session to access session data
	session_start();
	//check if the POST is set
	if (isset($_POST['ckn'])) {

		//set the cookie name to the variable from POST
		$COOKIENAME = $_POST['ckn'];

		//define the timer of the cookies, cookies will be refreshed with this everytime they are modified
		$defCookieTimer = (time() + (86400 * 365));
		
		//get session information for constructing the cookie name
		$userid = $_SESSION['loginname'];

		//$cookie = crypt(($userid . $COOKIENAME . $courseinfo),"$1$snuskaka$");
		$cookie = ($userid . $COOKIENAME . $_SESSION['cid'] . $_SESSION['coursevers']);

		if (($COOKIENAME && isset($_COOKIE[$cookie])) && isset($_POST['clist'])) {
			setcookie($cookie,$_POST['clist'],$defCookieTimer,'/');
		}else if($COOKIENAME && isset($_COOKIE[$cookie])){
			$ans = $_COOKIE[$cookie];
		}
		echo $ans;
	}
?>