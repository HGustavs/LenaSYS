
<?php
$filename="canvas.xml";
$content = $_POST['string'];
$length = strlen($content);

//if(file_exists($filename)==false){
$handle=fopen($filename,"w");
$write = fwrite($handle, $content, $length);
$close = fclose($handle);

//}
?>
