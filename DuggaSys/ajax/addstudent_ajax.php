<?php 
session_start();
include_once dirname(__FILE__) . "/../../Shared/external/password.php";
include_once(dirname(__FILE__) . "/../../Shared/basic.php");
pdoConnect();

if(checklogin() && (hasAccess($_SESSION['uid'], $_POST['courseid'], 'W') || isSuperUser($_SESSION['uid']))) {
	$array=array();

	if(array_key_exists('string', $_POST) && !empty($_POST['string'])){

		function random_password( $length = 12 ) {
			$chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-=+;:,.?/";
			$password1 = substr( str_shuffle( $chars ), 0, $length );
			return $password1;
		}
		$courseid = $_POST['courseid'];
		$coursename = getCourseName($courseid);
		$str = $_POST['string'];

		$row=explode("\n", $str);
		foreach ($row as $row1) {
			$ssn = "";
			$name = "";
			$username1 = "";

			// Split on whitespace.
			$components = preg_split('/[\s]+/', $row1);

			// If there's 3 or more components (it will be 4 in most cases)
			// then continue with extracting data.
			if(count($components) >= 3) {
				$ssn = array_shift($components);
				$username1 = array_pop($components);
				$name = trim(implode(' ', $components));
			} else {
				// If there's not enough data to work with on this row, continue to the
				// next one.
				continue;
			}

			// Assemble this into more useful bits.
			list($lastname, $firstname)=(explode(", ",$name));
			list($username, $garbage)=(explode("@",$username1));


			// Find out if there's already a user by this name.
			$userquery = $pdo->prepare("SELECT uid,username FROM user WHERE username=:username");
			$userquery->bindParam(':username', $username);

			// If there isn't we'll register a new user and give them a randomly
			// assigned password which can be printed later.
			if ($userquery->execute() && $userquery->rowCount() <= 0 && !empty($username)) {
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
					$array1=array($username,$lastname . ", " . $firstname,$password1);
					$array[]=$array1;
					log_message($_SESSION['uid'], EVENT_NOTICE, sprintf('Added user %s to the system', $username));
				} catch (PDOException $e) { }
			}

			// Regardless whether or not we added a new user we'll want to add them to
			// the course.
			if($userquery->execute() && $userquery->rowCount() > 0) {
				// Find out some information about the user that we'll use to add it to
				// the database.
				$user = $userquery->fetch(PDO::FETCH_ASSOC);
				$userid = $user['uid'];

				$stmt = $pdo->prepare("INSERT INTO user_course (uid, cid, access) VALUES(:uid, :cid,'R')");
				$stmt->bindParam(':uid', $userid);
				$stmt->bindParam(':cid', $courseid);

				// Insert the user into the database.
				try {
					$stmt->execute();
					log_message($_SESSION['uid'], 'notice', 
						sprintf('Added user %s to the course %s', $user['username'], $coursename));
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
}
?>
