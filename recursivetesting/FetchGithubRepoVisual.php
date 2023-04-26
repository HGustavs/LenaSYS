<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<style>
	html {
		display: flex;
		justify-content: center;
	}

	table {
		margin: 0 auto;
		border-collapse: collapse;
		text-align: left;
		border: 1px solid black;
	}

	th,
	td,
	tr {
		width: 325px;
		padding: 10px;
		border: 1px solid black;
		font-size: 14px;
		text-align: left;
	}
</style>

<body>
	<?php
	// Here you paste the appropriate link for the given repo that you wish to inspect and traverse.
	getGitHubURL('https://github.com/e21krida/Webbprogrammering-Examples');
	function getGitHubURL($url)
	{
		$urlParts = explode('/', $url);
		// In normal GitHub Repo URL:s, the username is the third object separated by a slash
		$username = $urlParts[3];
		// In normal GitHub Repo URL:s, the repo is the fourth object separated by a slash
		$repository = $urlParts[4];
		// Translates the parts broken out of $url into the correct URL syntax for an API-URL 
		$translatedURL = 'https://api.github.com/repos/' . $username . '/' . $repository . '/contents/';
		bfs($translatedURL);
	}

	function bfs($url)
	{
		$visited = array();
		$fifoQueue = array();
		array_push($fifoQueue, $url);

		while (!empty($fifoQueue)) {
			// Randomizes colors for easier presentation
			$R = rand(155, 255);
			$G = rand(155, 255);
			$B = rand(155, 255);
			$currentUrl = array_shift($fifoQueue);
			echo "<h3 style='display: flex; place-content: center;'>" . $currentUrl . "</h3>";
			// Necessary headers to send with the request, 'User-Agent: PHP' is necessary. 
			$opts = [
				'http' => [
					'method' => 'GET',
					'header' => [
						'User-Agent: PHP',
					]
				]
			];
			// Starts a stream with the required headers
			$context = stream_context_create($opts);
			// Fetches the data with the stream included
			$data = @file_get_contents($currentUrl, true, $context);
			if ($data) {
				// Decodes the fetched data into JSON
				$json = json_decode($data, true);
				// Loops through each item fetched in the JSON data
				foreach ($json as $item) {
					if ($json) {
						// Checks if the fetched item is of type 'file'
						if ($item['type'] == 'file') {
							echo '<table style="background-color: rgb(' . $R . ',' . $G . ',' . $B . ')"><tr><th>Name</th><th>URL</th><th>Type</th><th>Size</th><th>Download URL</th><th>SHA</th><th>Path</th></tr>';
							echo '<tr><td>' . $item['name'] . '</td><td><a href="' . $item['html_url'] . '">HTML URL</a></td><td>' . $item['type'] . '</td><td>' . $item['size'] . '</td><td><a href="' . $item['download_url'] . '">Download URL</a></td><td>' . $item['sha'] . '</td><td>' . $item['path'] . '</td></tr>';
							// Checks if the fetched item is of type 'dir'
						} else if ($item['type'] == 'dir') {
							echo '<table style="background-color: rgb(' . $R . ',' . $G . ',' . $B . ')"><tr><th>Name</th><th>URL</th><th>Type</th><th>Size</th><th>Download URL</th><th>SHA</th><th>Path</th></tr>';
							echo '<tr><td>' . $item['name'] . '</td><td><a href="' . $item['html_url'] . '">HTML URL</a></td><td>' . $item['type'] . '</td><td>-</td><td>NULL</td><td>' . $item['sha'] . '</td><td>' . $item['path'] . '</td></tr>';
							if (!in_array($item['url'], $visited)) {
								array_push($visited, $item['url']);
								array_push($fifoQueue, $item['url']);
							}
						}
						echo "</table>";
					} else {
						echo "<h2 style='display: flex; place-content: center;'>Invalid JSON</h2>";
					}
				}
			} else {
				echo "<h2 style='display: flex; place-content: center;'>Invalid Link or Fetch-limited</h2>";
			}
		}
	}
	?>
</body>

</html>