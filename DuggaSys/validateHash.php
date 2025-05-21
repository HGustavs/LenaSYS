<?php
    session_start();
    date_default_timezone_set("Europe/Stockholm");

    // Include basic application services!
    include_once "../Shared/basic.php";
    include_once "../Shared/sessions.php";

    // Connect to database and start session
    pdoConnect();    
    $hash=$_SESSION['checkhash'];
    $hashpwd = getOP('hashpwd');
    if($hashpwd!="UNK"){
        $sql="SELECT vid,variant.variantanswer AS variantanswer,useranswer,param,cid,vers,quiz,moment FROM userAnswer LEFT JOIN variant ON userAnswer.variant=variant.vid WHERE hash=:hash AND password=:hashpwd";
        $query = $pdo->prepare($sql);
        $query->bindParam(':hash', $hash);
        $query->bindParam(':hashpwd', $hashpwd);
        $query->execute();
        foreach($query->fetchAll() as $row){
            $variant=$row['vid'];
            $answer=$row['useranswer'];
            $variantanswer=$row['variantanswer'];
            $param=html_entity_decode($row['param']);
            $newcourseid=$row['cid'];
            $newcoursevers=$row['vers'];
            $newduggaid=$row['quiz'];
            $newmoment=$row['moment'];
        }
        $_SESSION['should-validate'] = "FALSE";

        if(isset($param)){
            $_SESSION["submission-$newcourseid-$newcoursevers-$newduggaid-$newmoment"]=$hash;
            $_SESSION["submission-password-$newcourseid-$newcoursevers-$newduggaid-$newmoment"]=$hashpwd;
            $_SESSION["submission-variant-$newcourseid-$newcoursevers-$newduggaid-$newmoment"]=$variant;
            $parentDir = basename(dirname(__DIR__));
            $link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]/$parentDir/sh/?s=$hash";
            header("Location: $link");
            exit();	
        }else{
            header("Location: ../errorpages/404.php");
		    exit();	
        }
    }
?>
<!DOCTYPE html>
<html>
<head>
	<link rel="icon" type="image/ico" href="../Shared/icons/favicon.ico"/>
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/markdown.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/dugga.css" rel="stylesheet">

    <!-- This is for dark mode -->
    <link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
	<link id="themeBlack" type="text/css" href="../Shared/css/blackTheme.css" rel="stylesheet">

    <script src="darkmodeToggle.js"></script>
	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  	<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  	<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
	<script src="../Shared/dugga.js"></script>
	<script src="../Shared/markdown.js"></script>
	<script>var querystring=parseGet();</script>
</head>
<body>	
<?php

	$noup="SECTION";
	include '../Shared/navheader.php';

?>

	<div id='loadDuggaBox' class="loginBoxContainer" style="display:flex">
	  <div class="loadDuggaBox formBox">
			<div class='formBoxHeader'><h3>Load dugga with hash</h3><div class='cursorPointer' onclick="hideLoadDuggaPopup()">x</div></div>
			<div id='loadDuggaInfo'></div>
    		<div id='loadDuggaPopup' style="display:block">
                <form method="post" >
				<div class='inputwrapper'><span>Enter hash:</span><input class='textinput' type='text' id='hash' placeholder='Hash' value='<?php echo $_SESSION['checkhash'] ?>' autocomplete="off" disabled/></div>
				<div class='inputwrapper'><span>Enter hash password:</span><input class='textinput' type='text' id='hashpwd' name='hashpwd' placeholder='Hash password' value='' autocomplete="off"/></div>
				<div class="button-row">
					<input type='submit' class='submit-button' onclick="loadDugga();" value='Load Dugga'>
				</div>
                </form>
    		</div>
      </div>
	</div>

</body>
</html>
