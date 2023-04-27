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

	getCourseID("https://github.com/c21sebar/test"); // Dummy Code to see if everything works

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
		$cid = "";
		foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
			echo "<p>Course ID: ".$row['cid']."</p>";
			$cid = $row['cid'];

			// TODO: Limit this to only one result
		}

		// Get the latest commit from the URL, then print it
		$latestCommit = getCommit($githubURL);
		print_r("First: ".$latestCommit);
		// sleep(5);
		// $latestCommit = getCommit($githubURL);
		// print_r("Second: ".$latestCommit);
		// sleep(10);
		// $latestCommit = getCommit($githubURL);
		// print_r("Third: ".$latestCommit);
		// The commit doesn't always work, try to get it up to 10 times	
		// for($counter = 0; $counter < 10; $counter++) {
		// 	if($latestCommit == "") {
		// 		$latestCommit = getCommit($githubURL);
		// 		print_r($latestCommit); // TODO: This is where we could store the value in the db, or similar
		// 	} else {
		// 		break;
		// 	}
		// }

		if($cid != null && $latestCommit != "") {
			insertIntoSQLite($githubURL, $cid, $latestCommit);
		} else if ($latestCommit == "") {
			print_r("Latest commit not valid");
		} else {
			print_r("No matches in database!");
		}
	}

	// --------------------- Insert into Sqlite db when new course is created -------------------------------

	// Create a new row if it doesn't exist
	function insertIntoSQLite($url, $cid, $commit) {
		$pdolite = new PDO('sqlite:../../githubMetadata/metadata2.db');
		// Remove "or replace" later when everything works like it should
		$query = $pdolite->prepare("INSERT INTO gitRepos (cid, repoURL, lastCommit) VALUES (:cid, :repoURL, :commits)"); 
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
		} 
		getCommitSqlite($cid); //testing !!!!!!! don't forget to remove!
	}
	//---------------------------------------When pressing refresh button: -------------------------------------------------------------

	


	// --------------------- Get Latest Commit Function from URL-----------------------------------------

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
		$regex = "/^(.*?)\/tree\//";

		// $divs = $dom->getElementsByClassName('Box');
		// foreach ($divs as $div) {
		// 	 if($div->nodeName == 'a'){
		// 		$link = $div->getAttribute('href');
		// 		echo print_r($link->nodeValue);
		// 	 }
		// }

		$divs = $dom->getElementsByTagName('div');
		foreach ($divs as $div) {
			echo "hej";
			if($div->attribute('class')=='Box'){
				echo "Attribute '".$div;
			}
		}

			// $classname = 'js-permalink-shortcut';
		// $xpath = new DOMXpath($dom);
		// $elements = $xpath->query("*/a[@class='box']");

		// foreach($elements as $element) {
		// 	$value = $element->getAttribute("href");
		// 	echo "Value is: ".$value;
		// }

		// if (!is_null($elements)) {
		// 	foreach ($elements as $element) {
		// 		echo "hej";
		// 		echo "<br/>[". $element->nodeName. "]";
		
		// 		$nodes = $element->childNodes;
		// 		foreach ($nodes as $node) {
		// 			echo "hejdå";
		// 			echo $node->nodeValue. "\n";
		// 		}
		// 	}
		// }


			//$nodes = $xpath->query('//div[@class="' . $classname . '"]');
			
		
			// $tmp_dom = new DOMDocument();
			// foreach ($nodes as $node) {
			// 	$tmp_dom->appendChild($tmp_dom->importNode($node, true));
			// }
		
			// return trim($tmp_dom->saveHTML());
	
		//--------------------------------------------------------------------------------------------
		
		// $links = $dom->getElementsByClassName('js-permalink-shortcut');

		// $href = "";
		// foreach ($links as $link) {
		// 	$value = $link->getAttribute("href");
		
			// if(preg_match($regex, $value)) {
		//$href = $value; // Takes the first matching value and stores it in an array
			// 	echo $value;
			// 	//break; //exits the loop since only the first match is necessary
			// }
		//}

		// if($href != "") {
		// 	$latestCommit = preg_replace($regex, "", $href);
		// 	return $latestCommit;
		// } else {
		// 	//print_r("No matches in database!");
		// }
	}

	// --------------------- Get Latest Commit from Sqlite-----------------------------------------

	function getCommitSqlite($cid){
		$pdolite = new PDO('sqlite:../../githubMetadata/metadata2.db');
		$query = $pdolite->prepare('SELECT lastCommit, repoURL FROM gitRepos WHERE cid = :cid');
		$query->bindParam(':cid', $cid);
		$query->execute();

		$commmit = "";
		$url = "";
		foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
			echo "<p>Commit from select: ".$row['lastCommit']."</p>";
			echo "<p>URL from select: ".$row['repoURL']."</p>";
			$commit = $row['lastCommit'];
			$url = $row['repoURL'];
		}

		if($commit == "" || $url == "") {
			print_r("Error! Couldn't get url and commit from SQLite db");
		} else {
			// Get the latest commit from the URL, then print it
			$latestCommit = getCommit();
			print_r($latestCommit);
			sleep(2);
			print_r("Again: ".$latestCommit);
		}
		



		// The commit doesn't always work, try to get it up to 10 times	
		// for($counter = 0; $counter < 10; $counter++) {
		// 	if($latestCommit == "") {
		// 		$latestCommit = getCommit($githubURL);
		// 		print_r($latestCommit); // TODO: This is where we could store the value in the db, or similar
		// 	} else {
		// 		break;
		// 	}
		// }


	}


?>