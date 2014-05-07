<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
			<link type="text/css" href="css/style.css" rel="stylesheet">
		<script type="text/javascript" src="duggasys.js"></script>
	</head>
<body>
	<header>
		<nav id="navigate">
			<img src="css/svg/Up.svg">
			<img onclick="menuDugga()" src="css/svg/SkipB.svg">
		</nav>
		<nav id="user">
			Emil & Martina
			<img src="css/svg/Man.svg">
		</nav>
	</header>
	<div id="content">
		<div id="student-box">
	<form action="" method="post">
		<div id="student-header">Lägg till student!</div>
		<br>
		<br>
		<textarea placeholder="SSN, Name, email" name="string" id="string" cols="30"></textarea>
		<br>
		<input type="button" value="Lägg till student" onclick="javascript:passPopUp('show');"/>
		<a href="students.php"><input type="button" value="Cancel"/></a>
	</form>

		<div id="light" class="white_content"></div>
		<div id="fade" class="black_overlay" onclick="javascript:passPopUp('show');"></div>

<?php	
		include_once "../Shared/external/password.php";
		include_once("../../coursesyspw.php");	
		include_once("basic.php");
		pdoConnect();

if(isset($_POST['string'])){

			function random_password( $length = 12 ) {
			    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-=+;:,.?<>/";
			    $password1 = substr( str_shuffle( $chars ), 0, $length );
			    return $password1;
			}

			$str = $_POST['string'];

			$row=explode("\r\n", $str);
			$myFile = "testFile.txt";
			$fh = fopen($myFile, 'w') or die("can't open file");
			foreach ($row as $row1) {
				list($ssn, $name, $username1)=(explode("\t",$row1));
				list($lastname, $firstname)=(explode(", ",$name));
				list($username, $grabage)=(explode("@",$username1));

				
				$stmt = $pdo->prepare("SELECT * FROM user WHERE username='$username'");
				$stmt->execute(array($username));

				if ( $stmt->rowCount() <= 0 ) {
				
					$password1 = random_password(12);
					fwrite($fh, $name);
					fwrite($fh, "\t\t");
					fwrite($fh, $username);
					fwrite($fh, "\t\t");
					fwrite($fh, $password1);
					fwrite($fh, "\n");

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
						echo "<script type='text/javascript'>alert('Användare är tillagd globalt')</script>";
					} catch (PDOException $e) {
						if ($e->getCode()=="23000") {
							echo "Användare finns redan globalt";
						}
					}
				}

				
				foreach($pdo->query( "SELECT * FROM user WHERE username='$username'" ) as $row){
					$userid = $row['uid'];
					$querystring='INSERT INTO user_course (uid, cid, access) VALUES(:uid, 1, "R");';	
					$stmt = $pdo->prepare($querystring);
					$stmt->bindParam(':uid', $userid);
					try {
						$stmt->execute();
						echo "<script type='text/javascript'>alert('Användare är tillagd på kursen')</script>";
					} catch (PDOException $e) {
						if ($e->getCode()=="23000") {
						echo "Användare finns redan på kursen";
						}
					}
				}
			}
				fclose($fh);
		}
		?>
</div>
</div>

</body>
</html>