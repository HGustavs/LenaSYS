<?php

//---------------------------------------------------------------------------------------------------------------
// Handles password changes when logged in. Click on profile and then change password.
//---------------------------------------------------------------------------------------------------------------

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "../curlService.php";

// Connect to database and start session
pdoConnect();
session_start();

$userData = callMicroserviceGET("./getUid_ms.php");
$userid = $userData['uid'] ?? 'guest';

$password= getOP('password');
$action = getOP('action');
$newPassword = getOP('newPassword');
$hashedPassword = standardPasswordHash($newPassword);

$success = false;
$status = "";
$debug = "NONE!";

// Create arguments for log
$log_uuid = getOP('log_uuid'); // Cookie id or something.. 
$info="action: ".$action." userid: ".$userid;

// Log the start event of this service query. This is logged in log.db (not MySQL)
logServiceEvent($log_uuid, EventTypes::ServiceServerStart, __FILE__, $userid, $info);

// Check if the user is logged in and block access if it is a super user
if(checklogin()) {
	if (isSuperUser($userid)) {
		$status = "teacher";
	} else if ($action === "password") {
		// and fetch the password from the db
		$querystring="SELECT password FROM user WHERE uid=:userid LIMIT 1";	
		$stmt = $pdo->prepare($querystring);
		$stmt->bindParam(':userid', $userid);
		
		if(!$stmt->execute()) {
			$error = $stmt->errorInfo(); 
			$debug = "Error finding user ".$error[2];
		} else {
			$result = $stmt->fetch(PDO::FETCH_OBJ);
			
			// Check that the password matches
			if(password_verify($password, $result->password)) {
				//Query that selects the user row if it is a superuser or a teacher
				$accessString = "SELECT access FROM user_course WHERE uid=:userid AND access='W' LIMIT 1";
				$query = $pdo->prepare($accessString);
				$query->bindParam('userid', $userid);
				
				if(!$query->execute()) {
					$error = $stmt->errorInfo();
					$debug = "Error checking if user is teacher ".$error[2];
				} else {
					if($query->rowCount() > 0) {
						//If a row matches query, the user is a teacher/superuser and cannot change password/security questions
						$status = "teacher";
					} else {
						if($action == "password"){
							//Update password
							$passwordquery = "UPDATE user SET password=:PW WHERE uid=:userid";
							$stmt = $pdo->prepare($passwordquery);
							$stmt->bindParam(':userid', $userid);
							$stmt->bindParam(':PW', $hashedPassword);

							if(!$stmt->execute()) {
								$error=$stmt->errorInfo(); 
							} else {
								$success = true;
							}
						}
					}
				}
			} else {
				$status = "wrongpassword";
			}
		}
	}
}

echo json_encode(array(
	"success" => $success,
	"status" => $status,
	"debug" => $debug
));

// Log the end event of this service query.
logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, __FILE__, $userid, $info);

