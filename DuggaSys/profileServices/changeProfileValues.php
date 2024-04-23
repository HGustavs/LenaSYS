<?php

date_default_timezone_set("Europe/Stockholm");

include_once "../Shared/basic.php";
include_once "../Shared/sessions.php";
include_once "database.php"; // Include database connection file

function updateSecurityQuestion($userid, $question, $answer) {
    pdoConnect(); // Connect to the database
    $querystring = "UPDATE user SET securityquestion = :question, securityquestionanswer = :answer WHERE uid = :userid";
    $stmt = $pdo->prepare($querystring);
    $stmt->bindParam(':question', $question);
    $stmt->bindParam(':answer', $answer);
    $stmt->bindParam(':userid', $userid);
    return $stmt->execute();
}

function updatePassword($userid, $newPassword) {
    pdoConnect(); // Connect to the database
    $hashedPassword = standardPasswordHash($newPassword);
    $querystring = "UPDATE user SET password = :password WHERE uid = :userid";
    $stmt = $pdo->prepare($querystring);
    $stmt->bindParam(':password', $hashedPassword);
    $stmt->bindParam(':userid', $userid);
    return $stmt->execute();
}

function getUserInfo($userid) {
    pdoConnect();
    $userInfo = array();

    $querystring = "SELECT * FROM selectFromTableUser WHERE uid = :userid";
    $stmt = $pdo->prepare($querystring);
    $stmt->bindParam(':userid', $userid);

    if ($stmt->execute()) {
        $userInfo = $stmt->fetch(PDO::FETCH_ASSOC);
    } else {
        $error = $stmt->errorInfo();
        $userInfo['error'] = "Error fetching user information: " . $error[2];
    }

    return $userInfo;
}

function isSuperUser($userid) {
    pdoConnect();
    $isSuperUser = false;

    $querystring = "SELECT * FROM selectFromTableUser WHERE uid = :userid AND super_user = 1";
    $stmt = $pdo->prepare($querystring);
    $stmt->bindParam(':userid', $userid);

    if ($stmt->execute()) {
        if ($stmt->rowCount() > 0) {
            $isSuperUser = true;
        }
    } else {
        $error = $stmt->errorInfo();
        $isSuperUser = "Error checking super user status: " . $error[2];
    }

    return $isSuperUser;
}

function logServiceEvent($log_uuid, $event_type, $file, $userid, $info) {
    pdoConnect();
    $querystring = "INSERT INTO log_table (log_uuid, event_type, file, userid, info) VALUES (:log_uuid, :event_type, :file, :userid, :info)";
    $stmt = $pdo->prepare($querystring);
    $stmt->bindParam(':log_uuid', $log_uuid);
    $stmt->bindParam(':event_type', $event_type);
    $stmt->bindParam(':file', $file);
    $stmt->bindParam(':userid', $userid);
    $stmt->bindParam(':info', $info);

    if (!$stmt->execute()) {
        $error = $stmt->errorInfo();
        echo "Error logging service event: " . $error[2];
    }
}

function changeProfileValues($userid, $password, $question, $answer, $action, $newPassword) {
    pdoConnect();
    $success = false;
    $status = "";
    $debug = "NONE!";
    $log_uuid = ''; // Add logic to generate log UUID

    logServiceEvent($log_uuid, EventTypes::ServiceServerStart, __FILE__, $userid, $info);

    if (checklogin()) {
        if (!isSuperUser($userid)) {
            // Fetch the password from the database
            $querystring = "SELECT password FROM selectFromTableUser WHERE uid=:userid LIMIT 1";    
            $stmt = $pdo->prepare($querystring);
            $stmt->bindParam(':userid', $userid);

            if(!$stmt->execute()) {
                $error = $stmt->errorInfo(); 
                $debug = "Error finding user " . $error[2];
            } else {
                $result = $stmt->fetch(PDO::FETCH_OBJ);

                // Check that the password matches
                if(password_verify($password, $result->password)) {
                    // Query that selects the user row if it is a superuser or a teacher
                    $accessString = "SELECT access FROM selectFromTableUser_course WHERE uid=:userid AND access='W' LIMIT 1";
                    $query = $pdo->prepare($accessString);
                    $query->bindParam(':userid', $userid);

                    if(!$query->execute()) {
                        $error = $stmt->errorInfo();
                        $debug = "Error checking if user is teacher " . $error[2];
                    } else {
                        if($query->rowCount() > 0) {
                            // If a row matches query, the user is a teacher/superuser and cannot change password/security questions
                            $status = "teacher";
                        } else {
                            // Action determines which form is being used
                            if($action == "challenge"){
                                    // Update challenge question
                                    updateSecurityQuestion($userid, $question, $answer);
                            } else if($action == "password"){
                                // Update password
                                updatePassword($userid, $newPassword);
                            }
                        }
                    }
                    $success = true;
                } else {
                    $status = "wrongpassword";
                }
            }
        } else {
            $status = "teacher";
        }
    }
    logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, __FILE__, $userid, $info);

    echo json_encode(array(
        "success" => $success,
        "status" => $status,
        "debug" => $debug
    ));
}

// Call the main function with provided parameters
changeProfileValues($userid, $password, $question, $answer, $action, $newPassword);
?>
