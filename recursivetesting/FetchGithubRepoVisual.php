<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body>
	<?php
// Here you paste the appropriate link for the given repo that you wish to inspect and traverse.
	GetGitHubURL('https://github.com/e21krida/Webbprogrammering-Examples');
	function getGitHubURL($url)
	{
		$urlParts = explode('/', $url);
		// In normal GitHub Repo URL:s, the username is the third object separated by a slash
		$username = $urlParts[3];
		// In normal GitHub Repo URL:s, the repo is the fourth object separated by a slash
		$repository = $urlParts[4];
		// Translates the parts broken out of $url into the correct URL syntax for an API-URL 
		$translatedURL = 'https://api.github.com/repos/' . $username . '/' . $repository . '/contents/';
		bfs($translatedURL, $repository);
	}
	?>
</body>

</html>