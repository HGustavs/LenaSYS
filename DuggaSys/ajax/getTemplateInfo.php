<?php
if(isset($_POST['template'])){
	$templatePath = '../templates/'.$_POST['template'].'.js';
	if (file_exists($templatePath)) {
		$lines = file($templatePath);
		$startTag = "[DESCRIPTION]";
		$endTag = "[/DESCRIPTION]";
		$print = false;
		$descriptionExists = false;
		foreach ($lines as $line) {
			if(strpos(" ".$line, $endTag)) {
				break;
			}
			if($print) {
				print trim(preg_replace('/\t+/', '', $line))."</br>";
				$descriptionExists = true;
			}
			if(strpos(" ".$line, $startTag)) {
				$print = true;
			}
		}
		if(!$descriptionExists) {
			print "There is no description for ".$_POST['template'].".</br> Please contact the template author for right parameter description.";
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
