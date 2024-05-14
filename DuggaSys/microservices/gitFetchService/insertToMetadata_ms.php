<?php

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";

//--------------------------------------------------------------------------------------------------
// // Inserts data into metadata2.db (the table gitFiles).
//--------------------------------------------------------------------------------------------------
function insertToMetaData($cid, $item) 
{
    session_start();
    pdoConnect();
    global $pdoLite;
    $query = $pdoLite->prepare('INSERT INTO gitFiles (cid, fileName, fileType, fileURL, downloadURL, fileSHA, filePath) VALUES (:cid, :fileName, :fileType, :fileURL, :downloadURL, :fileSHA, :filePath)');
    $query->bindParam(':cid', $cid);
    $query->bindParam(':fileName', $item['name']);
    $query->bindParam(':fileType', $item['type']);
    $query->bindParam(':fileURL', $item['url']);
    $query->bindParam(':downloadURL', $item['download_url']);
    $query->bindParam(':fileSHA', $item['sha']);
    $query->bindParam(':filePath', $item['path']);
    $query->execute();
}