


 <?php


/*$url = "https://cms.webug.se/root/G2/students/a21jeaha/LenaSYS/Shared/logging.json";
$jsontext = file_get_contents($url);
$arr = json_decode($jsontext, true);

@ -34,10 +34,117 @@ $dateTime = $arr['dateTime'];
            }
            
        echo "</td>";
    echo "</tr>";
    echo "</tr>";*/

    
//---------------------------------------------------------------------------------------------------------------
// connect log database - Open log database
//---------------------------------------------------------------------------------------------------------------

    if(!file_exists ('../../log')) {
        if(!mkdir('../../log')){
            echo "Error creating folder: log";
            die;
        }
    }


//---------------------------------------------------------------------------------------------------------------
// IF MAKING CHANGES TO SQLite tables, increment this value!
//---------------------------------------------------------------------------------------------------------------
$dbVersion = 6;
//---------------------------------------------------------------------------------------------------------------

try {
	$log_db = new PDO('sqlite:../../log/loglena'.$dbVersion.'.db');
} catch (PDOException $e) {
	echo "Failed to connect to the database";
	throw $e;
}


$log_db->exec($sql);    




$query = $log_db->prepare( "SELECT * FROM serviceLogEntries;");
$query->bindParam(':id', $id);
$query->execute();

  while ($row = $query->fetch(PDO::FETCH_ASSOC)){
      $id=$row['id'];
      $uuid=$row['uuid'];
      $eventType=$row['eventType'];
      $service=$row['service'];
      $userid=$row['userid'];
      $timestamp=$row['timestamp'];
      $userAgent=$row['userAgent'];
      $operatingSystem=$row['operatingSystem'];
  }

  $row = $result -> fetch_assoc();
  printf("%s (%s)\n", $row["id"], $row["uuid"])
  
  $result -> free_result();

?>
