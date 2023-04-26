<?php

$post_data = array(
    'value1' => "Test",
    'value2' => "Test"
);

$url = 'test.php';
$curl = curl_init($url);

curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_POSTFIELDS, $post_data);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($curl);

echo $response;

curl_close($curl);
