<?php
  $result = array();

  foreach(glob('../pages/*.*') as $filename){
	$file = basename($filename);
    array_push($result, $file);
  }
  
  print(json_encode($result));

?>