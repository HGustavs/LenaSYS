<?php
include_once "../../coursesyspw.php";
include_once "../Shared/database.php";
include_once "../Shared/sessions.php";

dbConnect();

$res = array("login" => "failed");

if(login()) {
	$res["login"] = "success";
}

echo json_encode($res);
?>
