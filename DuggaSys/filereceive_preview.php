<?php
/********************************************************************************

Documentation

 *********************************************************************************

Execution Order
---------------------
#1  Handle files! One by one  -- if all is ok add file name (if file doesn't exists under a template create it)
#2 if variable $storefile == true, then add row(existence) of file into mysql
#3 if sent file isn't empty and upload is completed (e.g not a duplicate file that already exists) it checks if there already is a row in the db that is the same, if not, add row to db
#4 updates the page, redirects to "fileed.php" with the values for $cid, &coursevers and $vers.
-------------==============######## Documentation End ###########==============-------------
 */
date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
//---------------------------------------------------------------------
include_once "../Shared/basic.php";
include_once "../Shared/sessions.php";
session_start();

pdoConnect(); // Connect to database and start session

$cid=getOP('cid');
$vers=getOP('coursevers');
$kind=getOP('kind');
$fileName=getOP('filename');
$inputText=gettheOP('markdowntext');
$error=false;

if(isset($_SESSION['uid'])){
    $userid=$_SESSION['uid'];
}else{
    $userid="UNK";
}

$log_uuid = getOP('log_uuid');

$filo=print_r($_FILES,true);
$info=$cid." ".$vers." ".$kind." ".$fileName." ".$error." ".$filo;
logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "filerecieve_preview.php",$userid,$info);

//  Handle files! One by one  -- if all is ok add file name to database
//  login for user is successful & has either write access or is superuser

$ha = (checklogin() && (hasAccess($userid, $cid, 'w') || isSuperUser($userid)));

if($ha){
    chdir("../");
    $currcwd = getcwd();

    if ($kind==2) {
        $currcwd .= "/courses/global/".$fileName;
    }  else if($kind == 3) {
        $currcwd .= "/courses/".$cid."/".$fileName;
    } else if($kind == 4) {
        $currcwd .= "/courses/".$cid."/".$vers."/".$fileName;
    }
    if(file_exists($currcwd)){
        if(file_put_contents($currcwd, $inputText)){
            $fileSize = filesize($currcwd);

            if($kind == 2) {
                $query = $pdo->prepare("UPDATE fileLink SET filesize=:filesize, uploaddate=NOW() WHERE kind=:kindid AND filename=:filename;");

            }else if ($kind == 3) {
                $query = $pdo->prepare("UPDATE fileLink SET filesize=:filesize, uploaddate=NOW() WHERE cid=:cid AND kind=:kindid AND filename=:filename;");
                $query->bindParam(':cid', $cid);
            } else if($kind == 4) {
                $query = $pdo->prepare("UPDATE fileLink SET filesize=:filesize, uploaddate=NOW() WHERE vers=:vers AND cid=:cid AND kind=:kindid AND filename=:filename;");
                $query->bindParam(':cid', $cid);
                $query->bindParam(':vers', $vers);
            }

            $query->bindParam(':filename', $fileName);
            $query->bindParam(':filesize', $fileSize);
            $query->bindParam(':kindid', $kind);

            if (!$query->execute()) {
                $error = $query->errorInfo();
                echo "Error updating filesize and uploaddate: " . $error[2];
            }
        } else {
            echo "Something went wrong when updating the file, Try again?";
            $error = True;
        }

    } else {
        echo "The file you trying to update doesn't exist";
        $error = True;
    }
}

logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "filerecieve_preview.php", $userid, $info);

if (!$error) {
    echo "<meta http-equiv='refresh' content='0;URL=fileed.php?cid=" . $cid . "&coursevers=" . $vers . "' />";  //update page, redirect to "fileed.php" with the variables sent for course id and version id
}

?>
<html>
<head>
</head>
<body>
<?php
    if($ha){
        echo "cid = " . $cid . "<br>";
        echo "vers = " . $vers . "<br>";
        echo "kind = " . $kind . "<br>";
        echo "selectedfile = " . $fileName . "<br>";
        echo "error = " . $error . "<br>";
        echo "cwd = " . $currcwd . "<br>";
        echo "fileSize" . $fileSize . "<br>";
        echo "<br>";
        echo "Input text: <br>";
        echo  $inputText;
    }

?>
</body>
</html>
