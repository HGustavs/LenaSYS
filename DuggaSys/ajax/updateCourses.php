<?php 
session_start(); 

include_once(dirname(__file__)."/../../Shared/sessions.php");


if (checklogin()) {

	include_once(dirname(__file__)."/../../../coursesyspw.php");
	include_once(dirname(__file__)."/../../Shared/database.php");
	pdoConnect();
	$stmt = $pdo -> prepare('UPDATE `course` SET `coursename` = :2, `visibility` = :3 WHERE `cid` = :1');
	$stmt -> bindParam(':1', $_POST["courseid"]);
	$stmt -> bindParam(':2', $_POST["coursename"]);
	$stmt -> bindParam(':3', $_POST["visibility"]);
	$stmt -> execute();
	
	echo "The course has been updated!";
} else {
	echo ("No access");
}

?>