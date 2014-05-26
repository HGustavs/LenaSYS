<?php
if(isset($_POST['template'])){
	$templatePath = '../templates/'.$_POST['template'].'.js';
	if (file_exists($templatePath)) {
		$lines = file($templatePath);
		$startTag = "[DESCRIPTION]";
		$endTag = "[/DESCRIPTION]";
		$print = false;
		foreach ($lines as $line) {
			if(strpos(" ".$line, $endTag)) {
				break;
			}
			if($print) {
				print trim(preg_replace('/\t+/', '', $line))."</br>";
			}
			if(strpos(" ".$line, $startTag)) {
				$print = true;
			}
		}
	}
	else {
		print "Template does not exist...";
	}
}
else {
	print "A template name is missing...";
}
?>
