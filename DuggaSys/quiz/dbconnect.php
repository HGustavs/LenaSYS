<?php
	//DB connection
	$pdo = new PDO('mysql:dbname=quizsystem;host=localhost', 'root', 'sibirisklingonsaft');
	//Set PDO to display errors
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);//, PDO::MYSQL_ATTR_USE_BUFFERED_QUERY );
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
?>
