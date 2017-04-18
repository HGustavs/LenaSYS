<?php
include_once "../../vendor/autoload.php";
use Minishlink\WebPush\WebPush;
include_once "../Shared/sessions.php";

/**
 * Sends a push notification to the specified user
 * This will take 0.5 - 5 seconds depending on the number of connected devices
 * Don't use more than once per pageview
 * When php is upgraded to >= 7.1, it should be faster
 * @param int $userId User ID of the user to send to
 * @param string $message Message to send to the user
 * @return true if send was successful, debug string if not
 */
function sendPushNotification($userId, $message) {
	global $pdo;

	if($pdo == null) {
		pdoConnect();
	}

	if (!defined('PUSH_NOTIFICATIONS_VAPID_PUBLIC_KEY') || !defined('PUSH_NOTIFICATIONS_VAPID_PRIVATE_KEY')) {
		return("Error: Push notifications not configured");
	}

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
	$stmt->bindParam(':uid', $userId);

	if ($stmt->execute()) {
		$results = $stmt->fetchAll();
		foreach($results as $row) {
			$query = "UPDATE user_push_registration SET daysOfUnsent = daysOfUnsent + 1, lastSent = CURDATE() WHERE id = :id AND lastSent <> CURDATE()";
			$stmt = $pdo->prepare($query);
			$stmt->bindParam(':id', $row['id']);
			$stmt->execute();

			$webPush->sendNotification(
				$row['endpoint'],
				$message,
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
		return true;
	} else {
		return print_r($stmt->errorInfo(), true);
	}
}
?>
