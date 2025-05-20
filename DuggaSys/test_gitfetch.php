<?php
$url = "http://localhost/LenaSYS/DuggaSys/gitfetchService.php";

$data = [
    'cid' => 1902,
    'githubURL' => 'https://github.com/LenaSYS/Webbprogrammering-Examples'
];

$ch = curl_init($url);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
curl_setopt($ch, CURLOPT_POST, true);

$response = curl_exec($ch);
$err = curl_error($ch);
curl_close($ch);

if ($err) {
    echo "Curl error: " . $err;
} else {
    echo $response;
}
