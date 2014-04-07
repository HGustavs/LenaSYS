
<?php
$filename="canvas.txt";
$content = "This is our test file";
$length = strlen($content);
echo("creating file");
//if(file_exists($filename)==false){
$handle=fopen($filename,"w");
$write = fwrite($handle, $content, $length);
$close = fclose($handle);
echo("File Created, Click <a href='$filename'> Here </a> to view it.");
//}
?>
