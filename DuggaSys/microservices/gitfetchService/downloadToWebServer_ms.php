<?php
  include_once "../../../Shared/sessions.php";
  include_once "../../../Shared/basic.php";    
  include_once "../../DuggaSys/gitfetchService.php";
  session_start();
  pdoConnect();

  function downloadToWebServer($cid, $item) 
  {
    // Retrieves the contents of each individual file based on the fetched "download_url"
    $fileContents = file_get_contents($item['download_url']);
    // If unable to get file contents then it is logged into the specified textfile
    if ($fileContents === false) {
      $message = "\n" . date("Y-m-d H:i:s",time()) . " - Error: Failed to get file contents of " . $item['name'] . " from " . $item['download_url'] . "\n";
      $file = '../../LenaSYS/log/gitErrorLog.txt';
      error_log($message, 3, $file);
    }
    $path = '../../LenaSYS/courses/'. $cid . '/' . "Github" .'/' . $item['path'];
    // Creates the directory for each individual file based on the fetched "path"
    if (!file_exists((dirname($path)))) {
      mkdir(dirname($path), 0777, true);
    } 

    $content = file_put_contents($path, $fileContents);
    // If unable to get file contents then it is logged into the specified textfile
    if ($content === false) {
      $message = "\n" . date("Y-m-d H:i:s",time()) . " - Error: Failed to put " . $item['name'] . " in " . $path . "\n";
      $file = '../../LenaSYS/log/gitErrorLog.txt';
      error_log($message, 3, $file);
    }
  }

?>