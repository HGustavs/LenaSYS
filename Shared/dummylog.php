


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

$sql = '
	CREATE TABLE IF NOT EXISTS logEntries (
		id INTEGER PRIMARY KEY,
		eventType INTEGER,
		description TEXT,
		timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
		userAgent TEXT
	);
	CREATE TABLE IF NOT EXISTS userLogEntries (
		id INTEGER PRIMARY KEY,
		uid INTEGER(10),
		username VARCHAR(15),
		eventType INTEGER,
		description VARCHAR(50),
		timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
		userAgent TEXT,
		remoteAddress VARCHAR(15)
	);
	CREATE TABLE IF NOT EXISTS serviceLogEntries (
		id INTEGER PRIMARY KEY,
		uuid CHAR(15),
		eventType INTEGER,
		service VARCHAR(15),
		userid VARCHAR(8),
		timestamp INTEGER,
		userAgent TEXT,
		operatingSystem VARCHAR(100),
		info TEXT,
		referer TEXT,
		IP TEXT,
		browser VARCHAR(100)
	);
	CREATE TABLE IF NOT EXISTS exampleLoadLogEntries(
		id INTEGER PRIMARY KEY,
		type INTEGER,
		courseid INTEGER,
		uid INTEGER(10),
		username VARCHAR(15),
		exampleid INTEGER,
		timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
	);
	CREATE TABLE IF NOT EXISTS duggaLoadLogEntries(
		id INTEGER PRIMARY KEY,
		type INTEGER,
		cid INTEGER,
		uid INTEGER(10),
		username VARCHAR(15),
		vers INTEGER,
		quizid INTEGER,
		timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
	);
	CREATE TABLE IF NOT EXISTS userHistory (
		refer TEXT,
		userid INTEGER(10),
		username VARCHAR(50),
		IP TEXT,
		URLParams VARCHAR(255),
		timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
	);
';
$log_db->exec($sql);    




/*$query = $pdo->prepare( "SELECT id, uuid,eventType,service,userid,timestamp,userAgent,operatingSystem FROM serviceLogEntries WHERE id = :id;");
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
  
  $result -> free_result();*/

?>
