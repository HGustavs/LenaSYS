<?php
if (!isset($_POST["id"])) {
    echo "missing id";
}
// create and write to the file
$file = fopen("diagram_".$_POST["id"].".".$_POST["extension"], "w") or die("failed");
fwrite($file, json_encode($_POST['diagram'])."\n");
fclose($file);

?>