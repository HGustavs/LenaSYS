<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
// This microservice is used to retrieve a username from a specific userid (uid) 

include_once "./getUid_ms.php";
include_once "../../../Shared/basic.php"; // Provides access to $pdo and checklogin()

pdoConnect(); // ← For initialize $pdo

header('Content-Type: application/json'); // Important for JSON standard

date_default_timezone_set("Europe/Stockholm");

$userid = getUid();  // Retrieves logged in user's UID (from session or token)

$username = "unknown";

if (checklogin() === true) {
    $query = $pdo->prepare("SELECT username FROM user WHERE uid = :uid");
    $query->bindParam(':uid', $userid);
    $query->execute();

    $row = $query->fetch(PDO::FETCH_ASSOC);
    if ($row && isset($row['username'])) {
        $username = $row['username'];
    }
}

echo json_encode(['username' => $username]);  // Sends back as JSON
