<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>

	<script>
		var page = '<?php $html; ?>';

		const regexp = /^<a-href=\"(.*?)\/commit\//;
		var link = page.querySelectorAll('.f6 a');
		for(let i = 0; i<link.length; i++) {
			if(i.match(regexp)) {
				console.log(link[i]);
			}
		}

	</script>
</head>
<body>
	<?php 
	  // print_r();
		// Get the contents of the HTML page
		echo $html = file_get_contents("https://github.com/HGustavs/LenaSYS"); // Fails to load latest commit unless clearing cache on reload
	?>

	

</body>
</html>