<?php
	header("X-UA-Compatible: IE=edge,chrome=1");
	$content="password.html.php";
	$pagetitle="Change password";
	
	// echo "<pre>";
	// print_r($_POST);
	// echo "</pre>";
	
	//Passwordchangingcode
	if(isset($_POST['changePasswordSubmit'])){
		//////////////////////////
		$pdo = new PDO('mysql:dbname=quizsystem;host=localhost', 'lasse', 'webuser22Q'); //ADD NEW USER WITH LESS PRIVILEGES?
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
        //////////////////////////
		$queryString = "SELECT Student.ssn FROM Student WHERE Student.loginName=:LOGIN AND Student.passw=:PASSW;";

        $stmt = $pdo->prepare($queryString);
        $stmt->bindParam(':LOGIN', $_POST['loginName']);
        $oldPassword=md5($_POST['password']);
		$stmt->bindParam(':PASSW', $oldPassword);

        $stmt->execute();

        if ($stmt->rowCount() == 1) { //Old password correct
			$student=$stmt->fetch(PDO::FETCH_ASSOC);
			//Update password to new password
			$updateString = "UPDATE Student 
							SET Student.passw=:NEWPASSW
							WHERE Student.ssn=:SSN
								AND Student.loginName=:LOGIN;";
			$updateStmt = $pdo->prepare($updateString);
			$newPassword=md5($_POST['newPassword']);
			$updateStmt->bindParam(':NEWPASSW', $newPassword);
			$updateStmt->bindParam(':LOGIN', $_POST['loginName']);
			$updateStmt->bindParam(':SSN', $student['ssn']);
			$updateStmt->execute();
			if($updateStmt->execute()){
				$errorMsg="New password stored";
			} else {
				$errorMsg="ERROR: Failed to change password";
			}
		}
	}
	
	include $content;
?>
