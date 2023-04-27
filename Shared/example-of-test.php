<?php

include_once "../Shared/test.php";

$testData = array(
    'value1' => 'test',
    'value2' => 'test',
    'user' => 'brom',
    'pwd' => 'password',
    'service' => 'https://cms.webug.se/root/G2/students/c21alest/LenaSYS/DuggaSys/courseedservice.php',
    'serviceData' => serialize(array(
        'opt' => 'NEW',
        'username' => 'brom',
        'password' => 'password',
    )),
    'test1Debug' => false,
    'test2Debug' => true,
    'test3Debug' => true,
);

testHandler($testData);

// $curl = curl_init('https://cms.webug.se/root/G2/students/c21alest/LenaSYS/Shared/test.php');
// curl_setopt($curl, CURLOPT_POSTFIELDS, $postParameter);
// curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

// $curlResponse = curl_exec($curl);
// curl_close($curl);

// echo $curlResponse;

//setcookie("loginname", "brom", time() + (86400 * 30), "/");
//setcookie("username", "brom", time() + (86400 * 30), "/");
//setcookie("password", "password", time() + (86400 * 30), "/");

?>
