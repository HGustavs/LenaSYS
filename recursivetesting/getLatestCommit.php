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

	global $pdo;
	$pdolite = new PDO('sqlite:../../githubMetadata/metadata2.db');

	getCourseID("https://github.com/HGustavs/saraTest"); // Dummy Code to see if everything works

	// --------------------- Fetch CID from MySQL with Github URL and fetch latest commit -------------------------------
	// --------------------- This only happens when creating a new course -----------------------------------------------

	function getCourseID($githubURL) {

		echo "<p>Original URL: ".$githubURL."</p>";
		// translates the url to the same structure as in mysql
		// the "/" needs to be "&#47;" for the query to work
		$newURL = str_replace("/", "&#47;", $githubURL);

		// fetching from the database
		global $pdo;
		$query = $pdo->prepare('SELECT cid FROM course WHERE courseGitURL = :githubURL;');
		$query->bindParam(':githubURL', $newURL);
		$query->execute();

		// printing the result
		foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
			echo "<p>Course ID: ".$row['cid']."</p>";
			$cid = $row['cid'];

			// TODO: Limit this to only one result
		}

		// Get the latest commit from the URL, then print it
		$latestCommit = getCommit($githubURL);
		print_r($latestCommit);

		// The commit doesn't always work, try to get it up to 10 times	
		for($counter = 0; $counter < 10; $counter++) {
			if($latestCommit == "") {
				$latestCommit = getCommit($githubURL);
				print_r($latestCommit); // TODO: This is where we could store the value in the db, or similar
			} else {
				break;
			}
		}
		insertIntoSQLite($githubURL, $cid, $latestCommit);
	}

	// --------------------- Insert into SQL Lite db when new course is created -------------------------------

	// Create a new row if it doesn't exist
	function insertIntoSQLite($url, $cid, $commit) {
		$query = $pdolite->prepare("INSERT INTO gitRepos (cid, repoURL, lastCommit) VALUES (:cid, :repoURL, :commits);"); 
		$query->bindParam(':cid', $cid);
		$query->bindParam(':repoURL', $repoURL);
		$query->bindParam(':commits', $commit);
		$query->execute();
		if (!$query->execute()) {
			$error = $query->errorInfo();
			echo "Error updating file entries" . $error[2];
			$errorvar = $error[2];
			print_r($error);
			echo $errorvar;
		} 
		$testquery = $pdolite->prepare('SELECT * FROM gitRepos');
		$testquery->execute();
		$norows = $testquery->fetchColumn();

		print_r($norows);
	}

	// --------------------- Get Latest Commit Function -----------------------------------------

	function getCommit($url) {

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

		$href = "";
		foreach ($links as $link) {
			$value = $link->getAttribute("href");
			if(preg_match($regex, $value)) {
				$href = $value; // Takes the first matching value and stores it in an array
				break; //exits the loop since only the first match is necessary
			}
		}

		if($href != "") {
			$latestCommit = preg_replace($regex, "", $href);
			return $latestCommit;
		} else {
			//print_r("No matches in database!");
		}
	}
?>