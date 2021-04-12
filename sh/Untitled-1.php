
#If we get more than one match to the URL we display error message

function detectMultiple($course){
	global $pdo;
	$keyword = "SELECT * FROM keylist"; 
	if ($course == $keyword) {
		echo "key does not exist";
	} else {
		header("Location: ". queryToUrl($course, $assignment));
    exit();
	}
	
	
}
