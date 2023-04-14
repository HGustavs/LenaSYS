<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
	<script>
		// Get url from db/courseGitURL instead of hardcoding
		//var url = 'https://github.com/HGustavs/LenaSYS';
		//var urledit = url.replace('.git', ''); //remove ending


			
	</script>
</head>
<body>
	<?php 
	  // print_r();

		// Get the contents of the HTML page
		$html = file_get_contents('https://github.com/HGustavs/LenaSYS'); // Fails to load latest commit unless clearing cache on reload
		
		// Parse the HTML with DOM document 
		// $dom = new DomDocument;
 		// $dom->preserveWhiteSpace = FALSE;
		// $dom->loadHTML($html);


		echo "<script>";
		echo "const regexp = /^<a-href=\"(.*?)\/commit\//;";
		echo "var link = ".$html.".querySelectorAll('.f6 a');";
		echo "for(let i = 0; i<link.length; i++){";
		echo "if(i.match(regexp)){";
		echo "console.log(link[i]);";
		echo "}}</script>";


		//  $divs = $html->getElementsByTagName('div');
    //     foreach ($divs as $div) {
		// 			echo "hej";
		//  			if($div->attribute('class')=='Box'){
		//  				echo "Attribute '$div'";

		// 			 }
					
    //    }

				// getElementByClassName('Box');
				// 	if($div->nodeName == 'a'){

				// 		$link = $div->getAttribute('href');
				// 		echo print_r($link->nodeValue);
				// 	 }

		// echo print_r($dom);
	?>
</body>
</html>