<?php
if (!isset($_POST["id"])) {
    echo "missing id";
}
// create and write to the file
$file = fopen("diagram_".$_POST["id"].".".$_POST["extension"], "w") or die("failed");
fwrite($file, json_encode($_POST['diagram'])."\n");
fclose($file);

// copies the file out of the repo and onto the server
// this is probably not a good solution but testing for now
$source = "var/www/html/LenaSYS/DuggaSys/diagram/backend/diagram_".$_POST["id"].".".$_POST["extension"];
$destination = "home/ubuntu/saved_diagrams/diagram_".$_POST["id"].".".$_POST["extension"];
if (!copy($source, $destination)) {
    echo "error";
} else {    
    echo "file copied";
}
?>