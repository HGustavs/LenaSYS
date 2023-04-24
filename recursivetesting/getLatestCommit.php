<?php 

	// Used to display errors on screen since PHP doesn't do that automatically.
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);

	// --------------------- Fetch CID from MySQL with Github URL -------------------------------

	// Include basic application services!
	include_once "../Shared/basic.php";
	include_once "../Shared/sessions.php";

	// Connect to database and start session
	pdoConnect();
	session_start();

	getCourseID("https://github.com/HGustavs/DiagrammingSYS"); // Dummy Code to see if everything works

	function getCourseID($githubURL) {

		echo "<p>Original URL: ".$githubURL."</p>";
		// translates the url to the same structure as in mysql
		// the "/" needs to be "&#47;" for the query to work
		$newURL = str_replace("/", "&#47;", $githubURL);
		echo "<p>Updated URL: ".$newURL."</p>";

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

		// use the original url to get the latest commit
		getCommit($githubURL);
	}

	// --------------------- Get Latest Commit Function -----------------------------------------


	function getCommit($url) {

		echo "<p>URL Test: ".$url."</p>";

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

			print_r($link);

			$value = $link->getAttribute("href");

			echo "<p>Value: ".$value."</p>";

			if(preg_match($regex, $value)) {
				$href = $value; // Takes the first matching value and stores it in an array
				break; //exits the loop since only the first match is necessary
			}
		}

		echo "<p>Href: ".$href."</p>";

		if($href != "") {
			$latestCommit = preg_replace($regex, "", $href);
			print_r($latestCommit); // TODO: This is where we could store the value in the db, or similar
		} else {
			print_r("No matches in database!");
		}
	}
?>