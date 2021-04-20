<?php 
include_once ("../Shared/database.php");
pdoConnect();
$password = $_POST['password'];
$hash = $_POST['hash'];

function hashPassword($password, $hash){
	if($hash!='UNK'){
		global $pdo;
		$sql = "SELECT hash,password FROM useranswer WHERE '" .$password. "' LIKE password AND '".$hash."' LIKE hash";
		$query = $pdo->prepare($sql);
		$query->execute();
		$count = $query->rowCount();
		if($count == 0){
			return false;
		} else{
			return true;
		}
	}
}

$auth = hashPassword($password, $hash);	
echo json_encode(["auth" => $auth]);

?>