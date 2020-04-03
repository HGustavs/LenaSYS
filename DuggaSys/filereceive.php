<?php
/********************************************************************************
 *
 * Documentation
 *********************************************************************************
 *
 * Execution Order
 * ---------------------
 * #1  Handle files! One by one  -- if all is ok add file name (if file doesn't exists under a template create it)
 * #2 if variable $storefile == true, then add row(existence) of file into mysql
 * #3 if sent file isn't empty and upload is completed (e.g not a duplicate file that already exists) it checks if there already is a row in the db that is the same, if not, add row to db
 * #4 updates the page, redirects to "fileed.php" with the values for $cid, &coursevers and $vers.
 * -------------==============######## Documentation End ###########==============-------------
 */
date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
//---------------------------------------------------------------------	
include_once "../Shared/basic.php";
include_once "../Shared/sessions.php";
session_start();

pdoConnect(); // Connect to database and start session

$cid = $_SESSION['courseid'];
$vers = getOP('coursevers');
$kind = getOP('kind');
$link = getOP('link');
$selectedfile = getOP('selectedfile');
$error = false;


if (isset($_SESSION['uid'])) {
    $userid = $_SESSION['uid'];
} else {
    $userid = "UNK";
}

$log_uuid = getOP('log_uuid');

$filo = print_r($_FILES, true);
$info = $cid . " " . $vers . " " . $kind . " " . $link . " " . $selectedfile . " " . $error . " " . $filo;
logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "filerecieve.php", $userid, $info);

//  Handle files! One by one  -- if all is ok add file name to database
//  login for user is successful & has either write access or is superuser					
$ha = (checklogin() && (hasAccess($userid, $cid, 'w') || isSuperUser($userid)));
if ($ha) {
    $storefile = false;
    chdir('../');
    $currcvd = getcwd();
    if ($kind == "LINK" && $link != "UNK") {
        //  if link isn't in database (e.g no rows are returned), add it to database
        $query = $pdo->prepare("SELECT count(*) FROM fileLink WHERE cid=:cid AND UPPER(filename)=UPPER(:filename);");
        $query->bindParam(':filename', $link);
        $query->bindParam(':cid', $cid);
        $query->execute();
        $norows = $query->fetchColumn();

        if ($norows == 0) {
            // link isn't in database, insert it
            $query = $pdo->prepare("INSERT INTO fileLink(filename,kind,cid) VALUES(:linkval,'1',:cid);");
            $query->bindParam(':cid', $cid);
            $query->bindParam(':linkval', $link);

            if (!$query->execute()) {
                $error = $query->errorInfo();
                echo "Error updating entries" . $error[2];
            } else {
                $storefile = true;
            }
        }
    } else if ($kind == "GFILE") {
        //  if it is a global file, check if "/templates" exists, if not create the directory
        if (!file_exists($currcvd . "/courses/global")) {
            $storefile = mkdir($currcvd . "/courses/global",0777,true);
        } else {
            $storefile = true;
        }
    } else if ($kind == "LFILE" || $kind == "MFILE") {
        //  if it is a local file or a Course Local File, check if the folder exists under "/courses", if not create the directory
        if (!file_exists($currcvd . "/courses/" . $cid . "/versionIndependence")) {
            echo $currcvd . "/courses/" . $cid;
						$storefile = mkdir($currcvd . "/courses/" . $cid . "/versionIndependence",0777,true);
        } else {
            $storefile = true;
        }
        if ($kind == "LFILE") {
            if (!file_exists($currcvd . "/courses/" . $cid . "/" . $vers)) {
                $storefile = mkdir($currcvd . "/courses/" . $cid . "/" . $vers,0777,true);
            } else {
                $storefile = true;
            }
        }
    }
}

if ($storefile) {
    //  if the file is of type "GFILE"(global) or "MFILE"(course local) and it doesn't exists in the db, add a row into the db
    //				$allowedT = array("application/pdf", "image/gif", "image/jpeg", "image/jpg","image/png","image/x-png","application/x-rar-compressed","application/zip","text/html","text/plain", "application/octet-stream", "text/xml", "application/x-javascript", "text/css", "text/php","text/markdown", "application/postscript", "application/octet-stream","image/svg+xml", "application/octet-stream", "application/octet-stream", "application/msword", "application/octet-stream", "application/octet-stream", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.oasis.opendocument.text", "text/xml", "text/xml","application/octetstream","application/x-pdf", "application/download" , "application/x-download", "application/x-dosexec", "application/x-sharedlib", "text/x-php");
    //				$allowedX = array("pdf","gif", "jpeg", "jpg", "png","zip","rar","html","txt", "java", "xml", "js", "css", "php","md","ai", "psd","svg", "sql", "sr", "doc", "sl", "glsl", "docx", "odt", "xslt", "xsl");

    // Derived from testing files and IANA assignment of MIME types
    $allowedExtensions = [
        "txt" => ["text/plain"],
        "pdf" => ["application/pdf"],
        "gif" => ["image/gif"],
        "jpeg" => ["image/jpeg"],
        "jpg" => ["image/jpeg"],
        "png" => ["image/png"],
        "zip" => ["application/zip"],
        "html" => ["text/html"],
        "java" => ["text/plain"],
        "xml" => ["text/plain", "application/xml"],
        "js" => ["text/plain", "application/javascript"],
        "css" => ["text/plain", "text/css"],
        "php" => ["text/x-php"],
        "sr" => ["text/plain"],
        "md" => ["text/plain", "text/markdown"],
        "svg" => ["image/svg+xml"],
        "sql" => ["text/plain", "application/sql"],
        "doc" => ["application/msword"],
        "docx" => ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
        "odt" => ["application/vnd.oasis.opendocument.text"],
        "md" => ["text/markdown"],
        "dtd" => ["application/octet-stream"],
        "py" => ["text/plain"],
        "bat" => ["text/plain"],
        //	"xslt"	=> [
        "xsl" => ["text/xml"]
        //	"sl"		=> [
        //	"glsl"	=> [
        //	"ai"		=> [
        //	"psd"		=> [
        //	"rar"		=> [
    ];

    $swizzled = swizzleArray($_FILES['uploadedfile']);

    echo "<pre>";
    // Uncomment for debug printing
    //print_r($swizzled);

    foreach ($swizzled as $key => $filea) {
        // Uncomment for debug printing
        //print_r($filea) . "<br />";

        //  if the file has a name (e.g it is successfully sent to "filereceive.php") begin the upload process.
        if ($filea["name"] != "") {
          $temp = explode(".", $filea["name"]);
            $extension = end($temp); //stores the file type
						// Determine file MIME-type
						
						//$filetype = mime_content_type($filea["name"]);
            if (array_key_exists($extension, $allowedExtensions)) {
                //  if file type is allowed, continue the uploading process.
                $fname = $filea['name'];
                // Remove white space and non ascii characters
                $fname = preg_replace('/[[:^print:]]/', '', $fname);
                $fname = preg_replace('/\s+/', '', $fname);

                if ($kind == "LFILE") {
                    $movname = $currcvd . "/courses/" . $cid . "/" . $vers . "/" . $fname;
                } else if ($kind == "MFILE") {
                    $movname = $currcvd . "/courses/" . $cid . "/versionIndependence/" . $fname;
                } else {
                    $movname = $currcvd . "/courses/global/" . $fname;
                }

                // check if upload is successful
                if (move_uploaded_file($filea["tmp_name"], $movname)) {
                    if ($kind == "LFILE") {
                        $query = $pdo->prepare("SELECT count(*) FROM fileLink WHERE cid=:cid AND vers=:vers AND filename=:filename AND kind=4;"); // 1=Link 2=Global 3=Course Local 4=Local
                        $query->bindParam(':vers', $vers);
                    } else if ($kind == "MFILE") {
                        $query = $pdo->prepare("SELECT count(*) FROM fileLink WHERE cid=:cid AND filename=:filename AND kind=3;"); // 1=Link 2=Global 3=Course Local 4=Local
                    } else {
                        $query = $pdo->prepare("SELECT count(*) FROM fileLink WHERE cid=:cid AND filename=:filename AND kind=2;"); // 1=Link 2=Global 3=Course Local 4=Local
                    }

                    $query->bindParam(':filename', $fname);
                    $query->bindParam(':cid', $cid);
                    $query->execute();
                    $norows = $query->fetchColumn();
                    $filesize = filesize($movname);
                    $kindid = -1;

                    //  if returned rows equals 0(the existence of the file is not in the db) add data into the db
                    if ($norows == 0) {
                        if ($kind == "LFILE") {
                            $kindid = 4;
                            $query = $pdo->prepare("INSERT INTO fileLink(filename,kind,cid,vers,filesize) VALUES(:filename,:kindid,:cid,:vers,:filesize);");
                            $query->bindParam(':vers', $vers);
                        } else if ($kind == "MFILE") {
                            $kindid = 3;
                            $query = $pdo->prepare("INSERT INTO fileLink(filename,kind,cid,filesize) VALUES(:filename,:kindid,:cid,:filesize)");
                        } else if ($kind == "GFILE") {
                            $kindid = 2;
                            $query = $pdo->prepare("INSERT INTO fileLink(filename,kind,cid,isGlobal,filesize) VALUES(:filename,:kindid,:cid,'1',:filesize);");
                        }
												
                        $query->bindParam(':cid', $cid);
                        $query->bindParam(':filename', $fname);
                        $query->bindParam(':filesize', $filesize);
                        $query->bindParam(':kindid', $kindid);

                        if (!$query->execute()) {
													$error = $query->errorInfo();
                            echo " Error updating file entries " . $error[2];
                        }
                    }
                    $query = $pdo->prepare("UPDATE fileLink SET filesize=:filesize, uploaddate=NOW() WHERE cid=:cid AND kind=:kindid AND filename=:filename;");
                    $query->bindParam(':filename', $fname);
                    $query->bindParam(':cid', $cid);
                    $query->bindParam(':filesize', $filesize);
                    if ($kind == "LFILE") {
                        $kindid = 4;
                    } else if ($kind == "MFILE") {
                        $kindid = 3;
                    } else if ($kind == "GFILE") {
                        $kindid = 2;
                    }
                    $query->bindParam(':kindid', $kindid);

                    if (!$query->execute()) {
                        
                        echo "Error updating filesize and uploaddate: " . $error[2];
                        $error = $query->errorInfo();
                    }

                } else {
                    echo "Error moving file " . $movname;
                    $error = true;
                }

            } else {
								//if the file extension is not allowed
                if (!array_key_exists($extension, $allowedExtensions)) echo "Extension \"" . $extension . "\" not allowed.\n";
                //else echo "Type \"$filetype\" not valid for file extension: \"$extension\"" . "\n";
                $error = true;
            }
        }
    }
} else {
    echo "No file found - check upload_max_filesize and post_max_size in php.ini";
    $error = true;
}

logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "filerecrive.php", $userid, $info);
if (!$error) {
    echo "<meta http-equiv='refresh' content='0;URL=fileed.php?cid=" . $cid . "&coursevers=" . $vers . "' />";  //update page, redirect to "fileed.php" with the variables sent for course id and version id
}

?>
<html>
<head>
</head>
<body>
<?php
if (!$error) {
    echo "<script>window.location.replace('fileed.php?cid=" . $cid . "&coursevers=" . $vers . "');</script>"; //update page, redirect to "fileed.php" with the variables sent for course id and version id
}
?>
</body>
</html>
