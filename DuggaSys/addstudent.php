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
		<input type="submit" value="Lägg till student"/>
		<a href="students.php"><input type="button" value="Cancel"/></a>
	</form>

<?php	if(isset($_POST['string'])){
			$pdo = new PDO('mysql:dbname=Imperious;host=localhost', 'root', '');
			$pdo->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING );

			function random_password( $length = 8 ) {
			    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-=+;:,.?";
			    $password = substr( str_shuffle( $chars ), 0, $length );
			    return $password;
			}

			$str = $_POST['string'];

			$row=explode("\r\n", $str);
			foreach ($row as $row1) {
				list($ssn, $name, $username)=(explode("\t",$row1));
				list($lastname, $firstname)=(explode(", ",$name));
				$password = random_password(8);

				$querystring='INSERT INTO user (username, firstname, lastname, ssn, password, newpassword) VALUES(:username,:firstname,:lastname,:ssn,:password, 1);';	
				$stmt = $pdo->prepare($querystring);
				$stmt->bindParam(':username', $username);
				$stmt->bindParam(':firstname', $firstname);
				$stmt->bindParam(':lastname', $lastname);
				$stmt->bindParam(':ssn', $ssn);
				$stmt->bindParam(':password', $password);
				try {
					$stmt->execute();
					echo "<script type='text/javascript'>alert('Användare är tillagd')</script>";
					echo $password;
				} catch (PDOException $e) {
					if ($e->getCode()=="23000") {
					echo "Användare finns redan";
					}
				}
			}
	}
		?>
</div>
</div>

</body>
</html>