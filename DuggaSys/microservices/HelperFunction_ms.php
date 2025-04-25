<?php




<!-- POST METHOD  -->

<!-- Calling Function -->
function callPost(string $path, array $dataToSend, bool $returnValue) {
    header("Content-Type: application/json");
    //set url course path
    $baseURL = "https://" . $_SERVER['HTTP_HOST'] . "/LenaSYS/DuggaSys/microservices/";
    $url = $baseURL . $path;
    $ch = curl_init($url);
    //options for curl
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, $returnValue);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($dataToSend));

    curl_exec($ch);
    curl_close($ch);
}


<!-- Recieving Function -->

function recievePost(array $requiredKeys = []) {
    $receivedData = [];

    foreach ($requiredKeys as $key) {
        if (!isset($_POST[$key])) {
            echo json_encode(["error" => "Missing required POST parameter: $key"]);
            exit;
        }
        $receivedData[$key] = $_POST[$key];
    }

    return $receivedData;
}
?>
