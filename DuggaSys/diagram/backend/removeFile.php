<?php
$id;
if (!isset($_POST["id"])) {
    $id = $_POST["id"];
}
unlink("diagram".$_POST["id"].".".$_POST["extension"]);
echo "file deleted";
?>