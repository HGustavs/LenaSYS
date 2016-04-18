<?php
	session_start();
	if (isset($_POST['ckn'])) {

		$COOKIENAME = $_POST['ckn'];

		$defCookieTimer = (time() + (86400 * 365));

		$userid = $_SESSION['uid'];
		$cookie = crypt(($userid . $COOKIENAME),"$1$snuskaka$");

		if (($COOKIENAME == "sectC" && isset($_COOKIE[$cookie])) && isset($_POST['clist'])) {
			setcookie($cookie,$_POST['clist'],$defCookieTimer,'/');
		}else if($COOKIENAME == "sectC" && isset($_COOKIE[$cookie])){
			$ans = $_COOKIE[$cookie];
		}else if (($COOKIENAME == "duggedC" && isset($_COOKIE[$cookie])) && isset($_POST['clist'])) {
			setcookie($cookie,$_POST['clist'],$defCookieTimer,'/');
		}else if($COOKIENAME == "duggedC" && isset($_COOKIE[$cookie])){
			$ans = $_COOKIE[$cookie];
		}
		echo $ans;
	}
?>