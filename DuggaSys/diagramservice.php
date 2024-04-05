<?php
    /********************************************************************************

        diagramservice.php, reads github activity data for a user (Including number of
        issues created, comments posted, lines of code modified) for every week and
        returns it in a JSON object). 
        
        Read and retrieve diagrams from course or hash. Save diagrams to server.

    ********************************************************************************/
    date_default_timezone_set("Europe/Stockholm");
    // Include basic application services!
    include_once "../Shared/sessions.php";
    include_once "../Shared/basic.php";
    // Connect to database and start session
    pdoConnect();
    session_start();
    if (isset($_SESSION['uid'])) {
        $userid = $_SESSION['uid'];
        $loginname = $_SESSION['loginname'];
        $lastname = $_SESSION['lastname'];
        $firstname = $_SESSION['firstname'];
    } else {
        $userid = 1;
        $loginname = "UNK";
        $lastname = "UNK";
        $firstname = "UNK";
    }

    if (isset($_GET["opt"]) && isset($_GET["courseid"]) && isset($_GET["coursename"])) {
        try {
            $opt = getOP('opt');
            $courseid=getOP('courseid');
            $coursename=getOP('coursename');
        
    
            $log_uuid = getOP('log_uuid');
            $info="opt: ".$opt." courseid: ".$courseid." coursename: ".$coursename;
            //logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "diagramservice.php",$userid,$info);
    
            $log_db = new PDO('sqlite:../../GHdataD.db');
            $gituser = $loginname;
            $startweek = strtotime('2015-03-29');                                   // First monday in january
            $currentweek = $startweek;
            $currentweekend = strtotime("+1 week", $currentweek);
            $weekno = 1;
            $weeks = array();
            $debug = "NONE!";

            do {
                // Number of issues created by user during the interval
                $issues = array();
                $query = $log_db -> prepare('SELECT * FROM issue WHERE author=:gituser AND issuetime>:issuefrom AND issuetime<:issueto;');
                $query -> bindParam(':gituser', $gituser);
                $query -> bindParam(':issuefrom', date('Y-m-d', $currentweek));
                $query -> bindParam(':issueto', date('Y-m-d', $currentweekend));
                $query -> execute();
                $rows = $query -> fetchAll();
                foreach ($rows as $row) {
                    $issue = array('issueno' => $row['issueno'], 'title' => $row['title']);
                    array_push($issues, $issue);
                }
                // Event count of the various kinds of events during interval
                $events = array();
                $query = $log_db -> prepare("SELECT kind,count(kind) as cnt FROM event WHERE event.author=:gituser AND eventtime>:eventfrom AND eventtime<:eventto AND (kind='Assigned' OR kind='Closed' OR kind='Commit' OR kind = 'Reopened') GROUP BY kind");
                $query -> bindParam(':gituser', $gituser);
                $query -> bindParam(':eventfrom', date('Y-m-d', $currentweek));
                $query -> bindParam(':eventto', date('Y-m-d', $currentweekend));
                $query -> execute();
                $rows = $query -> fetchAll();
                foreach ($rows as $row) {
                    $event = array('kind' => $row['kind'], 'cnt' => $row['cnt']);
                    array_push($events, $event);
                }
                // Number of comments posted by the user during the interval
                $comments = array();
                $query = $log_db -> prepare('SELECT * FROM comment WHERE author=:gituser AND commenttime>:commentfrom AND commenttime<:commentto');
                $query -> bindParam(':commentfrom', date('Y-m-d', $currentweek));
                $query -> bindParam(':commentto', date('Y-m-d', $currentweekend));
                $query -> bindParam(':gituser', $gituser);
                $query -> execute();
                $rows = $query -> fetchAll();
                foreach ($rows as $row) {
                    $comment = array('issueno' => $row['issueno'], 'content' => $row['content']);
                    array_push($comments, $comment);
                }
                // Number of lines changed in each file during interval
                $files  = array();
                $query = $log_db -> prepare('SELECT sum(rowcnt) as rowk, * FROM Bfile,Blame where Blame.fileid=Bfile.id and blameuser=:gituser and blamedate>:blamefrom and blamedate<:blameto GROUP BY filename');
                $query -> bindParam(':blamefrom', date('Y-m-d', $currentweek));
                $query -> bindParam(':blameto', date('Y-m-d', $currentweekend));
                $query -> bindParam(':gituser', $gituser);
                $query -> execute();
                $rows = $query -> fetchAll();
                foreach ($rows as $row) {
                    $file = array('path' => $row['path'], 'filename' => $row['filename'], 'lines' => $row['rowk']);
                    array_push($files, $file);
                }
                $week = array(
                    'weekno' => $weekno,
                    'weekstart' => date('Y-m-d', $currentweek),
                    'weekend' => date('Y-m-d', $currentweekend),
                    'events' => $events,
                    'issues' => $issues,
                    'comments' => $comments,
                    'files' => $files
                );
                array_push($weeks, $week);
                $currentweek = $currentweekend;
                $currentweekend = strtotime("+1 week", $currentweek);
                $weekno++;
            } while ($weekno < 11);

            $array = array('debug' => $debug, 'weeks' => $weeks);
            echo json_encode($array);
        } catch (Exception $e) {
            echo 'Message: ' .$e->getMessage();
        }
    }


    // Function for retrieving diagram dugga content
    function getDiagram($cid, $quizid, $pdo) {
        try {  
            $vers=getOPG('coursevers');

            #vars for handling fetching of diagram variant file name
            $variantParams = "UNK";
            $fileContent="UNK";
            $splicedFileName = "UNK";

            #vars for handling fetching of diagram instruction file name and type
            $json = "UNK";
            $fileName = "UNK";
            $gFileName = "UNK";
            $instructions = "UNK";
            $information = "UNK";
            $hash = getOPG('hash');
            $finalArray = array();
            $array = array();
	
            #create request to database and execute it
            $response = $pdo->prepare("SELECT param as jparam FROM variant LEFT JOIN quiz ON quiz.id = variant.quizID WHERE quizID = '$quizid' AND quiz.cid = '$cid' AND disabled = 0;");
            $response->execute();
            $i=0;

            #loop through responses, fetch param column in variant table, splice string to extract file name, then close request.
            #this should probably be re-worked as this foreach loops through all rows, but over-writes variables meaning it's only the latest variant version that's shown to the user.
            #another alternvative could be to add each result in an array and loop through the array in diagram.js to properly filter out wrong variant results.
            foreach($response->fetchAll(PDO::FETCH_ASSOC) as $row)
            {
                $variantParams=$row['jparam'];
                $variantParams = str_replace('&quot;','"',$variantParams);
                $parameterArray = json_decode($variantParams,true);

                //if parameter exists in current variant json param string, assign value. Otherwise, set it to "UNK". Error checking should check if string is "UNK" and "".
                if(!empty($parameterArray))
                {
                    if(isset($parameterArray['diagram_File'])) {
                        $splicedFileName=$parameterArray["diagram_File"];
                    } else {
                        $splicedFileName = "UNK";
                    }

                    if(isset($parameterArray['filelink'])) {
                        $fileName=$parameterArray["filelink"];
                    } else {
                        $fileName = "UNK";
                    }

                    if(isset($parameterArray['type'])) {
                        $fileType=$parameterArray["type"];
                    } else {
                        $fileType = "UNK";
                    }

                    if(isset($parameterArray['gFilelink'])) {
                        $gFileName=$parameterArray["gFilelink"];
                    } else {
                        $gFileName = "UNK";
                    }

                    if(isset($parameterArray['gType'])) {
                        $gFileType=$parameterArray["gType"];
                    } else {
                        $gFileType = "UNK";
                    }
                    
                    //for fetching file content. If file exists in directory path, fetch. Otherwise, go to the next directory and check.
                    if(isset($fileName) && $fileName != "." && $fileName != ".." && $fileName != "UNK" && $fileName != "")
                    {
                        if(file_exists("../courses/global/"."$fileName")) {
                            $instructions = file_get_contents("../courses/global/"."$fileName");
                        } else if(file_exists("../courses/".$cid."/"."$fileName")) {
                            $instructions = file_get_contents("../courses/".$cid."/"."$fileName");
                        } else if(file_exists("../courses/".$cid."/"."$vers"."/"."$fileName")) {
                            $instructions = file_get_contents("../courses/".$cid."/"."$vers"."/"."$fileName");
                        } else {
                            $instructions = "";
                        }
                    }

                    if(isset($gFileName) && $gFileName != "." && $gFileName != ".." && $gFileName != "UNK" && $gFileName != "")
                    {
                        if(file_exists("../courses/global/"."$gFileName")){
                            $information = file_get_contents("../courses/global/"."$gFileName");}
                        else if(file_exists("../courses/".$cid."/"."$gFileName")){
                            $information = file_get_contents("../courses/".$cid."/"."$gFileName");}
                        else if(file_exists("../courses/".$cid."/"."$vers"."/"."$gFileName")){
                            $information = file_get_contents("../courses/".$cid."/"."$vers"."/"."$gFileName");}
                    }


                    #Think this removes certain escape string characters.
                    $pattern = '/\s*/m';
                    $replace = '';
                    $instructions = preg_replace( $pattern, $replace,$instructions);
                    $information = preg_replace( $pattern, $replace,$information);

                    $finalArray[$i]=([$splicedFileName,$fileType,$fileName,$instructions, $gFileType, $gFileName, $information]);
                    $i++;
                }
            }

            #closes pdo connection to database. Causes error if not used as query results are stockpiled and prevents next query usage.
            $response->closeCursor();

            #after itterating through query results, finally load the json file content into $fileContent variable.
            if($splicedFileName != "UNK" && isset($splicedFileName) && $splicedFileName != "." && $splicedFileName != ".." && $splicedFileName != "")
            {
                if(file_exists("../courses/global/"."$splicedFileName")){
                    $fileContent = file_get_contents("../courses/global/"."$splicedFileName");
                } else if (file_exists("../courses/".$cid."/"."$splicedFileName")) {
                    $fileContent = file_get_contents("../courses/".$cid."/"."$splicedFileName");
                }
                else if (file_exists("../courses/".$cid."/"."$vers"."/"."$splicedFileName")) {
                    $fileContent = file_get_contents("../courses/".$cid."/"."$vers"."/"."$splicedFileName");
                }
            }

            // Retrieve a diagram with hash if a hash is definded in query parameters
            if(isset($_SESSION['tempHash']) && $_SESSION['tempHash'] != "UNK")
            {
                $tempDir = strval(dirname(__DIR__,2)."/submissions/{$cid}/{$vers}/{$quizid}/{$_SESSION['hash']}/");
                $latest = time() - (365 * 24 * 60 * 60);
                $current = "diagramSave1.json";	 

                #loop through the directory, fetching all files within and comparing time stamps. If a file has changes made more recently, set that file name as current file.
                #don't check files called "." or ".." as they are hiden directory re-direct files.
                if(is_dir($tempDir)){
                    try{
                        foreach(new DirectoryIterator($tempDir) as $file){
                            $ctime = $file->getCTime();    // Time file was created
                            $fname = $file->GetFileName (); // File name

                            if($fname != "." && $fname != ".."){
                                if( $ctime > $latest ){
                                    $latest = $ctime;
                                    $current = $fname;
                                }
                            }
                        }
                        $latest = $current;
                        $splicedFileName = $current;

                        $myFiles = array_diff(scandir($tempDir, SCANDIR_SORT_DESCENDING), array('.', '..'));
                        $fileContent = file_get_contents("{$tempDir}{$latest}");

                    }
                    catch(Exception $e){
                        echo 'Message: ' .$e->getMessage();
                    }
                }
            }

            // If no file is retrieved, update fileContent
            if($fileContent === "UNK" || $fileContent === "") {
                $fileContent = "NO_FILE_FETCHED";
            }

            // Build return object
            $array["variant"] = [$variantParams, $cid, $vers, "$splicedFileName", "$fileContent"];
            $array["instructions"] = $finalArray;
            
            return json_encode($array);
        } catch (Exception $e) {
            http_response_code(400);
            return "Bad request: missing query parameters courseid and did. " . $e;
        }
    }

    // Get diagram from course/dugga
    if (isset($_GET["courseid"]) && isset($_GET["did"])) {
        header('Content-Type: application/json');
        echo getDiagram($_GET["courseid"], $_GET["did"], $pdo);
        exit();
    }
    
    // Save a diagram if StringDiagram is set
    if(isset($_POST['StringDiagram'])) {
        $str = $_POST['StringDiagram'];
        $hash = $_POST['Hash'];
        save($str,$hash);
        exit();
    }

    // Function for saving a diagram to Save folder
    function save($data, $hash) {
        $getID = fopen("Save/id.txt", "r");
        $a = intval(fread($getID,filesize("Save/id.txt")));
        $myfile = fopen("Save/$a/$hash.txt", "w");
        fwrite($myfile, $data);
    }

    //logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "diagramservice.php",$userid,$info);
?>
