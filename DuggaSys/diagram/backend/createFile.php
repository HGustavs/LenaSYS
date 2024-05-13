<?php
//echo print_r($_POST);
$file = fopen("diagram.json", "w") or die("failed");
fwrite($file, json_encode($_POST)."\n");
fclose($file);
echo "file created";
?>