<?php 
	// Used to display errors on screen since PHP doesn't do that automatically.
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);

	$url = "https://github.com/HGustavs/LenaSYS"; // TODO: This url should be the one you fetch from the database!

  $urlParts = explode('/', $url);
  // In normal GitHub Repo URL:s, the repo is the fourth object separated by a slash
  $repository = $urlParts[4]; // Use the $repository variable to insert into "repoName"

	print_r($username);
	print_r($repository);

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
?>