<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
// This microservice is used to retrieve a username from a specific userid (uid) 

include_once "../curlService.php";
include_once "../../../Shared/basic.php"; // Ger tillgång till $pdo och checklogin()

pdoConnect(); // ← För initialize $pdo

header('Content-Type: application/json'); // Viktigt för JSON-standard

date_default_timezone_set("Europe/Stockholm");

$userid = callMicroserviceGET("./getUid_ms.php");  // Hämtar inloggad användares UID (från session eller token)

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

echo json_encode(['username' => $username]);  // Skickar tillbaka som JSON
