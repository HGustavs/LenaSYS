<?php
session_start();
include_once dirname(__FILE__) . "/../../Shared/external/password.php";
include_once(dirname(__FILE__) . "/../../Shared/basic.php");
pdoConnect();
function random_password( $length = 12 ) {
	$chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-=+;:,.?/";
	$password1 = substr( str_shuffle( $chars ), 0, $length );
	return $password1;
}

// Make sure the user exists before proceeding
$user_id = $_POST['user_id'];
$stmt = $pdo->prepare("SELECT * FROM user WHERE uid=:uid");
$stmt->bindParam(':uid', $user_id);

// If it does, gather some more information
if($stmt->execute() && $stmt->rowCount() > 0){
	$result = $stmt->fetch();
	$username = $result['username'];
	$firstname = $result['firstname'];
	$lastname = $result['lastname'];

} else {
	echo "false";
}

$userinfo = array();
if(isset($_POST['user_id'])){

	// Generate a new password and hash it.
	$password1 = random_password();
    $password = password_hash($password1, PASSWORD_BCRYPT, array("cost" => 12));

	$user_id = $_POST['user_id'];

	// Update the user in the database
	$stmt = $pdo->prepare("UPDATE user SET `password`=:newpass, `newpassword`=1 WHERE uid=:uid");
	$stmt->bindParam(':newpass', $password);
	$stmt->bindParam(':uid', $user_id);

	if($stmt->execute()){
		$array = array(
			'pw'=>$password1,
			'username'=>$username,
			'firstname'=>$firstname,
			'lastname'=>$lastname
		);
		echo json_encode($array);
	}else {
		echo "false";
	}
}
?>
