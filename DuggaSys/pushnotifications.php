<?php


include_once "../../vendor/autoload.php";
use Minishlink\WebPush\WebPush;

session_start();
include_once "../../coursesyspw.php";
include_once "../Shared/sessions.php";
pdoConnect();

if (isset($_POST['action']) && $_POST['action'] == "pushsuccess") {
	$query = "UPDATE user_push_registration SET daysOfUnsent = 0 WHERE endpoint = :endpoint";
	$stmt = $pdo->prepare($query);
	$stmt->bindParam(':endpoint', $_POST['endpoint']);
	$stmt->execute();
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
			$registration = $results[0];
			$query = "UPDATE user_push_registration SET keyAuth = :keyAuth, keyValue = :keyValue, daysOfUnsent = 0 WHERE id = :id";
			$stmt = $pdo->prepare($query);
			$stmt->bindParam(':id', $registration['id']);
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
} else if (isset($_POST['action']) && $_POST['action'] == "send") {

	$auth = array(
		'VAPID' => array(
			'subject' => 'mailto:c14caran@student.his.se',
			'publicKey' => PUSH_NOTIFICATIONS_VAPID_PUBLIC_KEY,
			'privateKey' => PUSH_NOTIFICATIONS_VAPID_PRIVATE_KEY
		),
	);
	$webPush = new WebPush($auth);
	// Increases speed of encryption a lot by making it slightly less secure
	// Man-in-the-middle attackers can now figure out the approximate length of a sent message but not the contents
	$webPush->setAutomaticPadding(false);
	
	$query = "SELECT * FROM user_push_registration WHERE uid = :uid AND daysOfUnsent < 10";
	$stmt = $pdo->prepare($query);
	$stmt->bindParam(':uid', $_POST['user']);

	if ($stmt->execute()) {
		$results = $stmt->fetchAll();
		foreach($results as $row) {
			$query = "UPDATE user_push_registration SET daysOfUnsent = daysOfUnsent + 1, lastSent = CURDATE() WHERE id = :id AND lastSent <> CURDATE()";
			$stmt = $pdo->prepare($query);
			$stmt->bindParam(':id', $row['id']);
			$stmt->execute();

			$webPush->sendNotification(
				$row['endpoint'],
				"This is a test message from PHP",
				$row['keyValue'],
				$row['keyAuth']
			);
		}
		$pushResults = $webPush->flush();

		// Stop sending messages to clients no longer registered
		// Works for mozilla push (firefox), not tested for firebase (chrome)
		if (is_array($pushResults)) {
			foreach($pushResults as $result) {
				if (isset($result['statusCode']) && ($result['statusCode'] == 410 || $result['statusCode'] == 404) && isset($result['endpoint'])) {
					$query = "UPDATE user_push_registration SET daysOfUnsent = 99 WHERE endpoint = :endpoint";
					$stmt = $pdo->prepare($query);
					$stmt->bindParam(':endpoint', $result['endpoint']);
					$stmt->execute();
				}
			}
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
	message:<br>
	<input type="text" name="message"><br><br>
	<input type="submit" value="Submit">
</form>

<?php
}
?>