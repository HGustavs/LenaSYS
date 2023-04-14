<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
		<script>
			// Get url from db/courseGitURL instead of hardcoding
			var url = 'https://github.com/HGustavs/LenaSYS';
			var urledit = url.replace('.git', ''); //remove ending

			
		</script>
</head>
<body>
    <?php 
        echo $page = file_get_contents("https://github.com/HGustavs/LenaSYS");

        echo print_r($page);
    ?>
</body>
</html>