<?php
include_once dirname(__FILE__) . "/database.php";
include_once dirname(__FILE__) . "/courses.php";
include_once dirname(__FILE__) . "/sessions.php";

//---------------------------------------------------------------------------------------------------------------
// endsWith - Tests if a string ends with another string - defaults to being non-case sensitive
//---------------------------------------------------------------------------------------------------------------
function endsWith($haystack,$needle,$case=true)
{
	if($case){return (strcmp(substr($haystack, strlen($haystack) - strlen($needle)),$needle)===0);}
	return (strcasecmp(substr($haystack, strlen($haystack) - strlen($needle)),$needle)===0);
}
//---------------------------------------------------------------------------------------------------------------
// bodywarning - prints a nicely formatted warning
//---------------------------------------------------------------------------------------------------------------
function bodywarning($msg)
{
		echo "<body>";
		echo "<span style='text-align:center;'><div class='warning'>";
		echo $msg."<hr/>";
		echo "Do not forget to use a recent browser and to enable Javascript.<br/>";
		echo "</div></span>";
		echo "</body>";		
}

//---------------------------------------------------------------------------------------------------------------
// jsvarget - Code to translate get variable to javascript through PHP
//---------------------------------------------------------------------------------------------------------------

function jsvarget($getname,$varname){
	if(isset($_GET[$getname])){
		echo 'var '.$varname.'="'.$_GET[$getname].'";';
	}else{
		echo 'var '.$varname.'="NONE!";';												
	}
}		

//---------------------------------------------------------------------------------------------------------------
// jsvarget - Code to translate session variable to javascript through PHP
//---------------------------------------------------------------------------------------------------------------

function jsvarsession($getname,$varname){
	if(isset($_SESSION[$getname])){
		echo 'var '.$varname.'="'.$_SESSION[$getname].'";';
	}else{
		echo 'var '.$varname.'="NONE!";';												
	}
}	

/**
 * Log a message to the eventlog in the database. Use sparingly since it will
 * be logged to the table each time the function is run.
 * @
 */
function log_message($user, $message) 
{
	global $pdo;

	if($pdo == null) {
		pdoConnect();
	}

	// TODO: Add support for types of events?
	$query = $pdo->prepare("INSERT INTO eventlog(address, user, eventtext) VALUES(:address, :user, :eventtext)");

	$query->bindParam(':user', $user);

	// TODO: Proxy checks?
	$query->bindParam(':address', $_SERVER['REMOTE_ADDR']);
	$query->bindParam(':eventtext', $message);
	$query->execute();
	return $query->rowCount() > 0;
}
?>
