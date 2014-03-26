<?php
header("X-UA-Compatible: IE=edge,chrome=1");
session_start();

function htmlsafe($str){
	return $str=htmlspecialchars($str,ENT_QUOTES,'UTF-8');
}
	
function generatePassword($length){
	$arr = str_split('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'); //Array of characters that may occur in the password
    shuffle($arr); //Shuffle array
    $arr = array_slice($arr, 0, $length); //Extract the first $length characters from the shuffled array
    return implode('', $arr); //Make string of the array and return the result
}

function addBackLink($postBacks){
	echo "<form name='backLink' action='.' method='post'>";
	foreach($postBacks as $name=>$value){
		echo "<input type='hidden' name='".$name."' value='".$value."' />";
	}
    echo "<a href='#' onclick='document[\"backLink\"].submit();return false;'><-- Back</a>";
	echo "</form>";
}

$pagetitle = "Quiz system";
$userMsg = "";
$errorMsg = "";

include_once "login/checkLogin.php";

ob_start();
	
if (isset($_POST['logoutLink'])) {
    unset($_SESSION['userName']);
    unset($_SESSION['userPassword']);
    unset($_SESSION['userType']);
    session_destroy();
} else if (checklogin()) {
	
	include "dbconnect.php";

	//Default page
	$content="frontpage.html.php";

	//Include based on menu selection
	if(isset($_POST['dataLink'])) {
		include "data/index.php";
	} else if(isset($_POST['registerStudentsLink']) || isset($_POST['parseSubmit'])) {
		include "registerStudents/index.php";
	} else if(isset($_POST['listStudentsLink'])){
		include "students/index.php";
	} else if(isset($_POST['listQuizzesLink'])){
		include "quiz/index.php";
	} else if(isset($_POST['checkQuizzesLink'])){
		include "quizChecking/index.php";
	}else if(isset($_POST['coursesLink'])){
		include "course/index.php";
	} else if (isset($_POST['searchString'])) {
        include "search/index.php";
    } else {
		$_POST['aboutPageLink']=true;
	}
	ob_end_clean();
	//Enclosing page frame //checkQuizzesLink
	include "pageframe.html.php";
	exit();
} 

include "login/index.php";
exit();
?>