<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>My Website</title>
    <link rel="stylesheet" href="./style.css">
    <link rel="icon" href="./favicon.ico" type="image/x-icon">
  </head>
  <body>
    <main>
        <h1>Welcome to My Website</h1>  
  

<?php

//include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";
include_once "../recursivetesting/FetchGithubRepo.php";

// Connect to database and start session
pdoConnect();
//session_start();

$dirname = "..&#47;courses&#47;1895&#47;Github&#47;Demo&#47;Code-example1&#47";
$query = $pdo->prepare("SELECT COUNT(*) FROM codeexample WHERE cid=:cid AND examplename=:examplename;");
					$query->bindParam(":cid", $courseid);
					$query->bindParam(":examplename",$dirname); // $parts[count($parts)-1]
					$query->exectue();

					$result = $query->fetch(PDO::FETCH_OBJ);
					$counted = $result->counted;

                    echo "counted: " + $counted;
?> 

    </main>
	<script src="index.js"></script>
  </body>
</html>