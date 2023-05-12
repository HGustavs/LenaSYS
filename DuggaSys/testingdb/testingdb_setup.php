<?php
include_once "../../../coursesyspw.php";
include_once "../../Shared/sessions.php";

pdoConnect();
echo "<p>starting testingdb install! </p>";
$file = 'testingdb_queries.sql';
$dbName = DB_NAME . 'testingdb';

if(!file_exists($file))
{
	echo "<p>Can't find query file: ".$file." aborting</p>";
	exit;
}
else{
	echo "<p> Query file found! </p>";
}

// Check if database exists
$query = $pdo->prepare('SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '."'".$dbName."'");
if(!$query->execute()) {
	$error = $query->errorInfo();
	echo "<p> Error checking for database: ".$error[2]."</p>";
	exit;
}
else{
	// drop database, removing all changes
	echo "<p>Database exists already, resetting...</p>";
	
	$query = $pdo->prepare('DROP DATABASE '.$dbName);
	if(!$query->execute()) {
		$error = $query->errorInfo();
		echo "<p> Error dropping database: ".$error[2]."</p>";
	}
	else{
		echo "<p>Database reset</p>";
	}
}

// create database
$query = $pdo->prepare("CREATE DATABASE IF NOT EXISTS ".$dbName);

if(!$query->execute()) {
	$error = $query->errorInfo();
	echo "<p> Error creating database: ".$error[2]."</p>";
	exit;
}
else{
	echo "<p>Database: ".$dbName." created/already exists, no errors</p>";
}

updateCoursesyspw($dbName);

// add data to database
echo "<p>Importing ".$file." into : ".$dbName."</p>";

$sql = file_get_contents($file);
importDatabase("localhost", DB_USER, DB_PASSWORD, $dbName, $sql);

echo "<h2>Testing database installed! </h2>";

function importDatabase($host, $usr, $pwd, $db, $sql)
{
	$mysqli = new mysqli($host, $usr, $pwd, $db);
	$mysqli->multi_query($sql);
	while ($mysqli->next_result());
}

// Update coursesyspw.php to include testdatabase
function updateCoursesyspw($name) {
	$filename = "../../../coursesyspw.php";
	if(!file_exists($filename))
	{
		echo $filename." doesn't exist<br>";
	}

	$str = 'define("DB_TESTING", "'.$name.'");';
	$contents = file_get_contents($filename);
	$pos = strpos($contents, $str);

	if($pos === false)
	{
		$find = strpos($contents, '?>');
		$pre = substr($contents, 0, $find);
		$post = substr($contents, $find);
		$write = $pre.$str.$post;

		if(file_put_contents($filename, $write) === false)
		{
			echo "can't write to file<br>";
			exit;
		}
		echo "Success writing to {$filename}";
	}
	else{
		echo $str." already exists in 'coursesyspw.php'<br>";
	}
}
