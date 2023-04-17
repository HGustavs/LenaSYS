<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
</head>
<body>
	<?php 
		// Used to display errors on screen since PHP doesn't do that automatically.
		ini_set('display_errors', 1);
		ini_set('display_startup_errors', 1);
		error_reporting(E_ALL);

		$html = file_get_contents("https://github.com/HGustavs/LenaSYS"); // Fails to load latest commit unless clearing cache on reload
		$dom = new DomDocument;
		$dom->preserveWhiteSpace = FALSE;
		
		// Because of how dom works with html, this is necessary to not fill the screen with errors - the page still prints
		libxml_use_internal_errors(true); 
		$dom->loadHTML($html);
		libxml_use_internal_errors(false);

		//$orgUrl = "HGustavs/LenaSYS/commit"; // temporary until we get the actual url needed
		$regex = "/^(.*?)\/commit\//";

		// Go through the document
		$links = $dom->getElementsByTagName('a');
		foreach ($links as $link) {
			$value = $link->getAttribute("href");
			if(preg_match($regex, $value)) {
				echo "<p>".$value."</p>"; // Print the link if it matches the regex
			}
		}

		//print_r($dom);
	?>

</body>
</html>