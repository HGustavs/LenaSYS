<?php 

	// Used to display errors on screen since PHP doesn't do that automatically.
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);

	//Get data from AJAX call in courseed.js and then runs the function getNewCourseGithub link
	if(isset($_POST['action'])) 
	{
		if($_POST['action'] == 'getCourseID') 
		{
			getCourseID($_POST['githubURL']);
		}
	};

	function getCourseID($githubURL) {
		$query = $pdo->query('SELECT cid FROM course WHERE githubURL = :githubURL');
		$query->bindParam(':githubURL', $githubURL);
		$query->execute();
		print_r($query);
	}

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

	/*
function saveIntoLatestCommit ($url) {
        $pdo = new PDO('sqlite:../../githubMetadata/metadata2.db');

        $query = $pdo->prepare('INSERT INTO latestCommit (githubURL) VALUES (:githubURL)');
        $query->bindParam(':githubURL', $url);
        $query->execute();
    }

saveIntoLatestCommit($githubURL); // Sends URL to insert into a table without the translation */
?>
