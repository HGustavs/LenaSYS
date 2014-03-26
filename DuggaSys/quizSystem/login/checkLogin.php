<?php

function checkLogin() {
    $userName = "";
    $userPassword = "";
    if ((isset($_POST['userNameInput']) && isset($_POST['passwordInput']))) {
        $userName = $_POST['userNameInput'];
        $userPassword = $_POST['passwordInput'];
    } else if (isset($_SESSION['userName']) && isset($_SESSION['userPassword'])) {
        $userName = $_SESSION['userName'];
        $userPassword = $_SESSION['userPassword'];
    }

    if ($userName != "" && $userPassword != "") {
	   // $pdo = new PDO('mysql:dbname=dsystem;host=wwwlab.iki.his.se', 'dbsk', 'Tomten2009');
       // $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
		include "dbconnect.php";
        //$querystring = "CALL checklogin(:USERNAME, :PASSWORD);";
		$queryString = "SELECT * FROM QSystemUser WHERE QSystemUser.userName=:USERNAME;";
        $stmt = $pdo->prepare($queryString);
        $stmt->bindParam(':USERNAME', $userName);
		// $encryptedUserPassword=crypt($userPassword);
        // $stmt->bindParam(':PASSWORD', $encryptedUserPassword);
		
        $stmt->execute();

        if ($stmt->rowCount() == 1) {
			$userData=$stmt->fetch(PDO::FETCH_ASSOC);		
            if(crypt($userPassword,$userData['passw'])==$userData['passw']){
				$_SESSION['userName'] = $userData['userName'];
                $_SESSION['userPassword'] = $userPassword;
                $_SESSION['userType'] = $userData['userType'];
			/*foreach ($stmt->fetchAll() as $row) {
                $_SESSION['userName'] = $row['userName'];
                $_SESSION['userPassword'] = $userPassword;
                $_SESSION['userType'] = $row['userType'];
            }*/
            return true;
			}
        }
    }

    return false;
}

?>