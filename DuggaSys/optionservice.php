<?php 
date_default_timezone_set("Europe/Stockholm");
// Include basic application services!
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";
// Connect to database and start session
pdoConnect();
session_start();

$label = getOP('label');
$value = getOP('value');
$getOption = getOP('getOption');
$editDbSetting = getOP('editDbSetting');
$db_user = getOP('db_user');
$db_password = getOP('db_password');
$db_host = getOP('db_host');
$db_name = getOP('db_name');

$debug="NONE!";	

//------------------------------------------------------------------------------------------------
// Services
//------------------------------------------------------------------------------------------------
if(isset($_SESSION['uid']) && checklogin() && isSuperUser($_SESSION['uid'])){
	if(isset($label)){
		$query = $pdo->prepare("UPDATE options SET value = :value WHERE label = :label");
		$query->bindParam(':value', $value);
		$query->bindParam(':label', $label);
		$query->execute();
		echo json_encode(array('success' => true));
	}
} else {
	die('access denied');
}

if(isset($getOption)){
	if(isset($_SESSION['uid']) && checklogin() && isSuperUser($_SESSION['uid'])){
		$query = $pdo->prepare("SELECT value FROM options WHERE label = :getOption");
		$query->bindParam(':getOption', $getOption);
		$query->execute();
		echo $query->fetch(PDO::FETCH_ASSOC);
	} else {
		die('access denied');
	}
}

if(isset($editDbSetting){
	if(isset($_SESSION['uid']) && checklogin() && isSuperUser($_SESSION['uid'])){
		$connection = false;
		//Create test connection to the new db.		
		
		
		
		if($connection == true){
			$myfile = fopen("../Shared/coursesyspw.php", "w");

			fwrite($myfile, '<?php');

			fwrite($myfile, PHP_EOL . 'define("DB_USER","'. $db_user .'");');
			fwrite($myfile, PHP_EOL . 'define("DB_PASSWORD","'. $db_password.'");');
			fwrite($myfile, PHP_EOL . 'define("DB_HOST","'. $db_host.'");');
			fwrite($myfile, PHP_EOL . 'define("DB_NAME","'. $db_name.'");');

			fwrite($myfile, PHP_EOL . '?>');
			fclose($myfile);
		}
	}
}
?>