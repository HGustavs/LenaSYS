<?php 

include_once "../../Shared/basic.php";
include_once "../../Shared/sessions.php";

pdoConnect();
session_start();

$sql = 'SELECT cid, coursename, activeversion, coursecode FROM course WHERE visibility=1 ORDER BY cid';

foreach ($pdo->query($sql) as $row) {
	print $row['cid'] . "\t";
	print $row['coursename'] . "\t";
	print $row['coursecode'] . "\t";
	print $row['activeversion'] . "<br>";
}

$pdo = null;
?>
