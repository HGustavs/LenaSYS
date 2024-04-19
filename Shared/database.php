<?php


include_once(__DIR__ . "/../../coursesyspw.php");


//---------------------------------------------------------------------------------------------------------------
// dbconnect - Makes database connection
//---------------------------------------------------------------------------------------------------------------
$pdo = null;

//---------------------------------------------------------------------------------------------------------------
// err - Displays nicely formatted error and exits
//---------------------------------------------------------------------------------------------------------------
function err ($errmsg)
{
	
	print "<p><span class=\"err\">Serious Error: <br /><i>$errmsg</i>.";
	print "</span></p>\n";
	exit;
}



function pdoConnect()
{
	global $pdo;
	try {
		$pdo = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8',DB_USER,DB_PASSWORD);
		if(!defined("MYSQL_VERSION")) {
			define("MYSQL_VERSION",$pdo->query('select version()')->fetchColumn());
		}
	} catch (PDOException $e) {
		echo "Failed to get DB handle: " . $e->getMessage() . "</br>";
		exit;
	}
}
?>