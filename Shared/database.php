<?php
include_once(dirname(__file__)."/../../coursesyspw.php");
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
	$mysqli = new mysqli($DB_HOST, $DB_USER, $DB_PASSWORD, $DB_NAME);
    /* check connection */
    if (mysqli_connect_errno()) {
    printf(""Could not select database \"".DB_NAME."\" error code", mysqli_connect_error());
    exit();
}
}

function pdoConnect()
{
	global $pdo;

	$pdo = new PDO(
		'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8',
		DB_USER,
		DB_PASSWORD
	);
}
?>
