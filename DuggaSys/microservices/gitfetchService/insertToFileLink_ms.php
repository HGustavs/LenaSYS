<?php

  include_once "../Shared/basic.php";
  include_once "../Shared/sessions.php";
  include_once "../../../DuggaSys/gitfetchService.php";

  function insertToFileLink($cid, $item) {
    global $pdo;
    $kindid = 3; // The kind(course local/version local/global), 3 = course local
    $query = $pdo->prepare("SELECT count(*) FROM fileLink WHERE cid=:cid AND filename=:filename AND kind=:kindid AND path=:filePath;"); 
    // bind query results into local vars.
    $query->bindParam(':filename', $item['name']);
    $query->bindParam(':cid', $cid);
    $query->bindParam(':filePath', $item['path']);
    $query->bindParam(':kindid', $kindid);
    $query->execute();
    // creates SQL strings for inserts into filelink database table. Different if-blocks determine the visible scope of the file. Runs if the file doesn't exist in the DB.
    if ($query->fetchColumn() == 0) {      
      $query = $pdo->prepare("INSERT INTO fileLink(filename, path, kind,cid,filesize) VALUES(:filename, :filePath, :kindid,:cid,:filesize)");
      $query->bindParam(':cid', $cid);
      $query->bindParam(':filename', $item['name']);
      $query->bindParam(':filePath', $item['path']);
      $query->bindParam(':filesize', $item['size']);
      $query->bindParam(':kindid', $kindid);
      // Runs SQL query and runs general error handling if it fails.
      if (!$query->execute()) {
        $error = $query->errorInfo();
        echo "Error updating file entries" . $error[2];
        // $errortype ="uploadfile";
        $errorvar = $error[2];
        print_r($error);
        echo $errorvar;
      } 
    }
  }
?>