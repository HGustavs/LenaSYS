<?php

$postParameter = array(
    'value1' => 'test',
    'value2' => 'test'
);

$curl = curl_init('https://cms.webug.se/root/G2/students/c21alest/LenaSYS/Shared/test.php');
curl_setopt($curl, CURLOPT_POSTFIELDS, $postParameter);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$curlResponse = curl_exec($curl);
curl_close($curl);

echo $curlResponse;

?>
