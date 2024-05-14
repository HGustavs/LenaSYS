<?php
$id;
if (!isset($_POST["id"])) {
    $id = $_POST["id"];
}
unlink($_POST["path"]."diagram_".$_POST["id"].".".$_POST["extension"]);
echo "file deleted";
?>