<?php 
	// -------------==============######## Setup ###########==============-------------

	// Variables for the refresh button, deadlines specified in seconds
	$shortdeadline = 300; // 300 = 5 minutes
	$longdeadline = 600; // 600 = 10 minutes

	// Used to display errors on screen since PHP doesn't do that automatically.
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);

	// Include basic application services!
	include_once "../Shared/basic.php";
	include_once "../Shared/sessions.php";
	include_once "./gitfetchService.php";

	global $pdo;

	//Get data from AJAX call in courseed.js and then runs the function getCourseID, refreshGithubRepo or updateGithubRepo depending on the action
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
		else if($_POST['action'] == 'updateGithubRepo') 
		{
			updateGithubRepo($_POST['githubURL'], $_POST['cid']);
		}
		else if($_POST['action'] == 'directInsert'){
			
			insertIntoSQLite($_POST['githubURL'], $_POST['cid'], $_POST['token'],);
		}
	};

	// -------------==============######## Creating New Course ###########==============-------------

	//--------------------------------------------------------------------------------------------------
	// getCourseID: Fetch the course ID from MySQL with Github URL, then fetch the latest commit from the repo
	//--------------------------------------------------------------------------------------------------

	function putInLog($message){
		$file = '../../LenaSYS/log/gitErrorLog.txt';
		error_log($message, 3, $file);
	}

	function getCourseID($githubURL) {
		// Connect to database and start session
		pdoConnect();
		session_start();

		// Translates the url to the same structure as in mysql
		// The "/" needs to be "&#47;" for the query to work
		$newURL = str_replace("/", "&#47;", $githubURL);

		// Fetching from the database
		global $pdo;
		$query = $pdo->prepare('SELECT cid FROM course WHERE courseGitURL = :githubURL;');
		$query->bindParam(':githubURL', $newURL);
		$query->execute();

		$cid = "";
		foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
			$cid = $row['cid'];
			// TODO: Limit this to only one result
		}

		// Check if not null, else add it to Sqlite db
		if($cid != null) {
			insertIntoSQLite($githubURL, $cid, "");
		} else {
			print_r("No matches in database!");
		}
	}

	//--------------------------------------------------------------------------------------------------
	// insertIntoSQLite: Insert into Sqlite db when new course is created
	//--------------------------------------------------------------------------------------------------

	function insertIntoSQLite($url, $cid, $token) { 
		if(strlen($token)<1)
		{
			$token=fetchOldToken($cid);
		}
		$pdolite = new PDO('sqlite:../../githubMetadata/metadata2.db');

		//If url is null or empty
		if($url == "" || $token == "") {
			$query = $pdolite->prepare("INSERT OR REPLACE INTO gitRepos (cid,repoName, repoURL, lastCommit, gitToken) VALUES (:cid, :repoName, :repoURL, :lastCommit, :gitToken )"); 
			$query->bindParam(':cid', $cid);
			$query->bindParam(':repoName', $repoName);
			$query->bindParam(':repoURL', $url);
			$query->bindParam(':lastCommit', $lastCommit);
			$query->bindParam(':gitToken', $token);
			
			if (!$query->execute()) {
				$error = $query->errorInfo();
				echo "Error updating file entries" . $error[2];
				$errorvar = $error[2];
				print_r($error);
				echo $errorvar;
			}
		}
		else{
			$pdolite = new PDO('sqlite:../../githubMetadata/metadata2.db');
			$lastCommit = bfs($url, $cid, "GETCOMMIT");
			print_r($lastCommit);	
			// Splits the url into different parts for every "/" there is
			$urlParting = explode('/', $url);
			// The 4th part contains the name of the repo, which is accessed by [4]
			$repoName = $urlParting[4];
			$query = $pdolite->prepare("INSERT OR REPLACE INTO gitRepos (cid,repoName, repoURL, lastCommit, gitToken) VALUES (:cid, :repoName, :repoURL, :lastCommit, :gitToken )"); 
			$query->bindParam(':cid', $cid);
			$query->bindParam(':repoName', $repoName);
			$query->bindParam(':repoURL', $url);
			$query->bindParam(':lastCommit', $lastCommit);
			$query->bindParam(':gitToken', $token);
			
			if (!$query->execute()) {
				$error = $query->errorInfo();
				echo "Error updating file entries" . $error[2];
				$errorvar = $error[2];
				print_r($error);
				echo $errorvar;
			} else {
				bfs($url, $cid, "DOWNLOAD");
			}
		}
	}

	function fetchOldToken($cid) 
	{

		$pdolite = new PDO('sqlite:../../githubMetadata/metadata2.db');
		
		$query = $pdolite->prepare('SELECT gitToken FROM gitRepos WHERE cid=:cid');
		$query->bindParam(':cid', $cid);
		$query->execute();


		$old_token="";
		foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
			$old_token = $row['gitToken'];
		}

		if(strlen($old_token)>1)
		{
			return $old_token;
		}
		else
		{
			return null;
		}
	}

	// -------------==============######## Refresh Github Repo in Course ###########==============-------------

	//--------------------------------------------------------------------------------------------------
	// refreshCheck: Decided how often the data can be updated, and if it can be updated again
	//--------------------------------------------------------------------------------------------------

	function refreshCheck($cid, $user) {
		global $shortdeadline, $longdeadline;
		// Connect to database and start session
		pdoConnect();
		session_start();

		// Fetching the latest update of the course from the MySQL database
		global $pdo;
		$query = $pdo->prepare('SELECT updated FROM course WHERE cid = :cid;');
		$query->bindParam(':cid', $cid);
		$query->execute();

		// Save the result in a variable
		$updated = "";
		foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
			$updated = $row['updated'];
		}


		$currentTime = time(); // Get the current time as a Unix timestamp
		$updateTime = strtotime($updated); // Format the update-time as Unix timestamp

		$_SESSION["updatetGitReposCooldown"][$cid]=$updateTime;
		

		$_SESSION["lastFetchTime"] = date("Y-m-d H:i:s", $currentTime);
		$fethCooldown = $longdeadline - (time() - $updateTime);
		if($fethCooldown<0){
			$_SESSION["fetchCooldown"]=0;
		}else{
			$_SESSION["fetchCooldown"]=$fethCooldown;
		}
		// Check if the user has superuser priviliges
		if($user == 1) { // 1 = superuser
			if(($currentTime - $_SESSION["updatetGitReposCooldown"][$cid]) < $shortdeadline) { // If they to, use the short deadline
				
				print "Too soon since last update, please wait.";
				return false;
			} else {
				newUpdateTime($currentTime, $cid);
				return true;
			}
		} else { 
			if(($currentTime - $_SESSION["updatetGitReposCooldown"][$cid]) > $longdeadline) { // Else use the long deadline
				newUpdateTime($currentTime, $cid);
				return true;
			} else {
				print "Too soon since last update, please wait.";
				return false;
			}
		}
	}

	//--------------------------------------------------------------------------------------------------
	// newUpdateTime: Updates the MySQL database to save the latest update time
	//--------------------------------------------------------------------------------------------------

	function newUpdateTime ($currentTime, $cid) {
		// Connect to database and start session
		pdoConnect();
		session_start();

		// Formats the UNIX timestamp into datetime
		$parsedTime = date("Y-m-d H:i:s", $currentTime); 

		// Fetching the latest update of the course from the MySQL database
		global $pdo;
		$query = $pdo->prepare('UPDATE course SET updated = :parsedTime WHERE cid = :cid;');
		$query->bindParam(':cid', $cid);
		$query->bindParam(':parsedTime', $parsedTime);
		$query->execute();
	}

	//--------------------------------------------------------------------------------------------------
	// refreshGithubRepo: Updates the metadata from the github repo if there's been a new commit
	//--------------------------------------------------------------------------------------------------

	function refreshGithubRepo($cid){
		clearGitFiles($cid); // Clear the gitfiles table before downloading repo

		// Get old commit and URL from Sqlite 
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

		//If both values are valid
		if($commit == "" && $url == "") {
			print_r("No repo");
		} 
		else {
			if(refreshCheck($_POST['cid'], $_POST['user'])){
				// Get the latest commit from the URL
				$latestCommit = bfs($url,$cid,"GETCOMMIT");
				// Compare old commit in db with the new one from the url
				if($latestCommit != $commit) {
					// Update the SQLite db with the new commit
					$query = $pdolite->prepare('UPDATE gitRepos SET lastCommit = :latestCommit WHERE cid = :cid');
					$query->bindParam(':cid', $cid);
					$query->bindParam(':latestCommit', $latestCommit);
					$query->execute();

					// Download files and metadata
					bfs($url, $cid, "DOWNLOAD");
					print "The course has been updated, files have been downloaded!";
				} else if(http_response_code() == 200) {
					print "The course is already up to date!";
				}
			}
		}
	}

	// -------------==============######## Update Github Repo in Course ###########==============-------------

	//--------------------------------------------------------------------------------------------------
	// updateGithubRepo: Updates the repo url and commit in the SQLite db
	//--------------------------------------------------------------------------------------------------

	function updateGithubRepo($repoURL, $cid) {
		clearGitFiles($cid); // Clear the files before changing git repo
		
		$lastCommit = getCommit($repoURL); // Get the latest commit from the new URL
	
		$pdolite = new PDO('sqlite:../../githubMetadata/metadata2.db');
		$query = $pdolite->prepare("UPDATE gitRepos SET repoURL = :repoURL, lastCommit = :lastCommit WHERE cid = :cid"); 
		$query->bindParam(':cid', $cid);
		$query->bindParam(':repoURL', $repoURL);
		$query->bindParam(':lastCommit', $lastCommit);
		if (!$query->execute()) {
			$error = $query->errorInfo();
			echo "Error updating file entries" . $error[2];
			$errorvar = $error[2];
			print_r($error);
			echo $errorvar;
		} else {
			bfs($repoURL, $cid, "REFRESH");
		}
	}

	//--------------------------------------------------------------------------------------------------
	// clearGitFiles: Clear the gitFiles table in SQLite db when a course has been updated with a new github repo
	//--------------------------------------------------------------------------------------------------

	function clearGitFiles($cid) {
		$pdolite = new PDO('sqlite:../../githubMetadata/metadata2.db');
		$query = $pdolite->prepare("DELETE FROM gitFiles WHERE cid = :cid"); 
		$query->bindParam(':cid', $cid);
		if (!$query->execute()) {
			$error = $query->errorInfo();
			echo "Error updating file entries" . $error[2];
			$errorvar = $error[2];
			print_r($error);
			echo $errorvar;
		}
	}
	
	// -------------==============######## Get latest commit from URL ###########==============-------------

	//--------------------------------------------------------------------------------------------------
	// getCommit: Gets the latest commit from a URL using DOM
	//--------------------------------------------------------------------------------------------------

	//this is useless, do bfs($url,$cid,"GETCOMMIT") instead where applicable, leaving for now due to it being referenced elesewhere
	function getCommit($url) {
		// Turn the HTML from the URL into an DOM document
		$html = file_get_contents($url);
		$dom = new DomDocument;
		$dom->preserveWhiteSpace = FALSE;
		
		// Because of how dom works with html, this is necessary to not fill the screen with errors - the page still prints
		libxml_use_internal_errors(true); 
		$dom->loadHTML($html);
		libxml_use_internal_errors(false);

		//d-none js-permalink-shortcut
		// Find the HTML element that holds the latest commit value
		$href = "";
		$elements = $dom->getElementsByTagName('a');
		foreach ($elements as $element) {	
			print_r("     ".$element->getAttribute('class'));	
			if($element->getAttribute('class')=='Link_StyledLink-sc-14289xe-0 elltiT Link--secondary'){
				$value = $element->getAttribute("href");
				$href = $value;
			}
		}
	
		// Regex to only keep the commit numbers, instead of the entire URL
		$regex = "/^(.*?)\/tree\//";

		// Splitting the string to only keep the commit numbers, then return the value
		if($href != "") {
			$latestCommit = preg_replace($regex, "", $href);
			return $latestCommit;
		} else {
			print_r("No matches in database!");
		}
	}
?>
