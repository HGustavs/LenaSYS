<?php
include_once(__DIR__ . "/database.php");
pdoConnect();

$uname = strval($_GET['uname']);

foreach ($pdo->query('SELECT * FROM user WHERE username="'.$uname.'"') AS $row){
	$uid = $row['uid'];

}
echo json_encode(["uid" => $uid]);

?>