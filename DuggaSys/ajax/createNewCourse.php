<?php 
session_start(); 

$array = array(
    "name" => $_POST["coursename"],
    "code" => $_POST["coursecode"],
    "visi" => $_POST["visib"],
);

echo json_encode($array);
?>

