<?php

include_once("../../coursesyspw.php");

//---------------------------------------------------------------------------------------------------------------
// dbconnect - Makes database connection
//---------------------------------------------------------------------------------------------------------------
$pdo = null;

//---------------------------------------------------------------------------------------------------------------
// err - Displays nicely formatted error and exits
//---------------------------------------------------------------------------------------------------------------
function err ($errmsg,$hdr='')
{
	if(!empty($hdr)){
			echo($hdr);
	}
	print "<p><span class=\"err\">Serious Error: <br /><i>$errmsg</i>.";
	print "</span></p>\n";
	exit;
}

function dbConnect()
{
    $printHeaderFunction = false;
    // Send header info to err()?
    $hdr = $printHeaderFunction ? 'Database Connection Error' : '';

    // Connect to DB server
    $OC_db = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
    if (!$OC_db) {
        err("Could not connect to database: " . mysqli_connect_error(), $hdr);
    }

    mysqli_set_charset($OC_db, 'utf8');

    return $OC_db;
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