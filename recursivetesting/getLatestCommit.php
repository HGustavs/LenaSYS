<?php 

	// Used to display errors on screen since PHP doesn't do that automatically.
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);

	

	// Include basic application services!
	include_once "../Shared/basic.php";
	include_once "../Shared/sessions.php";

	// Connect to database and start session
	pdoConnect();
	session_start();

	//Get data from AJAX call in courseed.js and then runs the function getNewCourseGithub link
	if(isset($_POST['action'])) 
	{
		if($_POST['action'] == 'getCourseID') 
		{
			getCourseID($_POST['githubURL']);
		}
	};

	//getCourseID("https://github.com/HGustavs/DiagrammingSYS");

	function getCourseID($githubURL) {

		echo "<table>";
		// translates the url to the same structure as in mysql
		// the "/" needs to be "&#47;" for the query to work
		$newURL = str_replace("/", "&#47;", $githubURL);
		print_r($newURL);

		// fetching from the database
		global $pdo;
		$query = $pdo->prepare('SELECT cid FROM course WHERE courseGitURL = :githubURL;');
		$query->bindParam(':githubURL', $newURL);
		$query->execute();

		// printing the result
		foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
			echo "<td>".$row['cid']."</td>";
			$cid = $row['cid'];
		}

		echo "</table>";

		// checkSQLite($cid, $githubURL);
		// use the original url to get the latest commit
		getCommit($githubURL);
	}

	// function checkSQLite($cid, $githubURL) {
		// global $pdo; // we need this? kolla olles kod senare kanske
		
		// $pdolite = new PDO('sqlite:../../githubMetadata/metadata2.db');
		
		// $query = $pdolite->prepare("SELECT count(*) FROM latestCommit WHERE cid=:cid;"); 
        // // bind query results into local vars.
        // $query->bindParam(':cid', $cid);
        // $query->execute();
        // $norows = $query->fetchColumn();

		//TODO: get commit
		// save as variable

		// if($norows == 0) {
			// insert into sqllite
		// }
		// else {
			// compare commit from db with commit variable from above
			// update sqllite

			/*
			 // creates SQL strings for inserts into filelink database table. Different if-blocks determine the visible scope of the file. Runs if the file doesn't exist in the DB.
			if ($norows == 0) {
				$query = $pdo->prepare("INSERT INTO fileLink(filename,kind,cid,filesize) VALUES(:filename,:kindid,:cid,:filesize)");
				$query->bindParam(':cid', $cid);
				$query->bindParam(':filename', $fileText);
				$query->bindParam(':filesize', $filesize);
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
			*/
		// }
	// }

	// gets the latest commit from the url in the function above
	function getCommit($url) {
		//$url = "https://github.com/HGustavs/LenaSYS"; // TODO: This url should be the one you fetch from the database!

		$html = file_get_contents($url);
		$dom = new DomDocument;
		$dom->preserveWhiteSpace = FALSE;
		
		// Because of how dom works with html, this is necessary to not fill the screen with errors - the page still prints
		libxml_use_internal_errors(true); 
		$dom->loadHTML($html);
		libxml_use_internal_errors(false);

		/* TODO: This regex could be improved to take the explicit name of the user and repo,
		* for example "/HGustavs/LenaSYS/commit/..."
		* instead of just taking "/.../.../commit/...". */
		$regex = "/^(.*?)\/commit\//";
		
		$links = $dom->getElementsByTagName('a');

		foreach ($links as $link) {
			$value = $link->getAttribute("href");
			if(preg_match($regex, $value)) {
				$href = $value; // Takes the first matching value and stores it in an array
				break; //exits the loop since only the first match is necessary
			}
		}

		$latestCommit = preg_replace($regex, "", $href);
		print_r($latestCommit); // TODO: This is where we could store the value in the db, or similar
	}


	//$pdo = new PDO('sqlite:../../githubMetadata/metadata2.db');

	/*
function saveIntoLatestCommit ($url) {
        $pdo = new PDO('sqlite:../../githubMetadata/metadata2.db');

        $query = $pdo->prepare('INSERT INTO latestCommit (githubURL) VALUES (:githubURL)');
        $query->bindParam(':githubURL', $url);
        $query->execute();
    }

saveIntoLatestCommit($githubURL); // Sends URL to insert into a table without the translation */
?>
