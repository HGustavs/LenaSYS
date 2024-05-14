<?php
error_reporting(E_ALL);
ini_set('display_errors','1'); 
/*// Start the session
session_start();

include_once "../../../../coursesyspw.php";
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";

// Connect to database
pdoConnect();

$query = $pdo->prepare("SELECT * FROM fileLink;");
$query->execute();

foreach ($pdo->query("DESCRIBE fileLink;")->fetchAll(PDO::FETCH_COLUMN) as $headdata) {
    echo $headdata."\n";
}*/

if (!isset($_POST["id"])) {
    echo "missing id";
}
$path = realpath($_POST["path"]);
// create and write to the file
echo $path."/diagram_".$_POST["id"].".".$_POST["extension"];
$file = fopen($path."diagram_".$_POST["id"].".".$_POST["extension"], "w");
file_put_contents($file, json_encode($_POST['diagram'])."\n");
fclose($file);
echo "file done";
// copies the file out of the repo and onto the server
// this is probably not a good solution but testing for now
/*
$source = "../../diagram/backend/diagram_".$_POST["id"].".".$_POST["extension"];
$destination = "../../diagram_".$_POST["id"].".".$_POST["extension"];
if (!copy($source, $destination)) {
    echo "error";
} else {    
    copy($source, $destination);
    echo "file copied";
}
*/
?>