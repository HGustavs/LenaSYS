<?php
if (@include_once "../vendor/autoload.php") {
	if (class_exists('Minishlink\WebPush\WebPush') && defined('PUSH_NOTIFICATIONS_VAPID_PUBLIC_KEY') && defined('PUSH_NOTIFICATIONS_VAPID_PRIVATE_KEY') && defined('PUSH_NOTIFICATIONS_VAPID_EMAIL')) {
		// The two ifs above can't be combined into single if because the class does not exist directly after import, so a seperate php statement is needed

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

			$auth = array(
				'VAPID' => array(
					'subject' => 'mailto:'.PUSH_NOTIFICATIONS_VAPID_EMAIL,
					'publicKey' => PUSH_NOTIFICATIONS_VAPID_PUBLIC_KEY,
					'privateKey' => PUSH_NOTIFICATIONS_VAPID_PRIVATE_KEY,
				),
			);
			$webPush = new Minishlink\WebPush\WebPush($auth);
			// Increases speed of encryption a lot by making it slightly less secure
			// Man-in-the-middle attackers can now figure out the approximate length of a sent message but not the contents
			$webPush->setAutomaticPadding(false);
			
			$query = "SELECT * FROM user_push_registration WHERE uid = :uid AND daysOfUnsent < 10";
			$stmt = $pdo->prepare($query);
			$stmt->bindParam(':uid', $userId);

			if ($stmt->execute()) {
				$results = $stmt->fetchAll();
				foreach($results as $row) {
					$query = "UPDATE user_push_registration SET daysOfUnsent = daysOfUnsent + 1, lastSent = CURDATE() WHERE id = :id AND (lastSent <> CURDATE() OR lastSent IS NULL)";
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
	}
}
if (!function_exists('sendPushNotification')) {
	/**
	* Stub function for push notifications to notify admins that the system is not installed
	*/
	function sendPushNotification($userId, $message) {
		return("Error: Notifications subsystems not installed, notifications unavailable");
	}
}
?>
