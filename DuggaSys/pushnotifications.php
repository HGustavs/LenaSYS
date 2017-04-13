<?php
session_start();
include_once "../../coursesyspw.php";
include_once "../Shared/sessions.php";
pdoConnect();

if (isset($_POST['action']) && $_POST['action'] == "pushsuccess") {
	$query = "UPDATE user_push_registration SET daysOfUnsent = 0 WHERE endpoint = :endpoint";
	$stmt = $pdo->prepare($query);
	$stmt->bindParam(':endpoint', $_POST['endpoint']);
	$stmt->execute();
} else if (isset($_POST['action']) && $_POST['action'] == "deregister") {
	if (checklogin()) {
		$query = "UPDATE user_push_registration SET daysOfUnsent = 99 WHERE endpoint = :endpoint";
		$stmt = $pdo->prepare($query);
		$stmt->bindParam(':endpoint', $_POST['subscription']['endpoint']);
		$stmt->execute();
	}
} else if (isset($_POST['action']) && $_POST['action'] == "register") {
	if(checklogin()) {
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
			$query = "UPDATE user_push_registration SET keyAuth = :keyAuth, keyValue = :keyValue, daysOfUnsent = 0 WHERE id = :id";
			$stmt = $pdo->prepare($query);
			$stmt->bindParam(':id', $results[0]['id']);
			$stmt->bindParam(':keyAuth', $_POST['subscription']['keys']['auth']);
			$stmt->bindParam(':keyValue', $_POST['subscription']['keys']['p256dh']);
			if(!$stmt->execute()) {
				$error = $stmt->errorInfo();
				print_r($error);
			}
		} else {
			// Add the push registration to the database
			$query = "INSERT INTO user_push_registration(uid, endpoint, keyAuth, keyValue) VALUES (:uid, :endpoint, :keyAuth, :keyValue)";	
			$stmt = $pdo->prepare($query);
			$stmt->bindParam(':uid', $_SESSION['uid']);
			$stmt->bindParam(':endpoint', $_POST['subscription']['endpoint']);
			$stmt->bindParam(':keyAuth', $_POST['subscription']['keys']['auth']);
			$stmt->bindParam(':keyValue', $_POST['subscription']['keys']['p256dh']);
			if(!$stmt->execute()) {
				$error = $stmt->errorInfo();
				print_r($error);
			}
		}
	}
} else if (checklogin() && isSuperUser($_SESSION['uid'])) {
	if (isset($_POST['action']) && $_POST['action'] == "send") {
		include_once "../Shared/pushnotificationshelper.php";
		echo sendPushNotification($_POST['user'], $_POST['message']);
	} else {
		?>

		<p>Send a message to a registered client</p>
		<form action="pushnotifications.php" method="post">
			<input type="hidden" name="action" value="send">
			user:<br>
			<input type="text" name="user"><br><br>
			message:<br>
			<input type="text" name="message"><br><br>
			<input type="submit" value="Submit">
		</form>

		<?php
	}
}
?>
