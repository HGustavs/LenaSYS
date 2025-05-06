<?php
include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";

pdoConnect();
session_start();

// Get values from GET/POST
$hash = getOP('hash');
$AUtoken = getOP('AUtoken');

// Update active_users in groupdugga
$query = $pdo->prepare("SELECT active_users FROM groupdugga WHERE hash=:hash");
$query->bindParam(':hash', $hash);
$query->execute();
$result = $query->fetch();
$active = $result['active_users'];

if ($active === null) {
    $query = $pdo->prepare("INSERT INTO groupdugga(hash,active_users) VALUES(:hash,:AUtoken);");
    $query->bindParam(':hash', $hash);
    $query->bindParam(':AUtoken', $AUtoken);
    $query->execute();
} else {
    $newToken = (int)$active + (int)$AUtoken;
    $query = $pdo->prepare("UPDATE groupdugga SET active_users=:AUtoken WHERE hash=:hash;");
    $query->bindParam(':hash', $hash);
    $query->bindParam(':AUtoken', $newToken);
    $query->execute();
}

// Call the microservice instead of using include
$baseURL = "http://" . $_SERVER['HTTP_HOST'];
$url = $baseURL . "/LenaSYS/DuggaSys/microservices/showDuggaService/retrieveShowDuggaService_ms.php";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);

// Send only the minimum required parameters
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'hash' => $hash,
    'moment' => getOP('moment')
]));

$response = curl_exec($ch);
curl_close($ch);

// Output the JSON response from the microservice
header("Content-Type: application/json");
echo $response;
