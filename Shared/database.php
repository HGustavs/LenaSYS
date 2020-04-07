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
	$printHeaderFunction=0;
	// Send header info to err()?
	if ($printHeaderFunction) {
		$hdr = 'Database Connection Error';
	} else {
		$hdr = '';
	}

	// Connect to DB server
	$OC_db = mysql_connect(DB_HOST,DB_USER,DB_PASSWORD) or err("Could not connect to database ".mysql_errno(),$hdr);
	mysql_set_charset('utf8',$OC_db);
	// Select DB
	mysql_select_db(DB_NAME) or err("Could not select database \"".DB_NAME."\" error code".mysql_errno(),$hdr);
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