<?php

session_start();
include_once "../../coursesyspw.php";
include_once "../Shared/sessions.php";
pdoConnect();

if(checklogin()) {
	if (isset($_POST['action']) && $_POST['action'] == "register") {
		$query = "SELECT * FROM user_push_registration WHERE uid = :uid AND endpoint = :endpoint";
		$stmt = $pdo->prepare($query);
		$stmt->bindParam(':uid', $_SESSION['uid']);
		$stmt->bindParam(':endpoint', $_POST['subscription']['endpoint']);
		if (!$stmt->execute()) {
			print_r($stmt->errorInfo());
			exit();
		}
		$results = $stmt->fetchAll();

		if (count($results) == 1) {
			$registration = $results[0];
			// Update registration if needed
		} else {
			// Add the push registration to the database
			$query = "INSERT INTO user_push_registration(uid, endpoint) VALUES (:uid, :endpoint)";	
			$stmt = $pdo->prepare($query);
			$stmt->bindParam(':uid', $_SESSION['uid']);
			$stmt->bindParam(':endpoint', $_POST['subscription']['endpoint']);
			//$stmt->bindParam(':keyAuth', $_POST['subscription']['keys']['auth']);
			//$stmt->bindParam(':keyValue', $_POST['subscription']['keys']['p256dh']);
			if(!$stmt->execute()) {
				$error = $stmt->errorInfo();
				print_r($error);
			}
		}
	} else if (isset($_POST['action']) && $_POST['action'] == "send") {
		
		$query = "SELECT * FROM user_push_registration WHERE uid = :uid";
		$stmt = $pdo->prepare($query);
		$stmt->bindParam(':uid', $_POST['user']);

		if ($stmt->execute()) {
			$results = $stmt->fetchAll();
			foreach($results as $row) {
				$arrContextOptions = array(
					"ssl" => array(
						"verify_peer" => false,
						"verify_peer_name" => false
					),
					"http" => array(
						"method" => "POST"
					)
				);
				
				$response = file_get_contents($row['endpoint'], false, stream_context_create($arrContextOptions));
				print_r($response);
			}
		} else {
			$error = $stmt->errorInfo();
			print_r($error);
		}

	} else if (isset($_GET['action']) && $_GET['action'] == "form") {
	?>

<p>Send a message to a registered client</p>
<form action="pushnotifications.php" method="post">
	<input type="hidden" name="action" value="send">
	user:<br>
	<input type="text" name="user"><br><br>
	<input type="submit" value="Submit">
</form>

	<?php
	}
}
?>