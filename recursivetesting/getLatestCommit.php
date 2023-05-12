<?php 

	// Used to display errors on screen since PHP doesn't do that automatically.
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);

	// Include basic application services!
	include_once "../Shared/basic.php";
	include_once "../Shared/sessions.php";
	include_once "../recursivetesting/FetchGithubRepo.php";

	global $pdo;

	//getCourseID("https://github.com/c21sebar/test"); // Dummy Code to see if everything works

	//Get data from AJAX call in courseed.js and then runs the function getNewCourseGithub link
	if(isset($_POST['action'])) 
	{
		if($_POST['action'] == 'getCourseID') 
		{
			getCourseID($_POST['githubURL']);
		}
		else if($_POST['action'] == 'refreshGithubRepo') 
		{
			refreshGithubRepo($_POST['cid']);
		}
	};

	// --------------------- Fetch CID from MySQL with Github URL and fetch latest commit ----------------------------------------------
	// --------------------- This only happens when creating a new course --------------------------------------------------------------

	function getCourseID($githubURL) {
		// Connect to database and start session
		pdoConnect();
		session_start();


		echo "<h2> Outputs for creating a new course </h2>";
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
		$cid = "";
		foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
			echo "<p>Course ID: ".$row['cid']."</p>";
			$cid = $row['cid'];

			// TODO: Limit this to only one result
		}

		// Get the latest commit from the URL
		$latestCommit = getCommit($githubURL);
		print_r($latestCommit);

		// Check if not null, else add it to Sqlite db
		if($cid != null && $latestCommit != "") {
			insertIntoSQLite($githubURL, $cid, $latestCommit);
		} else if ($latestCommit == "") {
			print_r("Latest commit not valid");
		} else {
			print_r("No matches in database!");
		}
	}

	// --------------------- Insert into Sqlite db when new course is created ----------------------------------------------------------

	// Create a new row if it doesn't exist
	function insertIntoSQLite($url, $cid, $commit) {
		$pdolite = new PDO('sqlite:../../githubMetadata/metadata2.db');
		// Remove "or replace" later when everything works like it should
		$query = $pdolite->prepare("INSERT OR REPLACE INTO gitRepos (cid, repoURL, lastCommit) VALUES (:cid, :repoURL, :commits)"); 
		$query->bindParam(':cid', $cid);
		$query->bindParam(':repoURL', $url);
		$query->bindParam(':commits', $commit);
		$query->execute();
		if (!$query->execute()) {
			$error = $query->errorInfo();
			echo "Error updating file entries" . $error[2];
			$errorvar = $error[2];
			print_r($error);
			echo $errorvar;
		} else {
			bfs($url, $cid, "REFRESH");
		}
	}

	// --------------------- Update git repo in course ---------------------------------------------------------------------------------

	function refreshGithubRepo($cid){
		// Get old commit from Sqlite 
		$pdolite = new PDO('sqlite:../../githubMetadata/metadata2.db');
		$query = $pdolite->prepare('SELECT lastCommit, repoURL FROM gitRepos WHERE cid = :cid');
		$query->bindParam(':cid', $cid);
		$query->execute();

		$commmit = "";
		$url = "";
		foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
			$commit = $row['lastCommit'];
			$url = $row['repoURL'];
		}

		if($commit == "" || $url == "") {
			print_r("Error! Couldn't get url and commit from SQLite db");
		} else {
			// Get the latest commit from the URL, then print it
			$latestCommit = getCommit($url);

			// Compare old commit in db with the new one from the url
			if($latestCommit != $commit) {
				// Update the SQLite DB with the new commit
				$query = $pdolite->prepare('UPDATE gitRepos SET lastCommit = :latestCommit WHERE cid = :cid');
				$query->bindParam(':cid', $cid);
				$query->bindParam(':latestCommit', $latestCommit);
				$query->execute();

				bfs($url, $cid, "DOWNLOAD");
				//echo '<script>console.log(' .$url. '); </script>';
				print "The course has been updated!";
			} else {
				print "The course is already up to date!";
			}
		}
	}
	
	// --------------------- Get Latest Commit Function from URL------------------------------------------------------------------------

	function getCommit($url) {

		$html = file_get_contents($url);
		$dom = new DomDocument;
		$dom->preserveWhiteSpace = FALSE;
		
		// Because of how dom works with html, this is necessary to not fill the screen with errors - the page still prints
		libxml_use_internal_errors(true); 
		$dom->loadHTML($html);
		libxml_use_internal_errors(false);

		$href = "";
		$divs = $dom->getElementsByTagName('a');
		foreach ($divs as $div) {		
			if($div->getAttribute('class')=='d-none js-permalink-shortcut'){
				$value = $div->getAttribute("href");
				$href = $value;
			}
		}
	
		// Regex to only keep the commit numbers, instead of the entire URL
		$regex = "/^(.*?)\/tree\//";

		if($href != "") {
			$latestCommit = preg_replace($regex, "", $href);
			return $latestCommit;
		} else {
			print_r("No matches in database!");
		}
	}
?>