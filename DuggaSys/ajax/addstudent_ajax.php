<?php 
		include_once dirname(__FILE__) . "/../../Shared/external/password.php";
		include_once(dirname(__FILE__) . "/../../Shared/basic.php");
		pdoConnect();

		$array=array();
		
		if(isset($_POST['string'])){
         
			function random_password( $length = 12 ) {
			    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-=+;:,.?/";
			    $password1 = substr( str_shuffle( $chars ), 0, $length );
			    return $password1;
			}
            $courseid = $_POST['courseid'];
			$str = $_POST['string'];

			$row=explode("\n", $str);
			foreach ($row as $row1) {
				list($ssn, $name, $username1)=(explode("\t",$row1));
				list($lastname, $firstname)=(explode(", ",$name));
				list($username, $grabage)=(explode("@",$username1));

				
				$userquery = $pdo->prepare("SELECT * FROM user WHERE username=:username");
				$userquery->bindParam(':username', $username);

				if ($userquery->execute() && $userquery->rowCount() <= 0) {
				
					$password1 = random_password(12);
					$password = password_hash($password1, PASSWORD_BCRYPT, array("cost" => 12));

					$querystring='INSERT INTO user (username, firstname, lastname, ssn, password, newpassword) VALUES(:username,:firstname,:lastname,:ssn,:password, 1);';	
					$stmt = $pdo->prepare($querystring);
					$stmt->bindParam(':username', $username);
					$stmt->bindParam(':firstname', $firstname);
					$stmt->bindParam(':lastname', $lastname);
					$stmt->bindParam(':ssn', $ssn);
					$stmt->bindParam(':password', $password);
					try {
						$stmt->execute();
						//echo "<script type='text/javascript'>alert('Användare är tillagd globalt')</script>";
						$array1=array($username,$name,$password1);
						$array[]=$array1;
					} catch (PDOException $e) {
						if ($e->getCode()=="23000") {
						//	echo "Användare finns redan globalt";
						}
					}
				}

				
				if($userquery->execute() && $userquery->rowCount() > 0) {
					$user = $userquery->fetch(PDO::FETCH_ASSOC);
					$userid = $user['uid'];
					$useraccess = $user['username'];
					if (preg_match("/[0-9]+/", $useraccess)){
						$access='R';
					}
					else {
						$access='W';
					}
					$querystring='INSERT INTO user_course (uid, cid, access) VALUES(:uid, :cid,:access);';	
					$stmt = $pdo->prepare($querystring);
					$stmt->bindParam(':uid', $userid);
					$stmt->bindParam(':cid', $courseid);
					$stmt->bindParam(':access', $access);

					try {
						$stmt->execute();
						//echo "<script type='text/javascript'>alert('Användare är tillagd på kursen')</script>";
					} catch (PDOException $e) {
						if ($e->getCode()=="23000") {
						//echo "Användare finns redan på kursen";
						}
					}
				}
			}
			echo json_encode($array);
		}
	?>
