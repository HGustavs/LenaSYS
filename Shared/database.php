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

function pdoConnect()
{
	global $pdo;
	try {
    $serverName = DB_HOST;
    $databaseName = DB_NAME;
    $dbLowerCase = strtolower($databaseName);
    $username = DB_USER;
    $password = DB_PASSWORD;

    $pdo = new PDO("pgsql:host=$serverName; dbname=$dbLowerCase; user=$username; password=$password");
	} catch (PDOException $e) {
		echo "Failed to get DB handle: " . $e->getMessage() . "</br>";
		exit;
	}
}
?>