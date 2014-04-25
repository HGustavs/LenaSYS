<?php

if(empty($_FILES['file'])){

	header('Content-type: text/plain');
	echo "No file selected, try again";
	return;

}
//Hämtar namnet på den bilden som försöks flyttas ($file_temp) och hämtar den nya platsen för bilden.
$file_temp = $_FILES["file"]["tmp_name"];
$newloc = "template/" . $_FILES["file"]["name"];

//Flyttar filen ($file) till den nya platsen ($newloc)
move_uploaded_file($file_temp, $newloc);

	header('Location: index.php'); 



?>