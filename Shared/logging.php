<?php
$opt = $_POST["opt"]
$apara = $_POST["apara"]
$kind = $_POST["kind"]
$aparaType = $_POST["apara_type"]

echo $opt

$jsonData = [
    [
        "test1" => "123",
    ],
    [
        "test2" => "456",
    ]
];

$jsonString = json_encode($jsonData, JSON_PRETTY_PRINT);

$fp = fopen('logging.json', 'w');
fwrite($fp, $jsonString);
fclose($fp);

?>