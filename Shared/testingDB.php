<?php
include_once "../../coursesyspw.php";
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";
pdoConnect();
$dir = '../../testingdb';
$file = 'testmodels.sql';
if (!file_exists('../../testingdb')) {
	mkdir('../../testingdb', 0777, true);

	echo "<p>Creating '".$dir."' directory</p>";
}
else{
	echo "<p>Directory '".$dir."' already exists </p>";

}

$dbName = DB_NAME . 'testingdb';
$query = $pdo->prepare("CREATE DATABASE IF NOT EXISTS ".$dbName);

if(!$query->execute()) {
	$error = $query->errorInfo();
	echo "<h4> Error creating database: ".$error[2]."</h4>";
}
else{
	echo "<h4>Database: ".$dbName." created/already exists, no errors</h4>";
}


if(file_exists($dir."/".$file))
{
	echo "<p>".$dir." exists </p>";
	echo "<p>Installing into: ".$dbName."</p>";
	$ret = shell_exec('mysql --user='.DB_USER.' --password='.DB_PASSWORD.' '.$dbName.' < '.$dir."/".$file);
	echo "<h2>".$ret."</h2>";
}
else{
	echo "<h3> File doesn't exist: ".$file."</h3>";
}




?>
