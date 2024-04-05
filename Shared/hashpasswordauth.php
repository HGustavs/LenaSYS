<?php 
session_start();
include_once ("../Shared/database.php");
pdoConnect();
$password = $_POST['password'];
$hash = $_POST['hash'];
$_SESSION['hashpassword'] = $password;
function hashPassword($password, $hash){
	if($hash!='UNK'){
		global $pdo;
		$sql = "SELECT hash,password FROM userAnswer WHERE '" .$password. "' LIKE password AND '".$hash."' LIKE hash";
		$query = $pdo->prepare($sql);
		$query->execute();
		$count = $query->rowCount();
		if($count == 0){
			return false;
		} else{
			$_SESSION['pwdentrance'] = 1;
			return true;
		}
	}
}
$auth = hashPassword($password, $hash);	
echo json_encode(["auth" => $auth]);
?>