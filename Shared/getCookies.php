<?php
	session_start();
	if (isset($_POST['ckn'])) {

		$COOKIENAME = $_POST['ckn'];

		$userid = $_SESSION['uid'];
		$cookie = crypt(($userid . $COOKIENAME),"$1$snuskaka$");

		if (($COOKIENAME == "sectC" && isset($_COOKIE[$cookie])) && isset($_POST['clist'])) {
			setcookie($cookie,$_POST['clist'],time() + (86400 * 15),'/');
		}else if($COOKIENAME == "sectC" && isset($_COOKIE[$cookie])){
			$ans = $_COOKIE[$cookie];
		}else if (($COOKIENAME == "duggedC" && isset($_COOKIE[$cookie])) && isset($_POST['clist'])) {
			setcookie($cookie,$_POST['clist'],time() + (86400 * 15),'/');
		}else if($COOKIENAME == "duggedC" && isset($_COOKIE[$cookie])){
			$ans = $_COOKIE[$cookie];
		}
		echo $ans;
	}
?>