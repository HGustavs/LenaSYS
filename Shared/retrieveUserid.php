<?php
include_once ("../Shared/database.php");
pdoConnect();

$uname = strval($_GET['uname']);

foreach ($pdo->query('SELECT * FROM user WHERE username="'.$uname.'"') AS $row){
	echo $row['uid'];

}

?>