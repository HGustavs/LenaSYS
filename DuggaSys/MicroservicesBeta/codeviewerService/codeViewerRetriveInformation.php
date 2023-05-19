<?php
    //TODO: This will crash, don't know what to do with exampleCount yet, since it was porely made from the begining
    Function retrieveCodeViewerInformation(){
        if($exampleCount>0){
            //------------------------------------------------------------------------------------------------
            // Retrieve Information
            //------------------------------------------------------------------------------------------------
            // Read exampleid, examplename and runlink etc from codeexample and template
            $exampleName="";
            $templateId="";
            $styleSheet="";
            $numBox="";
            $exampleNumber=0;
            $playlink="";
            $public="";
            $entryname="";

            $query = $pdo->prepare("SELECT exampleid, examplename, sectionname, runlink, public, template.templateid AS templateid, stylesheet, numbox FROM codeexample LEFT OUTER JOIN template ON template.templateid = codeexample.templateid WHERE exampleid = :exampleid AND cid = :courseID;");
            $query->bindParam(':exampleid', $exampleId);
            $query->bindParam(':courseID', $courseId);
            $query->execute();

            while ($row = $query->FETCH(PDO::FETCH_ASSOC)){
                $exampleName=$row['examplename'];
                $exampleNumber=$row['exampleid'];
                $public=$row['public'];
                $playlink=$row['runlink'];
                $sectionName=$row['sectionname'];
                $templateId=$row['templateid'];
                $styleSheet=$row['stylesheet'];
                $numBox=$row['numbox'];
            }


            // Read ids and names from before/after list
            $beforeAfter = array();
            $beforeAfters = array();

            $query = $pdo->prepare( "SELECT exampleid, sectionname, examplename, beforeid, afterid FROM codeexample WHERE cid = :cid AND cversion = :cvers ORDER BY sectionname, examplename;");
            $query->bindParam(':cid', $courseId);
            $query->bindParam(':cvers', $courseVersion);
            $query->execute();

            while ($row = $query->FETCH(PDO::FETCH_ASSOC)){
                $beforeAfter[$row['exampleid']]=array($row['exampleid'],$row['sectionname'],$row['examplename'],$row['beforeid'],$row['afterid']);
                    array_push($beforeAfters,array($row['exampleid'],$row['sectionname'],$row['examplename'],$row['beforeid'],$row['afterid']));
            }

            // Iteration to find after examples - We start with $exampleId and at most 5 are collected
            $nextExampleCount = 0;
            $forwardExamples = array();
            $currentId=$exampleId;

            do{
                if(isset($beforeAfter[$currentId])){
                    $currentId=$beforeAfter[$currentId][4];
                }else{
                    $currentId=null;
                }
                if($currentId!=null){
                    if(isset($beforeAfter[$currentId])) array_push($forwardExamples,$beforeAfter[$currentId]);
                }
                $nextExampleCount++;
            // Iteration to find before examples - We start with $exampleId and at most 5 are collected
            }while($currentId!=null&&$nextExampleCount<5);

            $backwardExamples = array();
            $currentId=$exampleId;
            $previousExamplesCount = 0;
            do{
                if(isset($beforeAfter[$currentId])){
                    $currentId=$beforeAfter[$currentId][3];
                }else{
                    $currentId=null;
                }
                if($currentId!=null){
                    if(isset($beforeAfter[$currentId]))	array_push($backwardExamples,$beforeAfter[$currentId]);
                }
                $previousExamplesCount++;
            }while($currentId!=null&&$previousExamplesCount<5);

            // Read important lines
            $importantRows=array();
            $query = $pdo->prepare("SELECT boxid, istart, iend FROM improw WHERE exampleid = :exampleid ORDER BY istart;");
            $query->bindParam(':exampleid', $exampleId);
            $query->execute();

            while ($row = $query->FETCH(PDO::FETCH_ASSOC)){
                array_push($importantRows,array($row['boxid'],$row['istart'],$row['iend']));
            }

            // Get all words for each wordlist
            $words = array();
            $query = $pdo->prepare( "SELECT wordlistid,word,label FROM word ORDER BY wordlistid");
            $query->execute();

            while ($row = $query->FETCH(PDO::FETCH_ASSOC)){
                array_push($words,array($row['wordlistid'],$row['word'],$row['label']));
            }

            // Get all wordlists
            $wordLists=array();
            $query = $pdo->prepare( "SELECT wordlistid, wordlistname FROM wordlist ORDER BY wordlistid;");
            $query->execute();

            while ($row = $query->FETCH(PDO::FETCH_ASSOC)){
                array_push($wordLists,array($row['wordlistid'],$row['wordlistname']));
            }

            // Read important wordlist
            $importantWordList=array();
            $query = $pdo->prepare( "SELECT word,label FROM impwordlist WHERE exampleid = :exampleid ORDER BY word;");
            $query->bindParam(':exampleid', $exampleId);
            $query->execute();

            while ($row = $query->FETCH(PDO::FETCH_ASSOC)){
                array_push($importantWordList,$row['word']);
            }

            // Read file lists from database and add only .txt and .md to descdir

            $directories = array();
            $codeDir=array();
            $descDir=array();
            $prevDir=array();
            $query = $pdo->prepare("SELECT fileid,filename,kind FROM fileLink WHERE cid=:cid ORDER BY kind,filename");
            $query->bindParam(':cid', $courseId);

            // Allowed file extensions for each view. Just add an extension as a new string in the array to allow it.
            $codeFiles=array(".html", ".htm", ".xhtml", ".php", ".css", ".js", ".c", ".cpp", ".java", ".sl", ".glsl", ".rib", ".sql", ".xml", ".svg", ".rss", ".json", ".aspx", ".asp");	// File extensions for code view
            $descFiles=array(".txt", ".md", ".doc", ".docx", ".odt");	// File extensions for document view
            $prevFiles=array(".pdf", ".png", ".jpg", ".jpeg", ".svg", ".bmp", ".gif", ".html", ".txt");	// File extensions for preview view

            // We add only local files to code (no reading code from external sources) and allow preview to files or links.
            if(!$query->execute()) {
                    $error=$query->errorInfo();
                    $debug="Error reading entries\n".$error[2];
            }
            $oldkind=2;
            foreach($query->fetchAll() as $row) {
                    // Add separators to separate the current file from all the other files
                    if($row['kind']!=$oldkind){
                        array_push($codeDir,array('fileid' => -1,'filename' => "---===######===---"));
                        array_push($descDir,array('fileid' => -1,'filename' => "---===######===---"));
                        array_push($prevDir,array('fileid' => -1,'filename' => "---===######===---"));
                    }
                    $oldkind=$row['kind'];

                    // List only .md, .txt, etc files for Document view
                    foreach($descFiles as $filetype){
                        if(endsWith($row['filename'],$filetype)){
                            array_push($descDir,array('fileid' => $row['fileid'],'filename' => $row['filename']));
                        }
                    }

                    // List only .js, .css, .html, .c, .cpp, .xml, .sl, .rib, .glsl, .sql, etc files for Code view
                    foreach($codeFiles as $filetype){
                        if(endsWith($row['filename'],$filetype)){
                            array_push($codeDir,array('fileid' => $row['fileid'],'filename' => $row['filename']));
                        }
                    }

                    // List only .pdf, .png, .jpg, .svg, etc for Preview view
                    foreach($prevFiles as $filetype){
                        if(endsWith($row['filename'],$filetype)){
                            array_push($prevDir,array('fileid' => $row['fileid'],'filename' => $row['filename']));
                        }
                    }
                    
            }
            array_push($directories, $codeDir);
            array_push($directories, $descDir);
            array_push($directories, $prevDir);

            // Collects information for each box
            $box=array();
            // Array to be filled with the primary keys to all boxes of the example
            $queryy = $pdo->prepare("SELECT boxid, boxcontent, boxtitle, filename, wordlistid, segment, fontsize FROM box WHERE exampleid = :exampleid ORDER BY boxid;");
            $queryy->bindParam(':exampleid', $exampleId);

            if(!$queryy->execute()) {
                $error=$queryy->errorInfo();
                $debug="Error reading boxes \n".$error[2];
            }
            while ($row = $queryy->FETCH(PDO::FETCH_ASSOC)){
        $boxContent=strtoupper($row['boxcontent']);
                $filename=$row['filename'];
                $content="";

                $ruery = $pdo->prepare("SELECT filename,path,kind from fileLink WHERE (cid=:cid or isGlobal='1') and UPPER(filename)=UPPER(:fname) ORDER BY kind DESC LIMIT 1;");
                $ruery->bindParam(':cid', $courseId);
                $ruery->bindParam(':fname', $filename);
                $sesult = $ruery->execute();
                if($sow = $ruery->fetch(PDO::FETCH_ASSOC)){
                        $filekind=$sow['kind'];
                        $filename = $sow['filename'];
                        $path = $sow['path'];

                        if($filekind==2){
                            // Global
                            $file = "../courses/global/".$filename;
                        }else if($filekind==3){
                            // Course Local
                            if ($path == null)
                                $file = "../courses/".$courseId."/".$filename;
                            else 
                                $file = "../courses/".$courseId."/Github/".$path;

                        }else if($filekind==4){
                            // Local
                            $file = "../courses/".$courseId."/".$courseVersion."/".$path;
                        }else{
                            $file = "UNK";
                        }

                        if(file_exists ($file)){
                                $file_extension = strtolower(substr(strrchr($filename,"."),1));
                                if(strcmp("DOCUMENT",$boxContent)===0){
                                        if($file_extension=="txt"||$file_extension=="md"){
                                                // It is a .txt or .md file that exists!
                                                $buffer=file_get_contents($file);
                                                $content=$content.$buffer;
                                        }else{
                                                $content.="File: ".$filename." is not correctly formatted.";
                                        }
                                }else if(strcmp("IFRAME",$boxContent)===0){
                                        $content=$file;
                                }else{
                                        $buffer=file_get_contents($file);
                                        $content=$content.$buffer;
                                }
                        }else{
                                $content.="File: ".$file." not found.";
                        }
                        $ruery->closeCursor();
                }else{
                        $content.="File: ".$filename." not found.";
                }

                array_push($box,array($row['boxid'],$boxContent,$content,$row['wordlistid'],$row['boxtitle'],$row['filename'], $row['fontsize'], $file, $filekind));
            }
            $array = array(
                'opt' => $opt,
                'before' => $backwardExamples,
                'after' => $forwardExamples,
                'templateid' => $templateId,
                'stylesheet' => $styleSheet,
                'numbox' => $numBox,
                'box' => $box,
                'improws' => $importantRows,
                'impwords' => $importantWordList,
                'directory' => $directories,
                'examplename'=> $exampleName,
                'sectionname'=> $sectionName,
                'playlink' => $playlink,
                'exampleno' => $exampleNumber,
                'words' => $words,
                'wordlists' => $wordLists,
                'writeaccess' => $writeAccess,
                'debug' => $debug,
                'beforeafter' => $beforeAfters,
                'public' => $public,
                'courseid' => $courseId,
                'courseversion' => $courseVersion
            );
            
            function checkForEncodingError($data) {
                if (json_encode($data) === false) {
                    throw new Exception( json_last_error_msg() );
                } 
            }
            try {
                checkForEncodingError($array);
            } catch (Exception $e)  {
                echo $e;
                die;
            }
            echo json_encode($array);
        }else{
            $debug = "Debug: Error occur at line " . __LINE__ . " in file " . __FILE__ . ". There are no examples or the ID of example is incorrect.\n";
            $array = array(
                'debug' => $debug
            );
            echo json_encode($array);

        }
        //This needs to be changed, not sure to what yet
	    logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "codeviewerService.php",$userid,$info);
    }

?>