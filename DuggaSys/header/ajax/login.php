<?php
session_start();
include_once(dirname(__FILE__) . "/../../../../../coursesyspw.php";
include_once(dirname(__FILE__) . "/../../../../shared/database.php";
include_once(dirname(__FILE__) . "/../../../../shared/sessions.php";

dbConnect();

$res = array("login" => "failed");

if(login()) {
	$res["login"] = "success";
}

echo json_encode($res);
?>
