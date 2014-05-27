<?php
if(isset($_POST['template'])){
	$templatePath = '../templates/'.$_POST['template'].'.js';
	if (file_exists($templatePath)) {
		$lines = file($templatePath);
		$startTag = "[DESCRIPTION]";
		$endTag = "[/DESCRIPTION]";
		$print = false;
		$descriptionExists = false;
		$description = "";
		foreach ($lines as $line) {
			if(strpos(" ".$line, $endTag)) {
				$endTag = "exists";
				break;
			}
			if($print) {
				$description .= trim(preg_replace('/\t+/', '', $line))."</br>";
				$descriptionExists = true;
			}
			if(strpos(" ".$line, $startTag)) {
				$startTag = "exists";
				$print = true;
			}
		}
		if($startTag == "exists" && $endTag == "exists") {
			print $description;
		}
		elseif(!$descriptionExists) {
			print "There is no description for ".$_POST['template'].".</br> Please contact the template author for correct parameter description.";
		}
		else {
			print "Can not find any description for ".$_POST['template'].".</br> Please contact the template author for correct parameter description.";			
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
