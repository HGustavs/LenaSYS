<!DOCTYPE html>
<html lang="en">
<script src="recursivejs.js" type="module"></script>
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
		<?php
		bfs("https://api.github.com/repos/HGustavs/Webbprogrammering-Examples/contents/");

		function bfs($url){
			$opts = [
				'http' => [
					'method' => 'GET',
					'header' => [
						'User-Agent: PHP'
						]
						]
					];
			$context = stream_context_create($opts);
			print_r("<br><br>Im sending: <br>");
			print_r($url);
			$content = file_get_contents($url, false, $context);
			$contentArr = json_decode($content, true);
			echo "<table style='border: 1px solid black'>";
			echo "<td>";

			foreach($contentArr as $key => $value) {
				echo "<tr><td>" . $key . "</td>";
				if(is_array($value) == true) {
					foreach($value as $k2 => $v2) {
						echo "<td>" . $k2 . "</td>";
					}
				} else
					echo "<td>" . $value . "</td></tr>";

				if($value["type"] == "dir") {
					// print_r($value);
					bfs($url . "/" . $value["name"]);
				} else {
					// print_r("<br><br>This is a file<br>");
					// print_r($value["git_url"]);
				}
			}

			echo "</tr>";
			echo "</table>";
		}
		?>
    </body>
</html>